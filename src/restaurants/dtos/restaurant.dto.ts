import { CoreOutput } from './../../common/dtos/output.dto';
import { InputType } from '@nestjs/graphql';
import { Restaurant } from './../entities/restaurant.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class RestaurantInp{
    @Field(()=>Number)
    restaurantId:number
}

@ObjectType()
export class RestaurantOutput extends CoreOutput{
    @Field(()=>Restaurant, {nullable:true})
    restaurant?:Restaurant
}