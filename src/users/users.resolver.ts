import { VerifyEmailOutput, VerifyEmailInp } from './dtos/verify-email.dto';
import { EditProfileOutput, EditProfileInp } from './dtos/edit-profile.dto';
import { AuthGuard } from './../auth/auth.guard';
import { User } from './entities/user.entity';
import { LoginOutput, LoginInp } from './dtos/login.dto';
import { CreateAccountOutput, CreateAccountInp } from './dtos/create-account.dto';
import { UsersService } from './users.service';
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserProfileInp, UserProfileOutput } from './dtos/user-profile.dto';

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
                error,
                ok:false,
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

    @UseGuards(AuthGuard)
    @Query(()=>User, {nullable:true})
    me(
        @AuthUser() authUser:User
    ){
        return authUser        
    }

    @UseGuards(AuthGuard)
    @Query(()=>UserProfileOutput)
    async userProfile(
        @Args() profile:UserProfileInp
    ):Promise<UserProfileOutput>{
        try {
            const user = await this.userService.findById(profile.userId)
            
            if(!user){
                throw new Error()
            }
            return {
                ok: true,
                user
            }
        } catch (error) {
            return {
                ok:false,
                error:'User not found'
            }
        }
    }

    @UseGuards(AuthGuard)
    @Mutation(()=>EditProfileOutput)
    async editProfile(
        @AuthUser() authUser:User,
        @Args('inp') editInp:EditProfileInp
    ): Promise<EditProfileOutput>{
        try {
            const updated = await this.userService.editProfile(authUser.id, editInp)
       
            if(!updated){
                return {
                    ok:false,
                    error:'Update has been failed'
                }
            }

            return {
                ok:true
            }
        } catch (error) {
            return {
                ok:false,
                error
            }
        }

    }

    @Mutation(()=>VerifyEmailOutput)
    verifyEmail(
        @Args('inp') {code}:VerifyEmailInp
    ){
        this.userService.verifyEmail(code)

    }
    
}