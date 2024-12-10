const Mailjet = require('node-mailjet');
const mailjet = new Mailjet({apiKey: "3b760fe4c13feee204be42974e6bb8b9", apiSecret: "e3033ccff29a0cd0b2f03037f8e25d14"});

async function send(subject, HTMLpart) {
    try {
        const request = mailjet.post("send", { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: 'joalalvarezdu@ittepic.edu.mx',
                        Name: 'Alfredo Alvarez', 
                    },
                    To: [{ Email: 'joalalvarezdu@ittepic.edu.mx' }],
                    Subject: subject,
                    HTMLPart: HTMLpart, 
                },
            ],
        });

        const response = await request;
        console.log('Correo enviado exitosamente:', response.body);
    } catch (error) {
        console.error('Error al enviar el correo:', error.response?.body || error.message);
    }
}

module.exports = {send}