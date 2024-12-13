const stripe = require('stripe')(process.env.STRIPE_KEY);


async function paymentLink (products){ 

    try {
        const totalAmount = products.reduce((sum, product) => {
          return sum + product.price * product.quantity;
        }, 0);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount * 100, 
            currency: 'mxn', 
            description: 'Pago de productos dinámicos',
            payment_method: 'pm_card_visa',
            payment_method_types: ['card'],
        });
    
        return paymentIntent;
      } catch (error) {
        throw new Error(`Error al crear el Payment Intent: ${error.message}`);
      }
};

module.exports = {paymentLink};