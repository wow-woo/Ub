import { Field } from '@nestjs/graphql';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class CoreEntity{
    @Field(()=>Number)
    @PrimaryGeneratedColumn()
    id:number
    
    @Field(()=>Date)
    @CreateDateColumn()
    createdAt : Date
    
    @Field(()=>Date)
    @UpdateDateColumn()
    updatedAt : Date

}