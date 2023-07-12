# Documentaicion Proyecto Backend

# Managers
## Carrito Manager: Metodos

### getAllCarts(): 
    Recupera todos los carritos almacenados.

### getCartById(id)
    Recupera un carrito por su ID.
    Parámetros: 
+ id: El ID del carrito que se desea recuperar.

### createCart()
    Crea un nuevo carrito.

### addProductCart(id, product)
    - Agrega un producto a un carrito existente.
    - Parámetros: 
+ id:  El ID del carrito al que se desea agregar el producto.
+ product:  El ID del producto que se desea agregar.

## ProductManager: Metodos

### getProducts()
    Recupera todos los productos almacenados.
### getProductById(id)
    Recupera un producto por su ID.
    Parámetros: id - El ID del producto que se desea recuperar.
### createProduct(product)
    Crea un nuevo producto.
    Parámetros: product - Un objeto que contiene los detalles del producto, incluyendo title, description, price, thumbnail, code, category y stock.
### saveProduct(id, product)
    Guarda cambios en un producto existente.
    Parámetros: id - El ID del producto que se desea modificar.
                product - Un objeto que contiene los campos actualizados del producto. Los campos no proporcionados conservarán su valor actual.
### deleteProduct(id)
    Elimina un producto.
    Parámetros: id - El ID del producto que se desea eliminar.

# Routers:
## Carrito API Router: Endpoints
### POST /api/carritos/
    Crea un nuevo carrito.
    Respuesta exitosa (Código 200):
    El cuerpo de la respuesta contiene el carrito recién creado.
### GET /api/carritos/
    Obtiene todos los carritos.
    Respuesta exitosa (Código 200):
    El cuerpo de la respuesta contiene una matriz de objetos que representan los carritos almacenados.
### GET /api/carritos/:cid
    Obtiene los productos de un carrito por su ID.

    Parámetros de ruta: :cid - El ID del carrito.
    Respuesta exitosa (Código 200): El cuerpo de la respuesta contiene una matriz de objetos que representan los productos del carrito especificado.
    Respuesta de error (Código 404): No se encontró ningún carrito con el ID especificado.
### POST /api/carritos/:cid/product/:pid
    Agrega un producto a un carrito existente.

    Parámetros de ruta: :cid - El ID del carrito.
                        :pid - El ID del producto a agregar.
    Respuesta exitosa (Código 200): El cuerpo de la respuesta contiene el carrito actualizado con el producto agregado.

## Productos API Router: Endpoints
### GET /api/productos/
Obtiene todos los productos.

Parámetros de consulta:
search (opcional) - Una cadena de texto para buscar productos por título o descripción.
limit (opcional) - El número máximo de productos a devolver.
Respuesta exitosa (Código 200):
El cuerpo de la respuesta contiene una matriz de objetos que representan los productos filtrados o sin filtrar.
### GET /api/productos/:pid
Obtiene un producto por su ID.

Parámetros de ruta:
:pid - El ID del producto.
Respuesta exitosa (Código 200):
El cuerpo de la respuesta contiene el producto encontrado.
Respuesta de error (Código 404):
No se encontró ningún producto con el ID especificado.
### POST /api/productos/
Crea un nuevo producto.

Parámetros de cuerpo:
Se requieren los siguientes campos: title, description, price, thumbnail, code, category y stock.
Respuesta exitosa (Código 201):
El cuerpo de la respuesta contiene el producto recién creado.
Respuesta de error (Código 400):
El cuerpo de la respuesta contiene un objeto de error si faltan campos requeridos.
### PUT /api/productos/:pid
Actualiza un producto existente.

Parámetros de ruta:
:pid - El ID del producto.
Parámetros de cuerpo:
Se pueden proporcionar campos opcionales para actualizar el producto.
Respuesta exitosa (Código 200):
Se envía cuando se actualiza exitosamente el producto.
Respuesta de error (Código 404):
No se encontró ningún producto con el ID especificado.
### DELETE /api/productos/:pid
Elimina un producto.

Parámetros de ruta:
:pid - El ID del producto.
Respuesta exitosa (Código 200):
Se envía cuando se elimina exitosamente el producto.
Respuesta de error (Código 404):
No se encontró ningún producto con el ID especificado.
