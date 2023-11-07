const chai = require('chai')
const supertest = require('supertest')

const expect = chai.expect
const requestor = supertest('http://localhost:8080')

describe('Integration - Backend', () => {
    describe('Products', () => {
        let idProduct

        it('Products - /GET', async () => {
            const response = await requestor.get('/api/products')

            expect(response.status).to.equal(200)
        })

        it('Products - /POST', async() => {
            const product = {
                title: 'New Product',
                description: 'Product description',
                price: 19.99,
                thumbnail: 'product.jpg',
                code: 'ABC123',
                stock: 10,
                status: true,
                category: ['category1', 'category2'],
                owner: '65158d6aa5962182d5bd49ec' 
            }

            const response = await requestor.post('/api/products').send(product)

            idProduct = response.body._id

            expect(response.statusCode).to.equal(201)
        })
        
        it('Products - /PUT', async () => {
            const updatedData = {
                title: 'New Updated Product',
                description: 'Updated Product description',
                price: 19.99,
                thumbnail: 'product.jpg',
                code: 'ABC123',
                stock: 10,
                status: true,
                category: ['category1', 'category2'],
                owner: '65158d6aa5962182d5bd49ec' 
            }
    
            const response = await requestor.put(`/api/products/${idProduct}`).send(updatedData)
            expect(response.statusCode).to.equal(200)
        })

        it('Products - /DELETE', async () => {
            const response = await requestor.delete(`/api/products/${idProduct}`)

            expect(response.statusCode).to.equal(200)
        })
    })

    describe('Carts', () => {
        let idCart

        it('Carts - /GET', async () => {
            const response = await requestor.get('/api/carts')

            expect(response.statusCode).to.equal(200)
        })
        
        it('Carts - /POST', async () => {
            const cart = {
                products: [
                    {
                        product: '64cc284d03b0eb6f955fac86',
                        qty: 1,
                    },
                    {
                        product: '64cc284d03b0eb6f955fac87', 
                        qty: 1,
                    }
                ]
            }

            const response = await requestor.post('/api/carts').send(cart)

            idCart = response.body._id

            expect(response.statusCode).to.equal(200)
        })
        
        it('Carts - /DELETE', async () => {
            const response = await requestor.delete(`/api/carts/${idCart}`)

            expect(response.statusCode).to.equal(200)
        })
    })

    describe('Sessions', () => {
        it('Sessions - /SIGNUP', async () => {
            const newUser = {
                firstname: 'Test',
                lastname: 'User',
                email: 'testuser@example.com',
                age: 30,
                gender: 'Hombre',
                password: 'newuserpassword',
                password2: 'newuserpassword',
            }
    
            const response = await requestor.post('/signup').send(newUser)
            expect(response.statusCode).to.equal(302)
        })
    
        it('Sessions - /LOGIN', async () => {
            const userCredentials = {
                email: 'testuser@example.com',
                password: 'newuserpassword',
            }
    
            const response = await requestor.post('/login').send(userCredentials)
    
            expect(response.statusCode).to.equal(302)
        })
    
        it('Sessions - /UNAUTHORIZED LOGIN', async () => {
            const invalidCredentials = {
                email: 'invaliduser@example.com',
                password: 'invalidpassword',
            }
    
            const response = await requestor.post('/login').send(invalidCredentials)
    
            expect(response.statusCode).to.equal(302)
        })
    })
})