const convertHTMLToPDF = require("pdf-puppeteer");
module.exports = {
    handlePDFPost: function (req, res) {
        return this.printPDF(req, res)
    },

    printPDF: async function (req, res) {

        let data = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="x-ua-compatible" content="ie=edge"> ' +
            '<meta name="viewport" content="width=device-width"><style>body {font-family: "Times New Roman";}</style></head><body>'
        data = data + '<div>' + req.body.main.content + '</div>';
        data = data + '</body></html>';

        let name = req.body.main.filename;
        let footer_desc = req.body.main.footer_desc;
        return convertHTMLToPDF(data,
            pdf => {
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-disposition', 'inline; filename="' + clearturkishchar(name) + '"');
                res.send(pdf);
                res.end();
            },
            {
                format: 'A4',
                displayHeaderFooter: true,
                margin: {top: 10, left: 10, right: 10, bottom: 50},
                headerTemplate: '',
                footerTemplate: '<div style="width:100%; margin-top:20px; text-align:center; font-size:10px; ">'
                    + '<div style="float:center" class="pageNumber"></div><div>'
                    + footer_desc
                    + '</div>'
            },
            {
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ]
            },
            true
        ).catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
    }
}

function clearturkishchar(filename) {
    filename = replaceAll(filename, 'Ğ', 'G');
    filename = replaceAll(filename, 'Ü', 'U');
    filename = replaceAll(filename, 'Ş', 'S');
    filename = replaceAll(filename, 'I', 'I');
    filename = replaceAll(filename, 'İ', 'I');
    filename = replaceAll(filename, 'Ö', 'O');
    filename = replaceAll(filename, 'Ç', 'C');
    filename = replaceAll(filename, 'ğ', 'g');
    filename = replaceAll(filename, 'ü', 'u');
    filename = replaceAll(filename, 'Ö', 'O');
    filename = replaceAll(filename, 'Ç', 'C');
    filename = replaceAll(filename, 'ş', 's');
    filename = replaceAll(filename, 'ı', 'i');
    filename = replaceAll(filename, 'ö', 'o');
    filename = replaceAll(filename, 'ç', 'c');
    return filename;
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}