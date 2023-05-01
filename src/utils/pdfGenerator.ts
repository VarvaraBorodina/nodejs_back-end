import PDFDocumnet from 'pdfkit';
import blobStream from 'blob-stream';

const generatePDF = (firstName: string, lastName: string, image: string, saveToDatabase: Function): void => {

    const doc: PDFDocumnet = new PDFDocumnet();
    const stream = doc.pipe(blobStream());

    doc.fontSize(25).text(firstName).text(lastName).image(image, {
        align: 'center',
        valign: 'center'});   
    doc.end();

    stream.on('finish', () => saveToDatabase(stream.toBlob('application/pdf')));

}

export default generatePDF;