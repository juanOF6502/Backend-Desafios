const ManagerFactory = require('../repositories/factory')

const productRepository = ManagerFactory.getManagerInstace('products')
const userRepository = ManagerFactory.getManagerInstace('users')

const homeRender = async(req, res) => {
    const { limit = 10, page = 1, sort, query, category, status } = req.query

    const { docs: products, ...pageInfo } = await productRepository.getAllPaged(limit, page, sort, query, category, status)

    pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&limit=${limit}` : ''
    pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&limit=${limit}` : ''

    const renderData = {
        title: 'Home',
        pageInfo,
        products,
        userCart: req.user.cart,
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
    chatRender,
    profileRender
}