import { Category } from './../entities/category.entity';
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Category)
export class CategoryCustomRepository extends Repository<Category>{
    async getOrCreate(name:string):Promise<Category>{
        const categoryName = name.trim().toLowerCase()
        const slug = categoryName.replace(/ /g, '-')
        
        let category = await this.findOne({slug})
        if(!category){
            category = await this.save(this.create({
                slug,
                name:categoryName
            }))
        }

        return category;
    }
}