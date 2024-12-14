const Facturapi = require('facturapi').default;
const facturapi = new Facturapi('sk_test_8jb6BERJ973oG5VeD09W3xnbzaYZX2QPK4gwNraklW');
const { uploadFacturapiPDF } = require('../apis/generarPDF');

async function createProduct(product) {
    try {
        const facturapiProduct = {
            ID: product._id,
            description: product.desc,
            product_key: "50202306",
            price: product.price
        };
        return await facturapi.products.create(facturapiProduct);
    } catch (error) {
        console.error(`No se pudo crear el producto en Facturapi: ${error.message}`);
        throw new Error(`No se pudo crear el producto en Facturapi. ${error.message}`);
    }
};

async function createClient(user) {
    try {
        const facturapiClient = {
            legal_name: user.nombreCompleto,
            tax_id: user.RFC || "XAXX010101000",
            tax_system: user.taxSystem || "601",
            email: user.email,
            address: {
                zip: user.zipCode.toString() || "63000"
            }
        };
        return await facturapi.customers.create(facturapiClient);
    } catch (error) {
        console.error(`No se pudo crear el cliente en Facturapi: ${error.message}`);
        throw new Error(`No se pudo crear el cliente en Facturapi. ${error.message}`);
    }
};

async function deleteProduct(productId) {
    try {
        await facturapi.products.del(productId);
        return true;
    } catch (error) {
        console.error(`No se pudo eliminar el producto en Facturapi: ${error.message}`);
        throw new Error(`No se pudo eliminar el producto en Facturapi. ${error.message}`);
    }
}

async function deleteClient(facturapiId) {
    try {
        await facturapi.customers.del(facturapiId);
        return true;
    } catch (error) {
        console.error(`No se pudo eliminar el cliente en Facturapi: ${error.message}`);
        throw new Error(`No se pudo eliminar el cliente en Facturapi. ${error.message}`);
    }
}

async function updateClient(facturapiId, updatedData) {
    try {
        return await facturapi.customers.update(facturapiId, updatedData);
    } catch (error) {
        console.error(`No se pudo actualizar el cliente en Facturapi: ${error.message}`);
        throw new Error(`No se pudo actualizar el cliente en Facturapi. ${error.message}`);
    }
}

async function updateProduct(facturapiId, updatedData) {
    try {
        return await facturapi.products.update(facturapiId, updatedData);
    } catch (error) {
        console.error(`No se pudo actualizar el producto en Facturapi: ${error.message}`);
        throw new Error(`No se pudo actualizar el producto en Facturapi. ${error.message}`);
    }
}

async function createReceipt(shCart, user) {
    try {
        const items = shCart.productos.map(product => ({
            product: product.product._id,
            quantity: product.quantity || 'Error en la cantidad'
        }));

        let metodoUsado = "";
        user.metodoPagoPreferido.forEach(metodo => {
            if (metodo === 'Credito') metodoUsado = "04"
            if (metodo === 'Debito') metodoUsado = "28"
            if (metodo === 'Deposito') metodoUsado = "31"
            if (metodo === 'Transferencia') metodoUsado = "03"
        });

        const nomasPorElZip = user.zipCode + "";

        const invoice = await facturapi.invoices.create({
            customer: {
                legal_name: user.nombreCompleto,
                email: user.email,
                tax_id: user.RFC || "XAXX010101000",
                tax_system: '601',
                address: {
                    zip: nomasPorElZip
                }
            },
            items: items,
            payment_form: metodoUsado,
            folio_number: 914,
            series: 'F'
        });

        const facturapipi = await facturapi.receipts.create({
            payment_form: Facturapi.PaymentForm.DINERO_ELECTRONICO,
            items: items
        });

        const elPDF = await facturapi.invoices.downloadPdf(invoice.id);
        const elXML = await facturapi.invoices.downloadXml(invoice.id);

        const factuPDF = await uploadFacturapiPDF(invoice.id, elPDF, elXML);

        return [facturapipi, factuPDF];
    } catch (error) {
        console.error(`No se pudo crear el recibo en Facturapi: ${error.message}`);
        throw new Error(`No se pudo crear el recibo en Facturapi. ${error.message}`);
    }
}

module.exports = { createProduct, createClient, deleteProduct, deleteClient, updateProduct, updateClient, createReceipt };