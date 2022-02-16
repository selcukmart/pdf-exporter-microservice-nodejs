'use strict';
const config = require('./config'),
    express = require('express'),
    bodyParser = require("body-parser"),
    app = express(),
    cors = require('cors'),
    pdfExporter = require('./library/PDFExport');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json({extended: true, limit: '50mb'}));
if (config.ENV !== 'LOCAL') {
    var fs = require('fs');
    var http = require('http');
    var https = require('https');
    //var https = require('https').globalAgent.options.ca = require(config.SSL_CA).create();
    var privateKey = fs.readFileSync(config.SSL_KEY, 'utf8');
    var certificate = fs.readFileSync(config.SSL_CERT, 'utf8');

    var credentials = {
        key: privateKey,
        cert: certificate,
        ca: fs.readFileSync(config.SSL_CA, 'utf8')
    };
    var httpServer = http.createServer(app);
    var httpsServer = https.createServer(credentials, app);

    httpsServer.listen(config.HTTPS_PORT);
    httpServer.listen(config.HTTP_PORT);
} else {
    app.listen(config.HTTP_PORT);
}

function isAUTH(req) {

    if (req.body.hasOwnProperty('auth')
        && req.body.auth.hasOwnProperty('secret')
        && req.body.auth.hasOwnProperty('client')
    ) {
        return req.body.auth.secret === config.PASSWORD && req.body.auth.client === config.USERNAME;
    }
    return false;
}

app.post(config.PATH, (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With,[content-type]'
    );
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (!isAUTH(req)) {
        res.send({
            auth: false
        });
        res.end();
    } else {
        pdfExporter.handlePDFPost(req, res)
    }

})


