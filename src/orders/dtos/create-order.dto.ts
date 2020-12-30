import { OrderItemOption } from './../entities/order-item.entity';
import { Field } from '@nestjs/graphql';
import { CoreOutput } from './../../common/dtos/output.dto';
import { ObjectType } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@InputType()
class CreateOrderItemInp{
    @Field(()=>Number)
    dishId:number

    @Field(()=>[OrderItemOption], {nullable:true})
    options?:OrderItemOption[]
}

@InputType()
export class CreateOrderInp {
    @Field(()=>Number)
    restaurantId : number

    @Field(()=>[CreateOrderItemInp])
    items:CreateOrderItemInp[]
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput{

}