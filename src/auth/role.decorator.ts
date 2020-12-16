import { UserRoles } from './../users/entities/user.entity';
import { SetMetadata } from "@nestjs/common";

export type roles = keyof typeof UserRoles | 'Every'
//Any

export const SetRole = (roles:roles[])=> SetMetadata('role', roles)