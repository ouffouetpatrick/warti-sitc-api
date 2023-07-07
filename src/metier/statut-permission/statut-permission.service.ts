import { Like, Between } from 'typeorm';
import { Transaction, TransactionManager, EntityManager, getManager, } from 'typeorm';
import { StatutPermissionEntity } from '../../database/statut_permission/statutPermission.entity';
import { Injectable } from '@nestjs/common';
import { PermissionEntity } from 'src/database/permission/permission.entity';
import { StatutEntity } from 'src/database/statut/statut.entity';
import { UtilisateurEntity } from 'src/database/utilisateur/utilisateur.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class StatutPermissionMetierService {
  constructor(
    private mailservice: MailService
  ) { }

  //Valider une permission

  async validerPermission(manager: EntityManager, statutPermission: any) {
    let statutPermissionEntity = new StatutPermissionEntity({
      ...statutPermission,
      statut: 2,
    });
    console.log(statutPermissionEntity, "statutPermission")
    const listePermission = await manager.find(StatutPermissionEntity, {
      where: {
        permission: statutPermission.permission,
        actif: 0,
      },
    });

    if (listePermission.length > 0) {
      for (let i = 0; i < listePermission.length; i++) {
        const statut = listePermission[i];
        statut.actif = 1;
        await manager.save(statut);
      }
    }
    statutPermissionEntity = await manager.save(statutPermissionEntity);

    const destinataire: any = await manager
      .createQueryBuilder(PermissionEntity, 'permission')
      .select([
        "permission.id",
        "utilisateur.id",
        "utilisateur.email",
        "utilisateur.nom",
        "utilisateur.prenom",
        "typePermission.libelle"
      ])
      .leftJoin("permission.utilisateur", "utilisateur")
      .leftJoin("permission.typePermission", "typePermission")
      .where('permission.utilisateur=:utilisateur', { utilisateur: statutPermissionEntity.idusrcreation })
      .getMany()
    console.log(destinataire, 'destinataire')
    for (let i = 0; i < destinataire.length; i++) {
      const element = destinataire[i];
      const data = {
        salutation: "Bonjour M./Mm  " + element.utilisateur.nom + " " + element.utilisateur.prenom + "",
        content: "Votre permission de "+element.typePermission.libelle+" a été acceptée",
        thank: "Merci",
        signature: "L’équipe WARTI",
        email: element.utilisateur.email
      };

      const result = await this.mailservice.sendValidationPermission(statutPermissionEntity, data);
      if (result) {
        return {
          etat: "succes",
          data: {
            statutPermissionEntity
          }
        }
      }

    }

    return statutPermissionEntity;
  }


  //Afficher la liste des permissions en attente
  async recupererPermissionAttente(manager: EntityManager, user: UtilisateurEntity) {
    const listePermissionAttente = await manager
      .createQueryBuilder(PermissionEntity, 'permission')
      .select([
        'permission',
        'statutPermission',
        'statut.libelle',
        'typePermission.libelle',
        'typePermission.id',
        'utilisateur'
      ])
      .leftJoin('permission.statutPermission', 'statutPermission')
      .leftJoin('statutPermission.statut', 'statut')
      .leftJoin('permission.typePermission', 'typePermission')
      .leftJoin('permission.utilisateur', 'utilisateur')
      .orderBy('permission.id', 'DESC')
      .where('statutPermission.statut=1')
      .andWhere('utilisateur.id=:userid', { userid: user.id })
      .andWhere('statutPermission.actif=0')
      .andWhere('permission.geler=0')
      .getMany();
    // console.log(listePermissionAttente,'listePermissionAttente'); 

    return listePermissionAttente;


  }

  async recupererPermissionAttenteAll(manager: EntityManager) {
    const listePermissionAttenteAll = await manager
      .createQueryBuilder(PermissionEntity, 'permission')
      .select([
        'permission',
        'statutPermission',
        'statut.libelle',
        'typePermission.libelle',
        'typePermission.id',
        'utilisateur'
      ])
      .leftJoin('permission.statutPermission', 'statutPermission')
      .leftJoin('statutPermission.statut', 'statut')
      .leftJoin('permission.typePermission', 'typePermission')
      .leftJoin('permission.utilisateur', 'utilisateur')
      .orderBy('permission.id', 'DESC')
      .where('statutPermission.statut=1')
      .andWhere('statutPermission.actif=0')
      .andWhere('permission.geler=0')
      .getMany();
    // console.log(listePermissionAttente,'listePermissionAttente'); 

    return listePermissionAttenteAll;


  }



  //Afficher la liste des permissions en valider
  async recupererPermissionValider(manager: EntityManager, user: UtilisateurEntity) {
    const listePermissionValider = await manager
      .createQueryBuilder(PermissionEntity, 'permission')
      .select(['permission', 'statutPermission', 'statut', 'typePermission.libelle', 'typePermission.id', 'utilisateur'])
      .leftJoin('permission.statutPermission', 'statutPermission')
      .leftJoin('statutPermission.statut', 'statut')
      .leftJoin('permission.typePermission', 'typePermission')
      .leftJoin('permission.utilisateur', 'utilisateur')
      .where('statutPermission.statut=2')
      .andWhere('statutPermission.actif=0')
      .andWhere('permission.geler=0')
      .andWhere('utilisateur.id=:userid', { userid: user.id })
      .getMany();
    return listePermissionValider;
  }
  // Afficher la liste de toutes les permissions validée
  async recupererPermissionValiderAll(manager: EntityManager) {
    const listePermissionValider = await manager
      .createQueryBuilder(PermissionEntity, 'permission')
      .select(['permission', 'statutPermission', 'statut', 'typePermission.libelle', 'typePermission.id', 'utilisateur'])
      .leftJoin('permission.statutPermission', 'statutPermission')
      .leftJoin('statutPermission.statut', 'statut')
      .leftJoin('permission.typePermission', 'typePermission')
      .leftJoin('permission.utilisateur', 'utilisateur')
      .orderBy('permission.id', 'DESC')
      .where('statutPermission.statut=2')
      .andWhere('statutPermission.actif=0')
      .andWhere('permission.geler=0')
      .getMany();
    return listePermissionValider;
  }


  //Afficher la liste des permissions en rejeter
  async recupererPermissionrejeter(manager: EntityManager, user: UtilisateurEntity) {
    const listePermissionRejeter = await manager
      .createQueryBuilder(PermissionEntity, 'permission')
      .select(['permission', 'statutPermission', 'statut', 'typePermission.libelle', 'typePermission.id', 'utilisateur', 'motif.libelle'])
      .leftJoin('permission.statutPermission', 'statutPermission')
      .leftJoin('statutPermission.statut', 'statut')
      .leftJoin('statutPermission.motif', 'motif')
      .leftJoin('permission.typePermission', 'typePermission')
      .leftJoin('permission.utilisateur', 'utilisateur')
      .where('statutPermission.statut=3')
      .andWhere('statutPermission.actif=0')
      .andWhere('permission.geler=0')
      .andWhere('utilisateur.id=:userid', { userid: user.id })
      .getMany();
    return listePermissionRejeter;
  }

  //Afficher la liste de toutes les permissions en rejeter
  async recupererPermissionrejeterAll(manager: EntityManager) {
    const listePermissionRejeter = await manager
      .createQueryBuilder(PermissionEntity, 'permission')
      .select(['permission', 'statutPermission', 'statut', 'typePermission.libelle', 'typePermission.id', 'utilisateur', 'motif.libelle'])
      .leftJoin('permission.statutPermission', 'statutPermission')
      .leftJoin('statutPermission.statut', 'statut')
      .leftJoin('statutPermission.motif', 'motif')
      .leftJoin('permission.typePermission', 'typePermission')
      .leftJoin('permission.utilisateur', 'utilisateur')
      .where('statutPermission.statut=3')
      .andWhere('statutPermission.actif=0')
      .andWhere('permission.geler=0')
      .orderBy('permission.id', 'DESC')
      .getMany();
    return listePermissionRejeter;
  }



  // Récupérer le nombre de permission par statut

  async recupererNombrePermissionSatut(manager: EntityManager) {
    const statut = await manager.find(StatutEntity, { where: { empty3: 2 } })
    console.log(statut, 'statut');
    const NombrePermissionStatut = await manager.createQueryBuilder(PermissionEntity, "permission")
      .select([
        "statut.libelle AS libelle",
        "COUNT(permission.id) AS Nombre"

      ])
      .leftJoin("permission.statutPermission", "statutPermission")
      .leftJoin("statutPermission.statut", "statut")
      .addSelect('COUNT(*) AS Nombre')
      .groupBy('statutPermission.statut')
      .where("statutPermission.statut < 4")
      .andWhere('statutPermission.actif=0')
      .getRawMany()

    const result = [];
    for (let j = 0; j < NombrePermissionStatut.length; j++) {
      const element = NombrePermissionStatut[j];
      const resultData = [];
      resultData.push(element.libelle, parseInt(element.Nombre));
      result.push(resultData)
    }
    console.log(result, 'Resultat');
    return { result };

  }

  // les 4 Types de permissions les plus solicités
  async recupererTypePermission(manager: EntityManager) {
    const NombreTypePermission = await manager.createQueryBuilder(PermissionEntity, "permission")
      .select([
        "COUNT(permission.id) AS Nombre",
        "typePermission.libelle AS libelle"

      ])
      .leftJoin("permission.statutPermission", "statutPermission")
      .leftJoin("permission.typePermission", "typePermission")
      .leftJoin("statutPermission.statut", "statut")
      .addSelect('COUNT(*) AS Nombre')
      .groupBy('permission.typePermission')
      .orderBy('Nombre', 'DESC')
      .where('statutPermission.actif=0')
      .limit(4)
      .getRawMany()

    const result = [];
    for (let j = 0; j < NombreTypePermission.length; j++) {
      const element = NombreTypePermission[j];
      const resultData = [];
      resultData.push(element.libelle, parseInt(element.Nombre));
      result.push(resultData)
    }
    console.log(result, 'Resultat');
    return { result };

  }


  //Afficher la liste de toutes les permissions du mobile
  async recupererPermissionAll(manager: EntityManager) {
    // const currentDate : any = new Date();
    // const dates =  moment(currentDate).format('HH:mm');
    const listePermissionMobile = await manager
      .createQueryBuilder(PermissionEntity, 'permission')
      .select([
        'permission.detail',
        'permission.id',
        'statutPermission.id',
        'statut.libelle',
        'typePermission.libelle',
        'permission.dateCreation',
        'utilisateur.nom',
        'utilisateur.prenom',

      ])
      .leftJoin('permission.statutPermission', 'statutPermission')
      .leftJoin('statutPermission.statut', 'statut')
      .leftJoin('statutPermission.motif', 'motif')
      .leftJoin('permission.typePermission', 'typePermission')
      .leftJoin('permission.utilisateur', 'utilisateur')
      .orderBy('permission.id', 'DESC')
      .andWhere('statutPermission.actif=0')
      .andWhere('utilisateur.id=1')
      .andWhere('permission.geler=0')
      .getMany();
    // const result = [];
    //   for (let j = 0; j < listePermissionMobile.length; j++) {
    //     const element = listePermissionMobile[j];
    //     const resultData =[];
    //     resultData.push(element.libelle,parseInt(element.Nombre));
    //     result.push(resultData)
    //   }
    //   console.log(result,'Resultat');
    return listePermissionMobile;
  }



}

