import { DatabaseModule } from '../../database/database.module';
import { Module } from '@nestjs/common';
import { StatutPermissionMetierController } from './statut-permission.controller';
import { StatutPermissionMetierService } from './statut-permission.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
    imports: [
        DatabaseModule,
        MailModule
    ],
    controllers: [StatutPermissionMetierController],
    providers: [StatutPermissionMetierService],
    exports: [],
})
export class StatutPermissionMetierModule { }
