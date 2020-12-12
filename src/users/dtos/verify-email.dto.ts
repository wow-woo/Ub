import { InputType } from '@nestjs/graphql';
import { Verification } from './../entities/verification.entity';
import { PickType } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { CoreOutput } from './../../common/dtos/output.dto';

@ObjectType()
export class VerifyEmailOutput extends CoreOutput{
    
}
@InputType()
export class VerifyEmailInp extends PickType(Verification, ['code'], InputType){
    
}