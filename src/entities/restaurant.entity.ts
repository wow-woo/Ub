import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Restaurant {
    @Field(()=> Number)
    @PrimaryGeneratedColumn()
    id:number

    @Field(()=> String)
    @Column()
    name : string
    
    @Field(()=>Boolean, { defaultValue : false, nullable:true})
    @Column()
    isVegan: boolean
    
    @Field(()=>String, { defaultValue:'강남'})
    @Column()
    address: string
    
    @Field(()=>String)
    @Column()
    ownerName: string

    @Field(()=>String)
    @Column()
    categoryName: string
}