"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:3000', 'http://192.168.110.208:3000', 'http://127.0.0.1:3000'],
        credentials: true,
    });
    app.use((0, cookie_parser_1.default)());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Mangan Rek API Documentation')
        .setDescription('Dokumentasi API Sistem Direktori Kuliner Malang, POS Kasir, Voucher Louvin, dan Itinerary Generator. (Note: Autentikasi menggunakan HttpOnly Cookie `auth_token`)')
        .setVersion('1.0')
        .addBearerAuth()
        .addCookieAuth('auth_token')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
//# sourceMappingURL=main.js.map