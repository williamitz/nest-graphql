import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as colors from 'colors';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create( AppModule );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  app.listen( AppModule.port )
  .then( (resolve) => {

    console.log( colors.cyan('Puerto corriendo en :'), AppModule.port );
    
  })
  .catch( (reason) => {
    console.log( colors.red('Error al correr servidor'), reason );
  });
}
bootstrap();
