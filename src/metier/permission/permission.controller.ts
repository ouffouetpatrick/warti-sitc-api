import { Body, Catch, Controller, Get, Param, Post, Put, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { Transaction, TransactionManager, EntityManager, getManager } from 'typeorm';
import { PermissionDto } from 'src/database/permission/permission.dto';
import { PermissionMetierService } from './permission.service';
import { UtilisateurEntity } from 'src/database/utilisateur/utilisateur.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('metier/permission')
export class PermissionMetierController {
    constructor(
        private readonly permissionMetierService: PermissionMetierService,
    ) { }
    
    @Post('demandePermission')
    @UseGuards(JwtAuthGuard)
    @Transaction()
    async demandePermission(@CurrentUser() user: UtilisateurEntity, @Body(new ValidationPipe()) permissionDto: PermissionDto,  @TransactionManager() manager: EntityManager) {
        const result = this.permissionMetierService.demandePermission(manager, permissionDto, user);
        return result;
    }

    @Post('modifierPermission')
    @Transaction()
    async modifierPermission(@Body(new ValidationPipe()) permissionDto: PermissionDto,  @TransactionManager() manager: EntityManager) {
        const result = this.permissionMetierService.modifierPermission(manager, permissionDto);
        return result;
    }
   
    
    @Post('annulerPermission')
    @Transaction()
    async annulerPermission(@Body(new ValidationPipe()) permissionDto: PermissionDto,  @TransactionManager() manager: EntityManager) {
        const result = this.permissionMetierService.annulerPermission(manager, permissionDto);
        return result;
    } 

    
    @Post('rejeterPermission')
    @Transaction()
    async rejeterPermission(@Body(new ValidationPipe()) permissionDto: PermissionDto,  @TransactionManager() manager: EntityManager) {
        const result = this.permissionMetierService.rejeterPermission(manager, permissionDto);
        return result;
    } 
    


// Récuperation le nombre des Permissionnaires
@Get('recupererPermissionData')
@Transaction()
async recupererPermissionData(@Body(new ValidationPipe()) @TransactionManager() manager: EntityManager,) {
const result = this.permissionMetierService.recupererPermissionData(manager);
return result;
}




// Récuperation le nombre des Permission Repartis par Genre
@Get('repartitionPermissionData')
@Transaction()
async repartitionPermissionData(@Body(new ValidationPipe()) @TransactionManager() manager: EntityManager,) {
const result = this.permissionMetierService.repartitionPermissionData(manager);
return result;
}
}