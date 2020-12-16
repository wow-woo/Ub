import { CoreOutput } from 'src/common/dtos/output.dto';
import { Field, ObjectType } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
@InputType()
export class DeleteRestaurantInp{
    @Field(()=>Number)
    restaurantId:number
}

@ObjectType()
export class DeleteRestaurantOutput extends CoreOutput{
}