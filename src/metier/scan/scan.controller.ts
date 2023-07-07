import { Body, Catch, Controller, Get, Param, Post, Put, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { Transaction, TransactionManager, EntityManager, getManager } from 'typeorm';
import { ScanDto } from 'src/database/scan/scan.dto';
import { ScanMetierService } from './scan.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UtilisateurEntity } from 'src/database/utilisateur/utilisateur.entity';
// import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('metier/scan')
export class ScanMetierController {
    constructor(
        private readonly scanMetierService: ScanMetierService,
    ) { }

    @Post('Scanner')
    @Transaction()
    async Scanner(@Body(new ValidationPipe()) scanDto: ScanDto, @TransactionManager() manager: EntityManager) {
        const result = this.scanMetierService.Scanner(manager, scanDto);
        return result;
    }
    @Post('UserAbsent')
    @Transaction()
    async userAbsent(@Body(new ValidationPipe()) scanDto: ScanDto, @TransactionManager() manager: EntityManager) {
        const result = this.scanMetierService.userAbsent(manager, scanDto);
        return result;
    }
    // Récuperation des présences par Jour
    @Post('rechercherByDay')
    @Transaction()
    async rechercherByDay(@Body(new ValidationPipe()) @TransactionManager() query: any, manager: EntityManager,) {
        const result = this.scanMetierService.rechercherByDay(query, manager);
        return result;
    }

    // Récuperation des présences par Jour du mobile
    @Post('rechercherByDayMobile')
    @UseGuards(JwtAuthGuard)
    @Transaction()
    async rechercherByDayMobile(@CurrentUser() user: UtilisateurEntity, @Body(new ValidationPipe()) @TransactionManager() query: any, manager: EntityManager,) {
        const result = this.scanMetierService.rechercherByDayMobile(query, manager, user);
        return result;
    }

    // Récuperation des présences par Semaine
    @Post('rechercherByWeek')
    @Transaction()
    async rechercherByWeek(@Body(new ValidationPipe()) @TransactionManager() query: any, manager: EntityManager,) {
        const result = this.scanMetierService.rechercherByWeek(query, manager);
        return result;
    }


    // Récuperation des présences par Semaine
    @Post('rechercherByWeekMobile')
    @Transaction()
    async rechercherByWeekMobile(@Body(new ValidationPipe()) @TransactionManager() query: any, manager: EntityManager,) {
        const result = this.scanMetierService.rechercherByWeekMobile(query, manager);
        return result;
    }


    // Récuperation des présences par Mois
    @Post('rechercherByMonth')
    @Transaction()
    async rechercherByMonth(@Body(new ValidationPipe()) @TransactionManager() query: any, manager: EntityManager,) {
        const result = this.scanMetierService.rechercherByMonth(query, manager);
        return result;
    }


    // Récuperation des présences par Mois du Mobile
    @Post('rechercherByMonthMobile')
    @UseGuards(JwtAuthGuard)
    @Transaction()
    async rechercherByMonthMobile(@CurrentUser() user: UtilisateurEntity, @Body(new ValidationPipe()) @TransactionManager() query: any, manager: EntityManager,) {
        const result = this.scanMetierService.rechercherByMonthMobile(query, manager, user);
        return result;
    }


    // Récuperation des présences par Année
    @Post('rechercherByYear')
    @Transaction()
    async rechercherByYear(@Body(new ValidationPipe()) @TransactionManager() query: any, manager: EntityManager,) {
        const result = this.scanMetierService.rechercherByYear(query, manager);
        return result;
    }


    // Récuperation des présences par Année
    @Post('rechercherByYearMobile')
    @UseGuards(JwtAuthGuard)
    @Transaction()
    async rechercherByYearMobile(@CurrentUser() user: UtilisateurEntity, @Body(new ValidationPipe()) @TransactionManager() query: any, manager: EntityManager,) {
        const result = this.scanMetierService.rechercherByYearMobile(query, manager, user);
        return result;
    }





    // Récuperation des retard
    @Get('recupererlistederetard')
    @Transaction()
    async recupererlistederetard(@TransactionManager() manager: EntityManager,) {
        const result = this.scanMetierService.recupererlistederetard(manager);
        return result;
    }



    // Récuperation des retard
    @Get('recupererlistedepresenceGeneral')
    @Transaction()
    async recupererlistedepresenceGeneral(@TransactionManager() manager: EntityManager,) {
        const result = this.scanMetierService.recupererlistedepresenceGeneral(manager);
        return result;
    }


    // Récuperation des retard
    @Get('recupererlistedeStatut')
    @Transaction()
    async recupererlistedeStatut(@TransactionManager() manager: EntityManager,) {
        const result = this.scanMetierService.recupererlistedeStatut(manager);
        return result;
    }


    // Récuperation des retard
    @Get('recupererDayData')
    @Transaction()
    async recupererDayData(@Body(new ValidationPipe()) @TransactionManager() manager: EntityManager,) {
        const result = this.scanMetierService.recupererDayData(manager);
        return result;
    }


    // Récuperation des retard
    @Get('recupererMonthData')
    @Transaction()
    async recupererMonthData(@Body(new ValidationPipe()) @TransactionManager() manager: EntityManager,) {
        const result = this.scanMetierService.recupererMonthData(manager);
        return result;
    }

    // Top 5 des retardatairs
    @Get('recupererRetardataireData')
    @Transaction()
    async recupererRetardataireData(@Body(new ValidationPipe()) @TransactionManager() manager: EntityManager,) {
        const result = this.scanMetierService.recupererRetardataireData(manager);
        return result;
    }

    // Nombre de retard selon le sexe
    @Get('repartitionRetardData')
    @Transaction()
    async repartitionRetardData(@Body(new ValidationPipe()) @TransactionManager() manager: EntityManager,) {
        const result = this.scanMetierService.repartitionRetardData(manager);
        return result;
    }

    // Graphe du mobile

    @Get('recupererGraphData')
    @UseGuards(JwtAuthGuard)
    @Transaction()
    async recupererGraphData(@CurrentUser() user: UtilisateurEntity,@Body(new ValidationPipe()) @TransactionManager() manager: EntityManager,) {
        const result = this.scanMetierService.recupererGraphData(manager,user);
        return result;
    }

}