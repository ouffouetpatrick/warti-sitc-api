import { DatabaseModule } from '../../database/database.module';
import { Module } from '@nestjs/common';
import { PermissionMetierController } from './permission.controller';
import { PermissionMetierService } from './permission.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
    imports: [
        DatabaseModule,
        MailModule
    ],
    controllers: [PermissionMetierController],
    providers: [PermissionMetierService],
    exports: [],
})
export class PermissionMetierModule { }
