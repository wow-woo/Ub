import { ManyToOne, RelationId } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Length } from 'class-validator';
import { ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { Field } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { CoreEntity } from './../../common/entities/core.entity';

@ObjectType()
export class DishChoice{
    @Field(()=>String)
    name?:string

    @Field(()=>Number, {nullable:true})
    extraCost?:number
}
@ObjectType()
export class DishOption{
    @Field(()=>String)
    name:string

    @Field(()=>[String], {nullable:true})
    choices:DishChoice[]

    @Field(()=>Number, {nullable:true})
    extraCost?:number
}

@ObjectType()
@Entity()
export class Dish extends CoreEntity{
    @Field()
    @Column()
    @IsString()
    @Length(1, 10)
    name:string

    @Field(()=>Number)
    @Column()
    @IsNumber()
    price:number

    @Field(()=>String, {nullable:true})
    @Column({nullable:true})
    @IsNumber()
    photo:string

    @Field(()=>String)
    @Column()
    @IsString()
    @Length(5, 140)
    description:string

    @Field(()=>Restaurant)
    @ManyToOne(
        ()=>Restaurant, 
        restaurant=>restaurant.menu, 
        { onDelete:'CASCADE'})
    restaurant : Restaurant

    @RelationId( (dish:Dish)=> dish.restaurant)
    restaurantId : number

    @Field(()=>[DishOption], { nullable: true})
    @Column({type:'json', nullable:true})
    options?: DishOption[]
}