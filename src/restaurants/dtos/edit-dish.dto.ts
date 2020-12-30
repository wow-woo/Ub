import { PickType } from '@nestjs/graphql';
import { Dish } from './../entities/dish.entity';
import { PartialType } from '@nestjs/graphql';
import { Field } from '@nestjs/graphql';
import { CoreOutput } from './../../common/dtos/output.dto';
import { ObjectType } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@InputType()
export class EditDishInp extends PartialType(
    PickType(Dish, ['name','options', 'price', 'description' ], InputType)
    ){
        @Field(()=>Number)
        dishId:number
}

@ObjectType()
export class EditDishOutput extends CoreOutput{

}