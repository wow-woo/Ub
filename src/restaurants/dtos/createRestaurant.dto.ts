import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import {   Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { Column } from 'typeorm';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class CreateRestaurantInp extends PickType(Restaurant, 
    ['name', 'coverImage', 'address'] , InputType){
    
    @Field(()=>String)
    categoryName:string
}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput{
}