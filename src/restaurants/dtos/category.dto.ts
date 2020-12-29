import { Restaurant } from './../entities/restaurant.entity';
import { PaginationInp, PaginationOutput } from './../../common/dtos/pagination.dto';
import { InputType } from '@nestjs/graphql';
import { Category } from './../entities/category.entity';
import { CoreOutput } from './../../common/dtos/output.dto';
import { ObjectType } from '@nestjs/graphql';
import { Field } from '@nestjs/graphql';

@InputType()
export class CategoryInput extends PaginationInp{
    @Field(()=>String)
    slug:string
}

@ObjectType()
export class CategoryOutput extends PaginationOutput{
    @Field(()=>Category, { nullable :true})
    category?: Category

    @Field(()=>[Restaurant], { nullable :true})
    restaurants?:Restaurant[]
}
