import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from './../entities/category.entity';
import { CoreOutput } from "src/common/dtos/output.dto";

@ObjectType()
export class AllCategoriesOutput extends CoreOutput{
    @Field(()=>[Category], { nullable : true})
    categories?:Category[]

}