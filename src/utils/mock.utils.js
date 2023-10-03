const { faker } = require('@faker-js/faker')

const generateProducts = () => {
    const products = []

    for (let i = 0; i < 100; i++) {
        const product = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.urlPicsumPhotos(),
        code: faker.commerce.isbn(),
        stock: faker.number.int(50),
        status: true,
        category: faker.commerce.productMaterial(),
        }

        products.push(product)
    }

    return products
}

module.exports = { generateProducts }