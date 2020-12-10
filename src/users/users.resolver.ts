import { AuthGuard } from './../auth/auth.guard';
import { User } from './entities/user.entity';
import { LoginOutput, LoginInp } from './dtos/login.dto';
import { CreateAccountOutput, CreateAccountInp } from './dtos/create-account.dto';
import { UsersService } from './users.service';
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/auth-user.decorator';

@Resolver()
export class UsersResolver {
    constructor(private readonly userService:UsersService){}

    @Mutation(()=>CreateAccountOutput)
    async createAccount(
        @Args('input') userInp:CreateAccountInp
    ): Promise<CreateAccountOutput>{
        try {
            const res = await this.userService.createAccount(userInp);
            return res

        } catch (error) {
            return {
                ok:false,
                error,
            }
            
        }
    }

    @Mutation(()=>LoginOutput)
    async login(
        @Args('inp') userInp:LoginInp
    ):Promise<LoginOutput>{
        try {
            const res = await this.userService.login(userInp)
            return res
        } catch (error) {
            console.log(error)
            return{
                ok:false,
                error
            }
        }
    }

    @Query(()=>User, {nullable:true})
    @UseGuards(AuthGuard)
    me(
        @AuthUser() authUser:User
    ){
        return authUser        
    }
}