import { MailService } from './mail.service';
import { MailModuleOptions } from './mail.interfaces';
import { CONFIG_OPTIONS } from './../common/common.constants';
import { Module, DynamicModule, Global } from '@nestjs/common';

@Global()
@Module({})
export class MailerModule {
    static forRoot(options:MailModuleOptions):DynamicModule{
        return {
          module:MailerModule,
          exports:[MailService],
          providers:[
            MailService,
            {
              provide:CONFIG_OPTIONS,
              useValue:options
            }
          ]
        }
    }
}
