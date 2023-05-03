import StringUtils from "./string.utils";
import * as dotenv from "dotenv";

export class EnvUtils {

    private static dotenvConfig() {
        dotenv.config();
    }

    static getChatTableName(): string {
        return process.env["TABLE_CHATS"];
    }

    static getRedisUrl(): string {
        return process.env["REDIS_HOST"];
    }

    static getRedisConfigs(): string[] {
        const url = this.getRedisUrl();
        const splits = StringUtils.split(
            url,
            ":"
        );
        return splits;
    }

    static getDbConfigs(): string[] {
        const keys = [
            "DB_REGION",
            "DB_ENDPOINT",
            "DB_ACCESS_KEY_ID",
            "DB_SECRET_ACCESS_KEY"
        ];
        const configs = [];
        for(const key of keys) {
            configs.push(
                process.env[key]
            )
        }
        return configs;
    }

    static getHost(): string {
        return process.env["APP_HOST"];
    }

    static getPort(): string {
        return process.env["APP_PORT"];
    }

    static getWsPort(): number {
        return parseInt(process.env["WS_PORT"]);
    }
}