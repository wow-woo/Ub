import { ObjectType } from '@nestjs/graphql';
import { CoreOutput } from './output.dto';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PaginationInp{
    @Field(()=>Number, { defaultValue:1})
    page : number
}

@ObjectType()
export class PaginationOutput extends CoreOutput{
    @Field(()=>Number, { nullable:true})
    totalPages? : number

    @Field(()=>Number, { nullable:true})
    totalResult? : number

}