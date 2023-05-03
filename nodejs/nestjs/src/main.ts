import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Constants } from "./utils/constants";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { EnvUtils } from "./utils/env.utils";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix(Constants.API);
    app.enableVersioning({
        type: VersioningType.URI,
    });
    app.enableCors();
    await app.listen(EnvUtils.getPort());
}

bootstrap();
