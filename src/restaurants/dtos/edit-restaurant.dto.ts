import { CoreOutput } from './../../common/dtos/output.dto';
import { CreateRestaurantInp } from './createRestaurant.dto';
import { Field, InputType, ObjectType,  PartialType } from "@nestjs/graphql";

@InputType()
export class EditRestaurantInp extends PartialType(
    CreateRestaurantInp
){
    @Field(()=>Number)
    restaurantId:number
}

@ObjectType()
export class EditRestaurantOutput extends CoreOutput{

}