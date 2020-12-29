import { Field } from '@nestjs/graphql';
import { Restaurant } from './../entities/restaurant.entity';
import { ObjectType } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { PaginationInp, PaginationOutput } from './../../common/dtos/pagination.dto';

@InputType()
export class RestaurantsInp extends PaginationInp{
}

@ObjectType()
export class RestaurantsOutput extends PaginationOutput{
    @Field(()=>[Restaurant], { nullable :true})
    results?:Restaurant[]
}