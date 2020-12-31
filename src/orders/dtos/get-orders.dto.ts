import { CoreOutput } from './../../common/dtos/output.dto';
import { Order, OrderStatus } from './../entities/order.entity';
import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class GetOrdersInp{
    @Field(()=>OrderStatus, {nullable:true})
    status?:OrderStatus
}


@ObjectType()
export class GetOrdersOutput extends CoreOutput{
    @Field(()=>[Order], {nullable:true})
    orders?:Order[]
}