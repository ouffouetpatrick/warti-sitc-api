import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UtilisateurProfilEntity } from 'src/database/utilisateur-profil/utilisateur-profil.entity';
import * as moment from 'moment';
@Injectable()
export class UtilisateurProfilMetierService {
    constructor() { }

    // Recuperer la liste des utilisateur ayant le profil 2 (employé)
    // Et pour chaque employé afficher afficher le nombre ses visite en attente
    // async recupererListeEmployeAndNbrVisite(manager: EntityManager) {
    //     // Sous-requête pour recuperer le nombre de visite en attente par utilisateur
    //     const nbrVisiteAttente = await manager.createQueryBuilder(VisiteEntity, "visite")
    //     .select([
    //         "visite.employe",
    //     ])

    //     .addSelect("COUNT(visite.id)", "nbrVisite")
    //     .leftJoin('visite.statutVisite', 'statutVisite')
    //     .leftJoin('statutVisite.statut', 'statut')
    //     .where("statutVisite.statut=1")
    //     .andWhere("statutVisite.actif=0")
    //     .groupBy("visite.employe")

    //     //requete principale, la liste des utilisateurs.
    //     //Pour chaque utilisateurs on lui associe son nombre de visite 
    //     //(en attente trouvée dans la sous requête)
    //     const ListeEmployeAndNbrVisite = await manager.createQueryBuilder(UtilisateurProfilEntity, "utilisateurProfil")
    //         .select([
    //             "utilisateur.id",
    //             "utilisateur.nom",
    //             "utilisateur.prenom"
    //         ])
    //         .leftJoin("utilisateurProfil.utilisateur", "utilisateur")
    //         .leftJoin("utilisateurProfil.profil", "profil")
    //         .leftJoinAndSelect("("+nbrVisiteAttente.getQuery()+")","visite","visite.idusr_vis = utilisateurProfil.utilisateur")
    //         .andWhere("utilisateurProfil.profil=2")
    //         .groupBy('utilisateurProfil.utilisateur')
    //         .getRawMany()
    //     return ListeEmployeAndNbrVisite ;
        
    // }

    async recupererListeEmploye(manager: EntityManager) {
        const ListeEmploye = await manager.createQueryBuilder(UtilisateurProfilEntity, "utilisateurProfil")
            .select([
                "utilisateurProfil",
                "utilisateur.id",
                "utilisateur.nom",
                "utilisateur.prenom",
                "profil.id"
            ])
            .leftJoin("utilisateurProfil.utilisateur", "utilisateur")
            .leftJoin("utilisateurProfil.profil", "profil")
            .where("utilisateurProfil.profil=2")
            .getMany()

        return ListeEmploye ;
        
    }

// Nombre total d'utilisateur qui le profil d'employé

    async recupererNombreEmploye(manager: EntityManager) {
        const NombreEmploye = await manager.createQueryBuilder(UtilisateurProfilEntity, "utilisateurProfil")
            .select([
                "utilisateurProfil.id"   
            ])
            .leftJoin("utilisateurProfil.utilisateur", "utilisateur")
            .leftJoin("utilisateurProfil.profil", "profil")
            .where("utilisateurProfil.profil=3")
            .andWhere('utilisateurProfil.geler=0')
            .getCount()

        return NombreEmploye;
        
    }

    // Nombre total d'utilisateur qui le profil d'employé

    async recupererNonPermissionnaire(manager: EntityManager) {
        const currentDate : any = new Date();
        const dates =  moment(currentDate).format('yyyy/MM/DD');
        const NombreEmploye = await manager.createQueryBuilder(UtilisateurProfilEntity, "utilisateurProfil")
            .select([
                "utilisateurProfil.id"   
            ])
            .leftJoin("utilisateurProfil.profil", "profil")
            .leftJoin("utilisateurProfil.utilisateur", "utilisateur")
            // .leftJoin('permission.utilisateur', 'utilisateurpermission') 
            // .where(
            //     'TO_DAYS(:date) <= TO_DAYS(permission.date_fin)',{ date: dates })
            .andWhere("utilisateurProfil.profil=3")
            .andWhere('utilisateurProfil.geler=0')
            .getCount()

        return NombreEmploye;
        
    }
}

