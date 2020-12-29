import { Dish } from './restaurants/entities/dish.entity';
import { Verification } from './users/entities/verification.entity';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { UsersModule } from './users/users.module';
import { CoreEntity } from './common/entities/core.entity';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import * as Joi from 'joi'
import { JwtMiddleware} from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './mailer/mailer.module';
import { Category } from './restaurants/entities/category.entity';
import { Restaurant } from './restaurants/entities/restaurant.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile:process.env.NODE_ENV === 'prod',
      // #5.1 Generation JWT : we didn't went through writing validationSchema
      validationSchema:Joi.object({
        NODE_ENV:Joi.string().valid('dev', 'prod', 'test').required(),
        DB_HOST:Joi.string().required(),
        DB_PORT:Joi.string().required(),
        DB_USERNAME:Joi.string().required(),
        DB_PASSWORD:Joi.string().required(),
        DB_DATABASE:Joi.string().required(),
        PRIVATE_KEY:Joi.string().required(),
        MAILGUN_KEY:Joi.string().required(),
        MAILGUN_DOMAIN:Joi.string().required(),
        MAILGUN_FROM_EMAIL:Joi.string().required(),
      })
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context:({req})=>(
        {
          user: req['user']
        }
      )
      // autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type:'postgres',
      host:process.env.DB_HOST,
      port:parseInt(process.env.DB_PORT, 10),
      username:process.env.DB_USERNAME,
      password:process.env.DB_PASSWORD,
      database:process.env.DB_DATABASE,
      synchronize:process.env.NODE_ENV !== 'prod',
      logging:process.env.NODE_ENV !== 'prod',
      entities:[User, Verification, Restaurant, Category, Dish]
    }),
    JwtModule.forRoot({
      privateKey:process.env.PRIVATE_KEY
    }),
    MailerModule.forRoot({
      apiKey:process.env.MAILGUN_KEY,
      domain:process.env.MAILGUN_DOMAIN,
      fromEmail:process.env.MAILGUN_FROM_EMAIL,
    }),
    AuthModule,
    UsersModule,
    AuthModule,
    RestaurantsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(JwtMiddleware).forRoutes({
      path:'/graphql',
      method:RequestMethod.ALL
    })
  }
}
