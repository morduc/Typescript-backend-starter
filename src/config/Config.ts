import dotenv from "dotenv";

dotenv.config();

export class Config {

    private static ip: string = "localhost";
    public static conf: any = {

        stage: process.env.STAGE,

        log: {
            level: process.env.LOG_LEVEL,
        },

        serverConfig: {
          allowedOrigins: process.env.ALLOW_ORIGINS.split(","),
        },
    };
}
