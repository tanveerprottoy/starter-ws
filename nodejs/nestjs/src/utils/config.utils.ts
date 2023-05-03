import { ConfigService } from "@nestjs/config";
import * as dotenv from "dotenv";

export class ConfigUtils {

    static dotenvConfig() {
        dotenv.config();
    }

    static getConfigValue<T>(
        configService: ConfigService,
        key: string
    ) {
        return configService.get<T>(key);
    }
}