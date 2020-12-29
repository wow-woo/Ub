import { CoreOutput } from './../../common/dtos/output.dto';
import { Dish } from './../entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";

@InputType()
export class CreateDishInp extends PickType(
    Dish, 
    ['name', 'price', 'description', 'options'], 
    InputType){
    @Field(()=>Number)
    restaurantId:number

}
@ObjectType()
export class CreateDishOutput extends CoreOutput{}