import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CONFIG } from '../app.constant';
import { StatutModule } from './statut';
import { MotifModule } from './motif';
import { PermissionModule } from './permission';
import { StatutPermissionModule } from './statut_permission';
import { DroitModule } from './droit/droit.module';
import { ScanModule } from './scan/scan.module';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { ModuleModule } from './module/module.module';
import { ModuleDroitModule } from './module-droit/module-droit.module';
import { ProfilModule } from './profil/profil.module';
import { TemplateProfilModule } from './template-profil/template-profil.module';
import { UtilisateurModuleDroitModule } from './utilisateur-module-droit/utilisateur-module-droit.module';
import { UtilisateurProfilModule } from './utilisateur-profil/utilisateur-profil.module';
import { TypePermissionModule } from './type-permission/typePermission.module';
import { QrcodeModule } from './qrcode/qrcode.module';

@Module({
  imports: [
    // Config
    TypeOrmModule.forRoot(CONFIG().db),

    // Administration
    UtilisateurModule,
    ScanModule,
    MotifModule,
    StatutModule,
    PermissionModule,
    StatutPermissionModule,
    DroitModule,
    ModuleModule,
    ModuleDroitModule,
    ProfilModule,
    TemplateProfilModule,
    UtilisateurModuleDroitModule,
    UtilisateurProfilModule,
    TypePermissionModule,
    QrcodeModule,
    
  ],
  providers: [],
  controllers: [],
  exports: [
    // Administration
    UtilisateurModule,
    StatutModule,
    ScanModule,
    MotifModule,
    PermissionModule,
    StatutPermissionModule,
    DroitModule,
    ModuleModule,
    ModuleDroitModule,
    ProfilModule,
    TemplateProfilModule,
    UtilisateurModuleDroitModule,
    UtilisateurProfilModule,
    TypePermissionModule,
    QrcodeModule,
    
    
  ],
})
export class DatabaseModule {}
