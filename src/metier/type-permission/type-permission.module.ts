import { DatabaseModule } from '../../database/database.module';
import { Module } from '@nestjs/common';
import { TypePermissionMetierController } from './type-permission.controller';
import { TypePermissionMetierService } from './type-permission.service';

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [TypePermissionMetierController],
    providers: [TypePermissionMetierService],
    exports: [],
})
export class TypePermissionMetierModule { }
