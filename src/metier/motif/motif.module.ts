import { DatabaseModule } from '../../database/database.module';
import { Module } from '@nestjs/common';
import { MotifMetierController } from './motif.controller';
import { MotifMetierService } from './motif.service';

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [MotifMetierController],
    providers: [MotifMetierService],
    exports: [],
})
export class MotifMetierModule { }
