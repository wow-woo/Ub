import { InputType } from '@nestjs/graphql';
import { ObjectType, PartialType } from '@nestjs/graphql';
import { User } from './../entities/user.entity';
import { PickType } from '@nestjs/graphql';
import { CoreOutput } from './../../common/dtos/output.dto';

@InputType()
export class EditProfileInp extends PartialType(PickType(User, ['email', 'password'] , InputType)){}

@ObjectType()
export class EditProfileOutput extends CoreOutput{
    
}