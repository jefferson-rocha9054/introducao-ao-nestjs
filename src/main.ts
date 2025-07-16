import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const confing = new DocumentBuilder()
    .setTitle('API de Usuários')
        .setDescription('Documentação da API de usuários com NestJS + Prisma + Swagger')
        .setVersion('1.0')
        .addTag('users')
        .addBearerAuth({//Esquema jwt Bearer
          type:'http',
          scheme
        
        
        
        
        
        
        })



        .build();
 
      const document = SwaggerModule.createDocument(app, confing);

      SwaggerModule.setup('api', app, document)

      await app.listen(3000)
   
}
bootstrap();
