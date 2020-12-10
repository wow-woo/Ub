import { LoginOutput, LoginInp } from './dtos/login.dto';
import { CreateAccountOutput, CreateAccountInp } from './dtos/create-account.dto';
import { UsersService } from './users.service';
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

@Resolver()
export class UsersResolver {
    constructor(private readonly userService:UsersService){}

    @Query(()=>Boolean)
    hi(){
        return true
    }

    @Mutation(()=>CreateAccountOutput)
    async createAccount(
        @Args('input') dto:CreateAccountInp
    ): Promise<CreateAccountOutput>{
        try {
            const result = await this.userService.createAccount(dto);
            return result

        } catch (error) {
            return {
                ok:false,
                error,
            }
            
        }
    }

    @Mutation(()=>LoginOutput)
    async login(
        @Args('inp') inp:LoginInp
    ){}
}