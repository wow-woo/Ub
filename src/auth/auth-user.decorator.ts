import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const AuthUser = createParamDecorator(
    (data:unknown, context:ExecutionContext)=>{
        const gqlCtx = GqlExecutionContext.create(context).getContext();
        const user = gqlCtx['user'];
        
        return user
    }
)