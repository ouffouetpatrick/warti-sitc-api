import { Body, Catch, Controller, Get, Param, Post, Put, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { Transaction, TransactionManager, EntityManager, getManager } from 'typeorm';
import { StatutPermissionDto } from 'src/database/statut_permission/statutPermission.dto';
import { StatutPermissionMetierService } from './statut-permission.service';
import { UtilisateurEntity } from 'src/database';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('metier/statutPermission')
export class StatutPermissionMetierController {
    constructor(
        private readonly statutPermissionMetierService: StatutPermissionMetierService,
    ) { }
    
    @Post('validerPermission')
    @Transaction()
    async validerPermission(@Body(new ValidationPipe()) statutPermissionDto: StatutPermissionDto,  @TransactionManager() manager: EntityManager) {
        const result = this.statutPermissionMetierService.validerPermission(manager, statutPermissionDto);
        return result;
    }
    
    @Get('recupererPermissionAttente')
    @UseGuards(JwtAuthGuard)
    @Transaction()
    async recupererPermissionAttente(@CurrentUser() user: UtilisateurEntity ,@TransactionManager() manager: EntityManager,) {
    const result = this.statutPermissionMetierService.recupererPermissionAttente(manager,user);
    return result;
  }

  @Get('recupererPermissionAttenteAll')
    @Transaction()
    async recupererPermissionAttenteAll(@TransactionManager() manager: EntityManager,) {
    const result = this.statutPermissionMetierService.recupererPermissionAttenteAll(manager);
    return result;
  }

  
  @Get('recupererPermissionValider')
  @UseGuards(JwtAuthGuard)
  @Transaction()
  async recupererPermissionValider(@CurrentUser() user: UtilisateurEntity , @TransactionManager() manager: EntityManager,) {
  const result = this.statutPermissionMetierService.recupererPermissionValider(manager,user);
  return result;
}

@Get('recupererPermissionValiderAll')
  @Transaction()
  async recupererPermissionValiderAll( @TransactionManager() manager: EntityManager,) {
  const result = this.statutPermissionMetierService.recupererPermissionValiderAll(manager);
  return result;
}


@Get('recupererPermissionrejeter')
@UseGuards(JwtAuthGuard)
@Transaction()
async recupererPermissionrejeter(@CurrentUser() user: UtilisateurEntity , @TransactionManager() manager: EntityManager,) {
const result = this.statutPermissionMetierService.recupererPermissionrejeter(manager,user);
return result;
}

@Get('recupererPermissionrejeterAll')
@Transaction()
async recupererPermissionrejeterAll( @TransactionManager() manager: EntityManager,) {
const result = this.statutPermissionMetierService.recupererPermissionrejeterAll(manager);
return result;
}

@Get('recupererPermissionAll')
@Transaction()
async recupererPermissionAll( @TransactionManager() manager: EntityManager,) {
const result = this.statutPermissionMetierService.recupererPermissionAll(manager);
return result;
}

// Nombre de permission par Statut(Dashboard)

@Get('recupererNombrePermissionSatut')
@Transaction()
async recupererNombrePermissionSatut(@TransactionManager() manager: EntityManager) {
    const result = this.statutPermissionMetierService.recupererNombrePermissionSatut(manager);
    return result;
}

// Recuperer les 4 types de permission les plus demandées (Dashboard)
@Get('recupererTypePermission')
@Transaction()
async recupererTypePermission(@TransactionManager() manager: EntityManager) {
    const result = this.statutPermissionMetierService.recupererTypePermission(manager);
    return result;
}


}