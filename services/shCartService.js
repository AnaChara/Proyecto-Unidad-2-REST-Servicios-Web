const { shCart } = require('../models/shCartModel');
const Product = require('../models/productModel');
const facturapi = require('../apis/facturapi');
const user = require('../models/userModel');
// const accountSid = process.env.TULIOKEY1;
// const authToken = process.env.TULIOKEY2;
const stripe = require('../apis/stripe');
// const client = require('twilio')(accountSid, authToken);
const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
    '3b760fe4c13feee204be42974e6bb8b9',
    '5979e9ac6662776169c77f7b1b6b25f4',
    {
        config: {},
        options: {}
    }
);

module.exports = {
    getAllCarts: async () => {
        try {
            return await shCart.find().populate('productos.product');
        } catch (error) {
            throw new Error('Error al recuperar carritos de compras');
        }

    },
    getCartById: async (_id) => {
        try {
            const cart = await shCart.findById(_id);
            if (!cart) {
                throw new Error(`Carrito con ID: ${_id} no encontrado.`);
            }
            return cart;
        } catch (error) {
            throw error;
        }
    },
    getCartByUserId: async (user) => {
        try {
            const cart = await shCart.findOne({ user });
            if (!cart) {
                throw new Error(`Carrito del usuario: ${user} no encontrado.`);
            }
            return cart;
        } catch (error) {
            throw error;
        }
    },
    createCart: async ({ user }) => {
        try {
            if (!user) {
                throw new Error('No se ha proporcionado un usuario.');
            }
            const cart = new shCart({ user, productos: [], subtotal: 0, total: 0, });
            return await cart.save();
        } catch (error) {
            throw error;
        }
    },
    updateCart: async (cartId, updates) => {
        const cart = await shCart.findById(cartId).populate('productos.product');
        if (!cart) {
            throw new Error(`Carrito con ID: ${cartId} no encontrado.`);
        }
        const userName = await getUserNameByCart(cart);

        // Si el carrito ya está activo, actualízalo directamente
        if (String(cart.status).match('Activo')) {
            return await shCart.findByIdAndUpdate(cartId, updates, { new: true });
        }

        // Generar recibo y PDF
        const [facturapipi, factuPDF] = await facturapi.createReceipt(cart, userName);

        const linkPago = await stripe.paymentLink(cart.productos);

        const productDetailsHTML = cart.productos
            .map(item => `
                <tr>
                    <td>${item.product.name}</td>
                    <td>${item.product.desc}</td>
                    <td>${item.quantity}</td>
                    <td>${item.product.price.toFixed(2)}</td>
                </tr>
            `)
            .join('');

        const htmlContent = `
            <h1>Felicidades ${userName.nombreCompleto}</h1>
            <h2>Recibo de venta</h2>
            <table border="1" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                    </tr>
                </thead>
                <tbody>
                    ${productDetailsHTML}
                </tbody>
            </table>
        `;

        const adInfo1 = cart.total.toFixed(2);
        const adInfo2 = cart.cDate;


        const fullHtmlContent = `
            ${htmlContent}
            <p>PDF de Facturapi: ${factuPDF[0]}</p>
            <p>XML de Facturapi: ${factuPDF[1]}</p>
        `;

        // Enviar correo con Mailjet
        const request = mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: "joalalvarezdu@ittepic.edu.mx",
                            Name: "Alfredo Alvarez"
                        },
                        To: [
                            {
                                Email: userName.email,
                                Name: userName.nombreCompleto
                            }
                        ],
                        Subject: "¡Gracias por tu compra!",
                        TextPart: `Recibo de compra para ${userName.nombreCompleto}`,
                        HTMLPart: fullHtmlContent,
                    }
                ]
            });

        try {
            await request;
            console.log('Correo enviado exitosamente.');
        } catch (err) {
            console.error('Error al enviar correo:', err.statusCode, err.message);
        }

        // Generar mensaje para el cliente
        const productosPalMensaje = cart.productos
            .map(item => `
                Product: ${item.product.name}
                Description: ${item.product.desc}
                Quantity: ${item.quantity}
                Price: ${item.product.price.toFixed(2)}
            `)
            .join('');

        const mensaje = `
        🎉 Thank you for your purchase, ${userName.nombreCompleto}!
        🧾 Receipt Details:
            
        - Receipt ID: ${facturapipi.id}
        - Items: 
        ${productosPalMensaje}
    
        For any questions, feel free to contact us.
    
        Checkout your purchase PDF from Facturapi at: 
        ${factuPDF[0]}
        
        Checkout your purchase XML from Facturapi at: 
        ${factuPDF[1]}
        `;

        // client.messages
        //     .create({
        //         body: mensaje,
        //         from: '+17754851842',
        //         to: `+52${userName.telefono}`
        //     })
        //     .then(message => console.log(`Message sent with SID: ${message.sid}`))
        //     .catch(err => console.error(`Error sending message: ${err.message}`));

        // Actualizar el carrito con los datos
        return await shCart.findByIdAndUpdate(cartId, updates, { new: true });
    },
    deleteCart: async (cartId) => {
        try {
            const deletedCart = await shCart.findByIdAndDelete({ _id: cartId });
            if (!deletedCart) {
                throw new Error(`Carrito con ID: ${cartId} no encontrado.`);
            }
            return deletedCart;
        } catch (error) {
            throw error;
        }
    },
    addItemToCart: async (cartId, input) => {
        const cart = await shCart.findById(cartId);
        if (!cart) throw new Error(`Carrito con ID: ${cartId} no encontrado.`);

        for (const item of input) {
            const product = await Product.findById(item.product);
            console.log('product: ', product);
            if (!product) throw new Error('Producto no encontrado.');

            const existingItem = cart.productos.find(cartItem => cartItem.product.equals(product._id));
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                cart.productos.push({
                    product: product._id,
                    name: product.name,
                    desc: product.desc,
                    quantity: item.quantity,
                    price: product.price,
                    category: product.category,
                });
            }

            cart.total += product.price * item.quantity;
        }
        return await cart.save();
    },
    updateCartItem: async (userId, input) => {
        const cart = await shCart.findOne({ user: userId });
        if (!cart) throw new Error(`Carrito del usuario: ${userId} no encontrado.`);

        const product = await Product.findById(input.product);
        const item = cart.productos.find(item => item.product.equals(input.product));
        if (!item) throw new Error('Producto no encontrado en el carrito.');

        cart.total -= product.price * item.quantity;
        item.quantity = input.quantity;
        cart.total += product.price * input.quantity;

        return await cart.save();
    },
    deleteItemFromCart: async (cartId, productId) => {
        const cart = await shCart.findById(cartId);
        if (!cart) throw new Error(`Carrito con ID: ${cartId} no encontrado.`);

        const itemIndex = cart.productos.findIndex(item => item.product.equals(productId));
        if (itemIndex === -1) throw new Error('Producto no encontrado en el carrito.');

        const product = await Product.findById(productId);
        cart.total -= product.price * cart.productos[itemIndex].quantity;
        cart.productos.splice(itemIndex, 1);

        return await cart.save();
    },
    removeOneItemFromCart: async (cartId, productId) => {
        const cart = await shCart.findById(cartId);
        if (!cart) throw new Error(`Carrito con ID: ${cartId} no encontrado.`);

        const itemIndex = cart.productos.findIndex(item => item.product.equals(productId));
        if (itemIndex === -1) throw new Error('Producto no encontrado en el carrito.');

        if (itemIndex !== -1) {
            if(cart.productos[itemIndex].quantity == 0){
                cart.productos.splice(itemIndex, 1);
            }
            cart.productos[itemIndex].quantity -= 1;
        }

        const product = await Product.findById(productId);
        cart.total -= product.price;
        return await cart.save();
    },
    clearCart: async (userId) => {
        try {
            const cart = await shCart.findOne({ user: userId });
            if (!cart) {
                throw new Error(`Carrito del usuario: ${userId} no encontrado.`);
            }
            cart.productos = [];
            cart.total = 0;
            return await cart.save();
        } catch (error) {
            throw error;
        }
    },
};

async function getUserNameByCart(cart) {
    try {
        const userr = await user.findById(cart.user);
        if (!userr) {
            throw new Error('Usuario no encontrado.');
        }
        return userr;
    } catch (error) {
        console.error('Error al obtener el nombre del usuario:', error.message);
        throw error;
    }
};