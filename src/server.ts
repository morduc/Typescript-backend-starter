"use strict";
// import agent from 'bluemix-autoscaling-agent' // Must be imported for autoscaling to work!
import http from "http";
import express from "express";
import { Application } from "express";

import { TYPES } from './dependency-injection/types';
import { IRegistrableController } from './controllers'
import { myContainer } from './dependency-injection/inversify.config';
// import { ServerConfiguration } from './www/config/serverConfiguration';

// import { apiRouter } from './www/router/apiRouter';

// import { getLogger } from 'log4js'
import { logger } from "./utils/logger";

export class Server {

  app: Application;
  port: string | number;

  public start() {
    this.app = express();
    const server: any = http.createServer(this.app);
    this.registerRoutes();

    // Determine port to expose
    this.port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;
    logger.debug(`port for server: ${this.port}`);
    
    // Start server

      server.listen(this.port, () => {
        logger.info(`Server running on port: ${this.port}`)
      });
      server.on('error', (e:any) => {
        if(e.errno = "EADDRINUSE"){
          logger.error(`Port ${this.port} is already in use`);
        } else {
          logger.error(`An unknown error occured on server.listen() call`);
        }
      });
  }

  // Getting all controllers, and registering them with their routes
  private registerRoutes(){
    myContainer.getAll<IRegistrableController>(TYPES.Controller).forEach(controller => {
      controller.register(this.app);
    });
  }

//     // Configure express
//     ServerConfiguration.config(app);



//     ServerConfiguration.setupErrorHandling(app);

}


// Run it
( async () => {
    const server = new Server();
    server.start(); 
})();
