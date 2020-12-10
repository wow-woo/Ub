import { CreateRestaurantDto } from './createRestaurant.dto';
import { ArgsType, Field, InputType, PartialType } from "@nestjs/graphql"

@InputType()
export class UpdateRestaurantType extends PartialType(CreateRestaurantDto){}

@InputType()
export class UpdateRestaurantDto{
    @Field(()=>Number)
    id:number
    
    @Field(()=>UpdateRestaurantType)
    data:UpdateRestaurantType
}