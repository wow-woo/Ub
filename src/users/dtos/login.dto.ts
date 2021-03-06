import { PickType } from '@nestjs/graphql';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from './../../common/dtos/output.dto';

@ObjectType()
export class LoginOutput extends CoreOutput{
    @Field(()=>String, {nullable:true})
    token? : string 
}

@InputType()
export class LoginInp extends PickType(User, ['email', 'password'], InputType){}

