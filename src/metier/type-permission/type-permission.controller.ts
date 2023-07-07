import { Body, Catch, Controller, Get, Param, Post, Put, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { Transaction, TransactionManager, EntityManager, getManager } from 'typeorm';
// import { TypePermissionDto } from 'src/database/typePermission/typePermission.dto';
import { TypePermissionMetierService } from './type-permission.service';
import { TypePermissionDto } from 'src/database/type-permission/typePermission.dto';
// import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('metier/typePermission')
export class TypePermissionMetierController {
    constructor(
        private readonly typePermissionMetierService: TypePermissionMetierService,
    ) { }
    
    @Post('nouveauTypePermission')
    @Transaction()
    async nouveauTypePermission(@Body(new ValidationPipe()) typePermissionDto: TypePermissionDto,  @TransactionManager() manager: EntityManager) {
        const result = this.typePermissionMetierService.nouveauTypePermission(manager, typePermissionDto);
        return result;
    }

    @Post('modifierTypePermission')
    @Transaction()
    async modifierTypePermission(@Body(new ValidationPipe()) typePermissionDto: TypePermissionDto,  @TransactionManager() manager: EntityManager) {
        const result = this.typePermissionMetierService.modifierTypePermission(manager, typePermissionDto);
        return result;
    }
   
    
    @Post('annulerTypePermission')
    @Transaction()
    async annulerTypePermission(@Body(new ValidationPipe()) typePermissionDto: TypePermissionDto,  @TransactionManager() manager: EntityManager) {
        const result = this.typePermissionMetierService.annulerTypePermission(manager, typePermissionDto);
        return result;
    } 
    
    @Get('listeTypePermission')
    @Transaction()
    async listeTypePermission( @TransactionManager() manager: EntityManager,) {
    const result = this.typePermissionMetierService.listeTypePermission(manager);
    return result;
    }


    
}