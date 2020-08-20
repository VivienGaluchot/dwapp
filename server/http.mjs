#!/usr/bin/env node

'use strict';


import { logDebug, logInfo, logError } from './log.mjs';

import http from 'http';
import fs from 'fs';
import url from 'url';
import path from 'path';
import nunjucks from 'nunjucks';


let mimeMap = new Map();
mimeMap.set(".js", "application/javascript");
mimeMap.set(".json", "application/json");
mimeMap.set(".css", "text/css");
mimeMap.set(".jpeg", "image/jpeg");
mimeMap.set(".jpg", "image/jpeg");
mimeMap.set(".png", "image/png");
mimeMap.set(".svg", "image/svg+xml");


export function initHttpServer() {

    // files

    function sendFile(pathname, response) {
        fs.readFile(pathname, (err, data) => {
            if (err) {
                response.writeHead(404);
                response.end();
                logError("can't read file, " + err);
                return;
            }
            let ext = path.extname(pathname);
            let mime = mimeMap.get(ext);
            if (mime)
                response.setHeader("Content-Type", mimeMap.get(ext));

            response.setHeader("Cache-Control", "public,max-age=3600");
            response.writeHead(200);
            response.end(data);
        });
    }

    // templating

    nunjucks.configure('server/templates', { autoescape: true });

    function sendTemplate(template, name, request, response) {
        response.setHeader("Cache-Control", "public,max-age=3600");
        try {
            let render = nunjucks.render(template, { templateName: name, request: request });
            response.writeHead(200);
            response.end(render);
        } catch (error) {
            logError(`error rendering template ${template}, ${error.message}`);
            response.writeHead(500);
            response.end("internal error");
        }
    }

    let indexView = (request, response) => {
        sendTemplate("index.html", "index", request, response);
    }
    let tryItView = (request, response) => {
        sendTemplate("try-it.html", "try-it", request, response);
    }

    // server

    let port = process.env.PORT;
    if (!port) {
        port = "8080";
        logInfo(`defaulting to port ${port}`);
    }

    const httpServer = http.createServer(function (request, response) {
        var pathname = url.parse(request.url).pathname;
        if (pathname == "/" || pathname == "/index" || pathname == "/index.html") {
            indexView(request, response);
        } else if (pathname == "/try-it" || pathname == "/try-it.html") {
            tryItView(request, response);
        } else {
            sendFile("./client/" + pathname, response);
        }
        logInfo(`${response.statusCode} ${request.url}`);
    });
    httpServer.listen(port, function () {
        logInfo(`server listening on port ${port}`);
    });

    return httpServer;
}
