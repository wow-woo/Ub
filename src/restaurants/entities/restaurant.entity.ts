import { RestaurantsModule } from './../restaurants.module';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, RelationId} from "typeorm";
import { IsString } from 'class-validator';
import { Category } from './category.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
    @Field(()=> String)
    @Column({unique:true})
    name : string
    
    @Field(()=>String, {nullable:true})
    @Column()
    @IsString()
    coverImage: string
    
    @Field(()=>String)
    @Column({unique:true})
    @IsString()
    address: string
    
    @Field(()=>Category, { nullable: true})
    @ManyToOne(()=>Category, category=>category.restaurants,
        {nullable:true, onDelete: 'SET NULL'}    
    )
    @IsString()
    category: Category

    @Field(()=>User)
    @ManyToOne(
        ()=>User, 
        user=>user.restaurants,
        {onDelete:'CASCADE'})
    owner:User

    @RelationId((entity:Restaurant)=>entity.owner)
    ownerId:number
}