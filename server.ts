"use strict";
import http from "http";
import express from "express";
import { Application } from "express";
import { getLogger } from "log4js";
import { Logger } from "./src/utils/logger";
import { ServerConfiguration } from "./src/config/ServerConfiguration";
import apiRouter from "./src/routes";

// initialising loglevel
Logger.init();
const logger = getLogger();

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
            logger.info(`Server running on port: ${this.port}`);
        });

        server.on("error", (e: any) => {
            if (e.errno === "EADDRINUSE") {
                logger.error(`Port ${this.port} is already in use`);
            } else {
                logger.error(`An unknown error occurred on listen`);
            }
        });
    }
}

// Run it
( async () => {
    const server = new Server();
    server.start();
})();
