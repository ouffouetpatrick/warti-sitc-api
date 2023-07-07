import { DatabaseModule } from '../../database/database.module';
import { Module } from '@nestjs/common';
import { QrcodeMetierController } from './qrcode.controller';
import { QrcodeMetierService } from './qrcode.service';

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [QrcodeMetierController],
    providers: [QrcodeMetierService],
    exports: [],
})
export class QrcodeMetierModule { }
