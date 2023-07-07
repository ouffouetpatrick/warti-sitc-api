import { EventsModule } from './gateways/events.module';
import { Module } from '@nestjs/common';
import { FilesModule } from './../files/files.module';
import { PermissionMetierModule } from './permission/permission.module';
import { StatutPermissionMetierModule } from './statut-permission/statut-permission.module';
import { ScanMetierModule } from './scan/scan.module';
import { QrcodeMetierModule } from './qrcode/qrcode.module';
import { MotifMetierModule } from './motif/motif.module';
import { TypePermissionMetierModule } from './type-permission/type-permission.module';
import { UtilisateurProfilMetierModule } from './utilisateur-profil/utilisateur-profil.module';
import { UtilisateurMetierModule } from './utilisateur/utilisateur.module';
import { ProfilMetierModule } from './profil/profil.module';
import { ModuleDroitMetierModule } from './module/module.module';

@Module({
    imports: [
        // Config
        EventsModule,
        FilesModule,
        PermissionMetierModule,
        StatutPermissionMetierModule,
        ScanMetierModule,
        QrcodeMetierModule,
        MotifMetierModule,
        TypePermissionMetierModule,
        UtilisateurProfilMetierModule,
        UtilisateurMetierModule,
        ProfilMetierModule,
        ModuleDroitMetierModule
    ],
    providers: [],
    controllers: [],
    exports: [],
})
export class MetierModule {}
