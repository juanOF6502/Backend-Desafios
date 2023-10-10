const { v4: uuidv4 } = require('uuid')

const { CustomError, ErrorType } = require('../errors/custom.error')
const ManagerFactory = require('../repositories/factory')
const { developmentLogger, productionLogger } = require('../logger')

const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger
const productRepository = ManagerFactory.getManagerInstace('products')
const userRepository = ManagerFactory.getManagerInstace('users')
const cartRepository = ManagerFactory.getManagerInstace('carts')
const ticketRepository = ManagerFactory.getManagerInstace('tickets')

const homeRender = async(req, res) => {
    const { limit = 10, page = 1, sort, query, category, status } = req.query

    const { docs: products, ...pageInfo } = await productRepository.getAllPaged(limit, page, sort, query, category, status)

    if(!products){
        throw new CustomError('Error obtaining products', ErrorType.DB_ERROR)
    }

    pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&limit=${limit}` : ''
    pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&limit=${limit}` : ''

    const renderData = {
        title: 'Home',
        pageInfo,
        products,
        userCart: req.user.cart._id,
        user: req.user ?  {
            ...req.user,
            isUser: req.user?.role == 'Usuario',
            isAdmin: req.user?.role == 'Admin',
        } : null,
        style: 'home'
    }
    if (req.originalUrl !== '/chat') {
        renderData.showChatIcon = true
    }

    res.render('home', renderData)
}

const productCategoriesRender = async (req, res) => {
    const { category } = req.params
    const { limit = 10, page = 1, sort, query, status } = req.query

    const { docs: products, ...pageInfo } = await productRepository.getAllPaged(limit, page, sort, query, category, status)

    if(!products){
        throw new CustomError('Error obtaining products', ErrorType.DB_ERROR)
    }

    pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&limit=${limit}` : ''
    pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&limit=${limit}` : ''


    const renderData = {
        title: 'Home',
        pageInfo,
        products,
        userCart: req.user.cart,
        user: req.user ? {
            ...req.user,
            isUser: req.user?.role == 'Usuario',
            isAdmin: req.user?.role == 'Admin'
        }: null,
        style: 'home'
    }

    if (req.originalUrl !== '/chat') {
        renderData.showChatIcon = true
    }

    res.render('home', renderData)
}

const mockingproductsRender = async (req, res) => {
    const { limit = 12, page = 1 } = req.query

    const products = await productRepository.getAllMockProducts(limit, page)

    if(!products){
        throw new CustomError('Error obtaining mock products', ErrorType.GENERAL_ERROR)
    }

    const hasPrevPage = page > 1;
    const hasNextPage = products.length === limit;
    const prevLink = hasPrevPage ? `/mockingproducts?page=${parseInt(page) - 1}` : null;
    const nextLink = hasNextPage ? `/mockingproducts?page=${parseInt(page) + 1}` : null;

    const renderData = {
        title: 'Mock Products',
        products,
        userCart: req.user.cart._id,
        user: req.user ?  {
            ...req.user,
            isUser: req.user?.role == 'Usuario',
            isAdmin: req.user?.role == 'Admin',
        } : null,
        pageInfo: {
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
            page: parseInt(page),
        },
        style: 'home'
    }

    if (req.originalUrl !== '/chat') {
        renderData.showChatIcon = true
    }

    res.render('mockingproducts', renderData)
}

const realTimeProductsRender = async(req, res) => {
    const renderData = {
        title: 'Real Time Products',
        style: 'home'
    }

    if (req.originalUrl !== '/chat') {
        renderData.showChatIcon = true
    }

    res.render('realTimeProducts', renderData)
}

const cartRender = async (req,res) => {
    try {
        const user = await userRepository.populateUser(req.user._id)

        if (!user) {
            throw new CustomError('Error obtaing user', ErrorType.NOT_FOUND)
        }

        const cart = user.cart ?? { products: [] }

        const total = cart.products.reduce((acc, item) => acc + item.product.price * item.qty, 0)

        res.render('carrito', {
            title: 'Carrito',
            products: cart.products,
            total: total,
            user: req.user ? {
                ...req.user,
                isUser: req.user?.role == 'Usuario',
                isAdmin: req.user?.role == 'Admin'
            } : null,
            style: 'home'
        })

    } catch (error) {
        logger.error(error)
        res.status(500).send('Autorizacion no permitida')
    }
}

const purchaseRender = async (req,res) => {
    try {
        const cart = await cartRepository.getByInstance(req.user.cart._id)

        const { products: productsInCart} = cart
        const products = []
        const productsNotPurchased = []

        for (const { product: id, qty} of productsInCart) {
            const item = await productRepository.getByInstance(id)

            if (item.stock < qty) {
                productsNotPurchased.push({
                    product: id,
                    qty
                });
                continue;
            }

            const toBuy = item.stock >= qty ? qty : item.stock

            products.push({
                product: id,
                title: item.title,
                qty: toBuy,
                price: item.price
            })

            item.stock = item.stock - toBuy

            await item.save()
        }

        const po = {
            purchaser: req.user.email,
            code: uuidv4(),
            amount: products.reduce((total, { price, qty }) => (price * qty ) + total,0),
            products: products.map(({ product, title, price, qty }) => ({ product, title, price, qty })),
            purchase_datetime: new Date().toLocaleString()
        }

        await ticketRepository.create(po)

        cart.products = productsNotPurchased
        
        await cart.save()
        
        res.render('purchase', {
            title: 'Purhcase',
            po: po,
            style: 'home'
        })
    } catch (error) {
        logger.error(error)
        throw new CustomError('Error al realizar la compra', ErrorType.GENERAL_ERROR)
    }
}

const chatRender = (req, res) => {
    res.render('chat', {
        title: 'Chat',
        userCart: req.user.cart,
        user: req.user ?  {
            ...req.user,
            isUser: req.user?.role == 'Usuario',
            isAdmin: req.user?.role == 'Admin',
        } : null,
        style: 'home'
    })
}

const profileRender = (req, res) => {
    res.render('profile', {
        user: req.user ? {
            ...req.user,
            isUser: req.user?.role == 'Usuario',
            isAdmin: req.user?.role == 'Admin'
        }: null
    })
}


module.exports = {
    homeRender,
    productCategoriesRender,
    realTimeProductsRender,
    mockingproductsRender,
    cartRender,
    purchaseRender,
    chatRender,
    profileRender
}