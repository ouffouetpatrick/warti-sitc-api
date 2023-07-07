import { DatabaseModule } from '../../database/database.module';
import { Module } from '@nestjs/common';
import { ScanMetierController } from './scan.controller';
import { ScanMetierService } from './scan.service';

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [ScanMetierController],
    providers: [ScanMetierService],
    exports: [],
})
export class ScanMetierModule { }
