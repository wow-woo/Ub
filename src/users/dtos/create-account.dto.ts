import { MutationOutput } from './../../common/dtos/output.dto';
import { User } from './../entities/user.entity';
import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";

@InputType()
export class CreateAccountInp extends PickType(User, ['email', 'password', 'role'], InputType){}

@ObjectType()
export class CreateAccountOutput extends MutationOutput{}