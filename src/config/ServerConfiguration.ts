import { NextFunction, Request, Response } from 'express';
import { Application } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compress from 'compression';

export class ServerConfiguration {

  static config(server: Application) {

    // Parse body params and attache them to req.body
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));

    // Gzip compression
    server.use(compress());

    // Secure apps by setting various HTTP headers
    server.use(helmet());

    server.enable('trust proxy');

    if (server.get('env') !== 'development') {
        server.use(function (req, res, next) {
            if (req.secure || process.env.BLUEMIX_REGION === null) {
            next()
            } else {
            res.redirect('https://' + req.headers.host + req.url)
            }
        });
    }

    server.options("*", function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Length,content-type,Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');
        res.sendStatus(200);
    });

    if (server.get('env') === 'development') {
        server.use("*", function (req, res, next) {
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', '*'); //

            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');

            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Length,content-type,Authorization');

            // Pass to next layer of middleware
            next();
      });
    }

  }

  static setupErrorHandling(server: Application) {

    // Catch 404 and forward to error handler
    server.use(function (req: Request, res: Response, next) {
        const err: any = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // Error handler
    server.use(function (err: any, req: Request, res: Response, next: NextFunction) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        res.status(err.status || 500);
        res.send(res.locals)
    });

  }

}