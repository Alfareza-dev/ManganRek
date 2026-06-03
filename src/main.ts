import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:3001', // Port lokal frontend
      'http://127.0.0.1:3000',
      'https://manganrek.my.id',     // Domain produksi frontend utama
      'https://www.manganrek.my.id' // Domain dengan www
    ],
    credentials: true, 
  });
  
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Mangan Rek API Documentation')
    .setDescription('Dokumentasi API Sistem Direktori Kuliner Malang, POS Kasir, Voucher Louvin, dan Itinerary Generator. (Note: Autentikasi menggunakan HttpOnly Cookie `auth_token`)')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('auth_token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000); // Pastikan port fallback sesuai Nginx (3000)
}
bootstrap();
