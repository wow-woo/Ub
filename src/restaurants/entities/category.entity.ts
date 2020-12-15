import { CoreEntity } from 'src/common/entities/core.entity';
import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToOne} from "typeorm";
import { IsString } from 'class-validator';
import { Restaurant } from './restaurant.entity';

@ObjectType()
@Entity()
export class Category extends CoreEntity {
    @Field(()=> String)
    @Column()
    name : string
    
    @Field(()=>String)
    @Column()
    @IsString()
    icon: string
    //coverImage

    @OneToOne(()=>Restaurant, restaurants=>restaurants.category)
    // @Join
    restaurants:Array<any>
}