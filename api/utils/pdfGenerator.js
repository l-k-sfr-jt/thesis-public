const PdfPrinter = require('pdfmake');
const fs = require('fs');
const fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
};
const printer = new PdfPrinter(fonts);
const {offerTemplate} = require("./offerTemplate");
const {orderTemplate} = require("./orderTemplate");

exports.createOffer = async (offer, name) => {
    const pdfDoc = printer.createPdfKitDocument(offerTemplate(offer));
    return new Promise((resolve, reject) =>{ try {
        const stream = fs.createWriteStream(name)
        pdfDoc.pipe(stream);
        pdfDoc.end();
        stream.on('close', () => resolve());

    } catch(err) {
        reject(err);
    }});
}

exports.createOrder = (order, name) => {
    const pdfDoc = printer.createPdfKitDocument(orderTemplate(order));
    return new Promise((resolve, reject) =>{ try {
        const stream = fs.createWriteStream(name)
        pdfDoc.pipe(stream);
        pdfDoc.end();
        stream.on('close', () => resolve());

    } catch(err) {
        reject(err);
    }});
}
