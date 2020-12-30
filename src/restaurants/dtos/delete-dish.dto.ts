import { Field } from '@nestjs/graphql';
import { CoreOutput } from './../../common/dtos/output.dto';
import { ObjectType } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@InputType()
export class DeleteDishInp{
    @Field(()=>Number)
    dishId:number
}

@ObjectType()
export class DeleteDishOutput extends CoreOutput{

}