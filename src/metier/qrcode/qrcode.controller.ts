import { Body, Catch, Controller, Get, Param, Post, Put, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { Transaction, TransactionManager, EntityManager, getManager } from 'typeorm';
import { QrcodeDto } from 'src/database/qrcode/qrcode.dto';
import { QrcodeMetierService } from './qrcode.service';
// import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('metier/qrcode')
export class QrcodeMetierController {
    constructor(
        private readonly qrcodeMetierService: QrcodeMetierService,
    ) { }
    
    @Post('nouveauQrcode')
    @Transaction()
    async nouveauQrcode(@Body(new ValidationPipe()) qrcodeDto: QrcodeDto,  @TransactionManager() manager: EntityManager) {
        const result = this.qrcodeMetierService.nouveauQrcode(manager, qrcodeDto);
        return result;
    }

    // @Post('modifierQrcode')
    // @Transaction()
    // async modifierQrcode(@Body(new ValidationPipe()) qrcodeDto: QrcodeDto,  @TransactionManager() manager: EntityManager) {
    //     const result = this.qrcodeMetierService.modifierQrcode(manager, qrcodeDto);
    //     return result;
    // }
   
    
    // @Post('annulerQrcode')
    // @Transaction()
    // async annulerQrcode(@Body(new ValidationPipe()) qrcodeDto: QrcodeDto,  @TransactionManager() manager: EntityManager) {
    //     const result = this.qrcodeMetierService.annulerQrcode(manager, qrcodeDto);
    //     return result;
    } 
    



    
// }