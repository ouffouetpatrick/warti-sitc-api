import { Body, Catch, Controller, Get, Param, Post, Put, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { Transaction, TransactionManager, EntityManager, getManager } from 'typeorm';
import { MotifDto } from 'src/database/motif/motif.dto';
import { MotifMetierService } from './motif.service';
// import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('metier/motif')
export class MotifMetierController {
    constructor(
        private readonly motifMetierService: MotifMetierService,
    ) { }
    
    @Post('nouveauMotif')
    @Transaction()
    async nouveauMotif(@Body(new ValidationPipe()) motifDto: MotifDto,  @TransactionManager() manager: EntityManager) {
        const result = this.motifMetierService.nouveauMotif(manager, motifDto);
        return result;
    }

    @Post('modifierMotif')
    @Transaction()
    async modifierMotif(@Body(new ValidationPipe()) motifDto: MotifDto,  @TransactionManager() manager: EntityManager) {
        const result = this.motifMetierService.modifierMotif(manager, motifDto);
        return result;
    }
   
    
    @Post('annulerMotif')
    @Transaction()
    async annulerMotif(@Body(new ValidationPipe()) motifDto: MotifDto,  @TransactionManager() manager: EntityManager) {
        const result = this.motifMetierService.annulerMotif(manager, motifDto);
        return result;
    } 
    
    @Get('listeMotif')
    @Transaction()
    async listeMotif( @TransactionManager() manager: EntityManager,) {
    const result = this.motifMetierService.listeMotif(manager);
    return result;
    }


    
}