import { ObjectType } from '@nestjs/graphql';
import { PaginationOutput, PaginationInp } from './../../common/dtos/pagination.dto';
import { Restaurant } from './../entities/restaurant.entity';
import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@InputType()
export class SearchRestaurantInp extends PaginationInp{
    @Field(()=>String)
    query:string
}

@ObjectType()
export class SearchRestaurantOutput extends PaginationOutput{
    @Field(()=>[Restaurant], {nullable:true})
    restaurants?: Restaurant[]
}