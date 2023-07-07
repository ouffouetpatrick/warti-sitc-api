import { Injectable } from '@nestjs/common';
import { Like, Between } from 'typeorm';
import { Transaction, TransactionManager, EntityManager, getManager,} from 'typeorm';
import { PermissionEntity } from 'src/database/permission/permission.entity';
import { StatutPermissionEntity } from 'src/database/statut_permission/statutPermission.entity';
import * as moment from 'moment';
import { UtilisateurProfilEntity } from 'src/database/utilisateur-profil/utilisateur-profil.entity';
import { UtilisateurEntity } from 'src/database/utilisateur/utilisateur.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class PermissionMetierService {
  constructor(
    private mailservice : MailService
  ){}

  //Fonction demande permission
  //créer une nouvelle permission et lui attribuer le statut 1(en attente) par defaut.
  async demandePermission(manager: EntityManager, permission: any, user:UtilisateurEntity) {
    
    let permissionEntity = new PermissionEntity({
      ...permission,
      // typepermission: permission.TypePermission.id
    });
    
    permissionEntity = await manager.save(permissionEntity);

    if (permissionEntity) {
      let statutPermissionEntity = new StatutPermissionEntity({
        empty1: null,
        empty2: null,
        empty3: null,
        geler: 0,
        dateCreation: new Date().toDateString(),
        idusrcreation: permissionEntity.utilisateur,
        permission: permissionEntity.id,
        statut: 1,
        actif: 0,
        motif: null,
      });
      statutPermissionEntity = await manager.save(statutPermissionEntity);
    }

    //Etape d'envoie d'email aux admin après ajout de visites
    //Recuperer les email des admin (utilisateur profil = 1) 
    const emailtab = [];
    const emailAdmin: any = await manager.createQueryBuilder(UtilisateurProfilEntity, 'user')
        .select([
          "user.id",
          "utilisateur.email",
          "profil.id"
      ])
      .leftJoin("user.utilisateur", "utilisateur")
      .leftJoin("user.profil", "profil")
      .where("user.profil=1")
      .getMany()

      // Ajouter le resultat au tableau emailtab
      // Le tableau sera utilisé comme adresse de destinataire dans le mailservice, ex:(to : [data.resultemail])
      for (let i = 0; i < emailAdmin.length; i++) {
        const element = emailAdmin[i];
        emailtab.push(element.utilisateur.email)
      }
      const resultemail = emailtab

      //Les variables crée dans le data sont utilisé dans le mailRequest.hbs du dossier templates
    const data = {
        salutation: "Bonjour cher administrateur",
        title: "Demande de permission",
        content: "M./Mm "+user.nom+" "+user.prenom+" a fait une demande de permission",
        consigne: "Veuillez l'examiner en vue de sa validation",
        thank: "Merci",
        signature: "L’équipe WARTI",
        resultemail
      };
  console.log(data,"data");

    const result = await this.mailservice.sendDemandePermission(user, permission, data);
    if(result){
      return {
        etat: "succes",
        data: {
          permission
        }
      }
    }
    return permissionEntity;
  }



  //Rejeter une permission
  async rejeterPermission(manager: EntityManager, permission: any) {
    const permissionEntity = new PermissionEntity({
      ...permission,
    });

   const permissions = await manager.save(permissionEntity);
   console.log(permissionEntity, 'permissionEntity');

      let statutPermissionEntity = new StatutPermissionEntity({
        empty1: null,
        empty2: null,
        empty3: null,
        geler: 0,
        dateCreation: new Date().toDateString(),
        idusrcreation: permissionEntity.utilisateur.id,
        permission: permissionEntity.id,
        statut: 3,
        actif: 0,
        motif: permission.motif.id,
      });
      const listePermissions = await manager.find(StatutPermissionEntity, {
        where: {
          permission: permissionEntity.id,
          actif: 0,
        },
      });
      if (listePermissions.length > 0) {
        for (let i = 0; i < listePermissions.length; i++) {
          const statut = listePermissions[i];
          statut.actif = 1;
          await manager.save(statut);
        }
        
      }
      statutPermissionEntity = await manager.save(statutPermissionEntity);

      if(statutPermissionEntity){
        const data = {
          salutation: "Bonjour M./Mm  "+permission.utilisateur.nom+" "+permission.utilisateur.prenom+"",
          content: "Votre permission de "+permission.typePermission.libelle+" a été rejetée pour le motif suivant :",
          motif_rejet: permission.motif.libelle,
          consigne: "Veuillez prendre une nouvelle permission pour une date ulterieure",
          thank: "Merci pour votre comprehension",
          signature: "L’équipe WARTI",
          email: permission.utilisateur.email
        };
        console.log(data,"data");
        const result = await this.mailservice.sendRejeterPermission(permission, data);
          if(result){
            return {
              etat: "succes",
              data: {
                permission
              }
            }
          }
      }
      console.log(statutPermissionEntity, 'statutPermissionEntity');
      
      return permissions;
}


