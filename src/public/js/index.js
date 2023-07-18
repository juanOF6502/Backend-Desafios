const socket = io();

socket.on('connect', () => {
    console.log(`Cliente conectado: ${socket.id}`);
});

socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
});

socket.on('products', (products) => {
    updateProductsView(products);
});


function updateProductsView(products) {
    const productsContainer = document.querySelector('#products');
    productsContainer.innerHTML = '';

    products.forEach((product) => {
        const productElement = document.createElement('div');
        productElement.classList.add('col-md-3');
        productElement.innerHTML = `
            <div class="card mb-5 box-shadow">
                <img src="static/img/${product.thumbnail}" alt="imagen" class="card-img-top card-img-custom">
                <div class="card-body">
                    <h3 class="card-title">${product.title}</h3>
                    <h5>USD $${product.price}</h5>
                    <p>${product.description}</p>
                    <button onclick="addToCart(${product.id})" class="btn btn-dark btn-sm">Agregar al carrito</button>
                </div>
            </div>
        `;

        productsContainer.appendChild(productElement);
    });
}


function addProduct(event) {
    event.preventDefault();
    const title = document.querySelector('#product-title').value;
    const price = document.querySelector('#product-price').value;
    const description = document.querySelector('#product-description').value;
    const thumbnail = document.querySelector('#product-thumbnail').value;
    const code = document.querySelector('#product-code').value;
    const stock = document.querySelector('#product-stock').value;
    const status = document.querySelector('#product-status').value === 'true';
    const category = document.querySelector('#product-category').value;

    const newProduct = {
        title,
        price,
        description,
        thumbnail,
        code,
        stock,
        status,
        category
    };

    
    socket.emit('addProduct', newProduct);

    
    document.querySelector('#product-title').value = '';
    document.querySelector('#product-price').value = '';
    document.querySelector('#product-description').value = '';
    document.querySelector('#product-thumbnail').value = '';
    document.querySelector('#product-code').value = '';
    document.querySelector('#product-stock').value = '';
    document.querySelector('#product-status').value = 'true';
    document.querySelector('#product-category').value = '';
}


function deleteProduct(event) {
    event.preventDefault();
    const productId = document.getElementById('product-id').value;
    
    socket.emit('deleteProduct', productId);

    document.querySelector('#product-id').value = '';
}