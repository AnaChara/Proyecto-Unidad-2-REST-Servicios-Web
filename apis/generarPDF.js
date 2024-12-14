require('dotenv').config();
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

AWS.config.update({
    accessKeyId: process.env.AMAZONKEY1,
    secretAccessKey: process.env.AMAZONKEY2,
    region: 'us-east-2',
});
const s3 = new AWS.S3();

async function uploadFacturapiPDF(reID, factuPDF, factuXML){
    
    const pdfStream = Readable.from(factuPDF);
    const xmlStream = Readable.from(factuXML);

    const uploadParamsPDF = {
        Bucket: 'proyecto-u2-servicios-web',
        Key: `invoices/${Date.now()}_${reID}_invoice_pdf.pdf`,
        Body: pdfStream,
        ContentType: 'application/pdf',
    };

    const uploadParamsXML = {
        Bucket: 'proyecto-u2-servicios-web',
        Key: `invoices/${Date.now()}_${reID}_invoice_xml.xml`,
        Body: xmlStream,
        ContentType: 'application/xml',
    };
    const resultPDF = await s3.upload(uploadParamsPDF).promise();
    const resultXML = await s3.upload(uploadParamsXML).promise();

    console.log('Resultado de PDF de Facturapi: ', resultPDF.Location);
    console.log('Resultado de XML de Facturapi: ', resultXML.Location);

    return [resultPDF.Location, resultXML.Location];
}

module.exports = {
    uploadFacturapiPDF
};
