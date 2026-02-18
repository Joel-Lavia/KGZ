import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
dotenv.config();

async function bootstrap() {
  const PORT = process.env.PORT;
  const app = await NestFactory.create(AppModule);
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
  //=====================================================
  await app.listen(PORT!, () => console.log(`Port running in PORT : ${PORT}`));
}
bootstrap();
