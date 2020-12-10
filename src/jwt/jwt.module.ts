import { JwtModuleOptions } from './jwt.interfaces';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { CONFIG_OPTIONS } from './jwt.constants';

@Module({})
@Global()
export class JwtModule {
  static forRoot(options:JwtModuleOptions):DynamicModule{
    return {
      module:JwtModule,
      exports:[JwtService],
      providers:[
        JwtService,
        {
          provide:CONFIG_OPTIONS,
          useValue:options
        }
      ]
    }
  }
}
