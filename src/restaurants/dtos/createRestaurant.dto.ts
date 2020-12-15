import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import {   Field, InputType, OmitType } from "@nestjs/graphql";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { Column } from 'typeorm';

@InputType()
export class CreateRestaurantDto extends OmitType(Restaurant, ["id"] , InputType){
    @Column({default: false})
    @IsOptional()
    @IsBoolean()
    isVegan:boolean
}