import { CoreEntity } from 'src/common/entities/core.entity';
import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, OneToOne} from "typeorm";
import { IsString } from 'class-validator';
import { Restaurant } from './restaurant.entity';

@ObjectType()
@Entity()
export class Category extends CoreEntity {
    @Field(()=> String)
    @Column({unique:true})
    name : string
    
    @Field(()=>String, { nullable:true})
    @Column({nullable:true})
    @IsString()
    icon: string
    //coverImage

    @Field(()=>String)
    @Column({unique:true})
    @IsString()
    slug : string

    @Field(()=>[Restaurant])
    @OneToMany(()=>Restaurant, restaurant=>restaurant.category)
    // @Join
    restaurants:Restaurant[]
}