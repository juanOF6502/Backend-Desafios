const socket = io()

socket.on('connect', () => {
    console.log(`Cliente conectado: ${socket.id}`)
})

socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`)
})

socket.on('products', (products) => {
    updateProductsView(products)
});

socket.on('newProduct', (product) => {
    addProductByIO(product)
    updateProductsView()
})

function updateProductsView(products) {
    const productsContainer = document.querySelector('#products')
    if(products){
        productsContainer.innerHTML = ''

        products.forEach((product) => {
            const productElement = document.createElement('div')
            productElement.classList.add('col-12', 'col-sm-6', 'col-md-4' ,'col-lg-3')
            productElement.innerHTML = `
                <div class="card mb-5 box-shadow">
                    <img src="static/img/${product.thumbnail}" alt="imagen" class="card-img-top card-img-custom">
                    <div class="card-body">
                        <h3 class="card-title">${product.title}</h3>
                        <div class="d-flex flex-wrap">
                            ${product.category.map((category) => `<p class="text-light bg-info rounded mx-1 px-2 fs-6">${category}</p>`)
                                .join('')
                            }
                        </div>
                        <h5>USD $${product.price}</h5>
                        <p>${product.description}</p>
                        <button onclick="addToCart(${product.id})" class="btn btn-dark btn-sm">Agregar al carrito</button>
                    </div>
                </div>
            `

            productsContainer.appendChild(productElement)
        })
    }
}

function addProductByIO(product){
    const realTimeProducts = document.querySelector('#products')
    const div = document.createElement('div')
    div.classList.add('col-12', 'col-sm-6', 'col-md-4' ,'col-lg-3')
    div.innerHTML = `
        <div class="card mb-5 box-shadow">
            <img src="static/img/${product.thumbnail}" alt="imagen" class="card-img-top card-img-custom">
            <div class="card-body">
                <h3 class="card-title">${product.title}</h3>
                <div class="d-flex flex-wrap">
                    ${product.category.map((category) =>  `<p class="text-light bg-info rounded mx-1 px-2 fs-6">${category.charAt(0).toUpperCase() + category.slice(1)}</p>`)
                        .join('')
                    }
                </div>
                <h5>USD $${product.price}</h5>
                <p>${product.description}</p>
                <button onclick="addToCart(${product.id})" class="btn btn-dark btn-sm">Agregar al carrito</button>
            </div>
        </div>`

    realTimeProducts.appendChild(div)
}

function deleteProduct(event) {
    event.preventDefault();
    const productId = document.getElementById('product-id').value
    
    socket.emit('deleteProduct', productId)

    document.querySelector('#product-id').value = ''
}