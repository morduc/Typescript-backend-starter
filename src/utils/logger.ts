import { getLogger } from "log4js";
import { Config } from "../config/Config";
export class Logger {
    public static init() {
        const logger = getLogger().level = Config.conf.log.level;
    }
}


