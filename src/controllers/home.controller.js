const ManagerFactory = require('../repositories/factory')

const productRepository = ManagerFactory.getManagerInstace('products')
const userRepository = ManagerFactory.getManagerInstace('users')
const cartRepository = ManagerFactory.getManagerInstace('carts')
const ticketRepository = ManagerFactory.getManagerInstace('tickets')

let lastOrderNumber = 0

const generateNextOrderNumber = () => {
    lastOrderNumber++
    const paddedNumber = lastOrderNumber.toString().padStart(3, '0')
    return `PO${paddedNumber}`
}


const homeRender = async(req, res) => {
    const { limit = 10, page = 1, sort, query, category, status } = req.query

    const { docs: products, ...pageInfo } = await productRepository.getAllPaged(limit, page, sort, query, category, status)

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
    const user = await userRepository.populateUser(req.user._id)

    if (user) {
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
        });
    } else {
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
            code: generateNextOrderNumber(),
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
        console.error(error)
        res.sendStatus(500)
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
    cartRender,
    purchaseRender,
    chatRender,
    profileRender
}