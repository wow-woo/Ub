import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { CoreEntity } from './common/entities/core.entity';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile:process.env.NODE_ENV === 'prod'

    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true
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
      entities:[User, CoreEntity]
    }),
    UsersModule,
    CommonModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
