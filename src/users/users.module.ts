import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Module({
    imports:[ConfigService, TypeOrmModule.forFeature([User])],
    providers: [UsersResolver, UsersService],
    exports:[UsersService]
})

export class UsersModule {}
