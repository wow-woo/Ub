import { User } from './../entities/user.entity';
import { CoreOutput } from './../../common/dtos/output.dto';
import { ObjectType } from '@nestjs/graphql';
import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class UserProfileInp{
    @Field(()=>Number)
    userId : number
}

@ObjectType()
export class UserProfileOutput extends CoreOutput{
    @Field(()=>User, {nullable:true})
    user?:User
}