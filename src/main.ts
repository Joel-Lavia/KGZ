import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
dotenv.config();

async function bootstrap() {
  const PORT = process.env.PORT;
  const app = await NestFactory.create(AppModule);
  //===========SWAGGER CONFIG======================
  const config = new DocumentBuilder()
    .setTitle('Kin Geek Zone')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('KGZ')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  //=====================================================
  await app.listen(PORT!, () => console.log(`Port running in PORT : ${PORT}`));
}
bootstrap();