//MOdifier une permission

  async modifierPermission(manager: EntityManager, permission: any) {
    let permissionEntity = new PermissionEntity({
      ...permission,
    });
    console.log(permission,"permission");
    permissionEntity = await manager.save(permissionEntity);

    return permissionEntity;
  }



  //Annuler une permission

  async annulerPermission(manager: EntityManager, permission: any) {
    let permissionEntity = new PermissionEntity({
      ...permission,
      geler: 1,
    });

    permissionEntity = await manager.save(permissionEntity);

    return permissionEntity;
  }



  
//Indicateur du jour (Dashboard)
//Recupére le nombre des permissionnaires
async recupererPermissionData(manager: EntityManager) {
  const currentDate : any = new Date();
  const dates =  moment(currentDate).format('yyyy/MM/DD');
  // console.log(dates,'DATES');
  const recupererPermissionData = await manager
  .createQueryBuilder(PermissionEntity, 'permission')
    .select([
      'utilisateur.id',
      // 'utilisateur.nom as nom'
    ])
      .leftJoin('permission.utilisateur', 'utilisateur') 
      .leftJoin('permission.statutPermission', 'statutPermission')
      .leftJoin('statutPermission.statut', 'statut')   
      // .groupBy('utilisateur.id')
      .where(
        'TO_DAYS(:date) <= TO_DAYS(permission.date_fin)',{ date: dates })
      .andWhere('statutPermission.statut=2')
      .andWhere('statutPermission.actif=0')
      .andWhere('utilisateur.geler=0')
      .getCount();
  return recupererPermissionData;
}

 // Nombre de permissions selon le genre 
 async repartitionPermissionData(manager: EntityManager) {
  const recupererDayData = await manager
  .createQueryBuilder(PermissionEntity, 'permission')
    .select([
      'utilisateur.sexe As Genre',
      'COUNT((permission.id)) As NombrePermission',
    ])
      .leftJoin('permission.utilisateur', 'utilisateur')   
      .leftJoin("utilisateur.utilisateurProfil", "utilisateurProfil")
      .leftJoin("utilisateurProfil.profil", "profil")
      .leftJoin('permission.statutPermission', 'statutPermission') 
      .leftJoin('statutPermission.statut', 'statut')  
      .groupBy('utilisateur.sexe')
      // .orderBy('Nombre','DESC')
      // .limit(5)
      .where('statutPermission.actif=0')
      .andWhere("utilisateurProfil.profil=3")
      .andWhere('utilisateurProfil.geler=0')
      .getRawMany();
      const result = [];
      const tab =[
        {id:1,libelle:'Permission'}
      ]
      for (let i = 0; i < tab.length; i++) {
        const element = tab[i];
        const resultData =[]; 
        resultData.push(element.libelle);
        for (let j = 0; j < recupererDayData.length; j++) {
          const element = recupererDayData[j];
          let nombrePermission = parseInt(element.NombrePermission);
          if (isNaN(nombrePermission)) {
            nombrePermission = 0;
          }
          resultData.push(nombrePermission)
        }
        result.push(resultData)
      }
      console.log(result,'Resultat');
  return {result} ;
  // return recupererDayData;
}
}
