import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
dotenv.config();

async function bootstrap() {
  const PORT = process.env.PORT;
  const app = await NestFactory.create(AppModule);
  console.log('JWT_SECRET ===>', process.env.JWT_SECRET);
  //===========SWAGGER CONFIG======================
  app.setGlobalPrefix('KGZ/v1');
  const config = new DocumentBuilder()
    .setTitle('Kin Geek Zone')
    .setDescription('Kin Geek Zone API Docs')
    .setVersion('1.0')
    .addTag('KGZ')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('Kin_Geek_Zone/Api/docs', app, documentFactory);
  //===================CONFIG NEST VALIDATOR =======================
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: false,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  //================================================================
  await app.listen(PORT!, () =>
    console.log(
      `API running in PORT : ${PORT}, Swagger docs http://localhost:${PORT}/Kin_Geek_Zone/Api/docs`,
    ),
  );
}
bootstrap();
