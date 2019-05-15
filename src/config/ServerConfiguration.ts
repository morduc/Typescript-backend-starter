import { NextFunction, Request, Response } from 'express';
import { Application } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compress from 'compression';
import {Config} from './Config';
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


    // check that we use https
    if (server.get('env') !== 'development') {
        server.use(function (req, res, next) {
            if (req.secure) {
              next();
            } else {
              res.redirect('https://' + req.headers.host + req.url);
            }
        });
    }


    server.use("*", function (req, res, next) {
      //  Set cors
      if(Config.conf.serverConfig.allowedOrigins.length === 1 && Config.conf.serverConfig.allowedOrigins[0] === '*' ){
        res.setHeader('Access-Control-Allow-Origin', '*');
      }else {
        var origin = req.headers.origin;
        if(Config.conf.serverConfig.allowedOrigins.indexOf(origin) > -1){
          res.setHeader('Access-Control-Allow-Origin', origin);
        }
      }
      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');

      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Length,content-type,Authorization');

      if(req.method === 'OPTIONS'){
        res.status(200).end();
      }else {
        // Pass to next layer of middleware
        next();
      }
    });
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