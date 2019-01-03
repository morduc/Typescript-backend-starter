"use strict";
// import agent from 'bluemix-autoscaling-agent' // Must be imported for autoscaling to work!
import http from "http";
import express from "express";
import { Application } from "express";

import { ServerConfiguration } from './src/config/ServerConfiguration';
import { apiRouter } from './src/routes';
// import { apiRouter } from './www/router/apiRouter';

import { logger } from "./src/utils/logger";

export class Server {

  private app: Application;
  private port: string | number;

  public start() {
    this.app = express();
    const server: any = http.createServer(this.app);

    ServerConfiguration.config(this.app);
    // Determine port to expose
    this.port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;
    logger.debug(`port for server: ${this.port}`);
    
    this.app.use("/api/v1", apiRouter);

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
  
}




// Run it
( async () => {
    const server = new Server();
    server.start(); 
})();
