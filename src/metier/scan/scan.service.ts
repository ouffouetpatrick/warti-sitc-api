import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Like, Between } from 'typeorm';
import { Transaction, TransactionManager, EntityManager, getManager, } from 'typeorm';
import { ScanEntity } from 'src/database/scan/scan.entity';
import * as moment from 'moment';
import { StatutEntity } from 'src/database/statut/statut.entity';
import { PermissionEntity } from 'src/database/permission/permission.entity';
import { UtilisateurEntity } from 'src/database/utilisateur/utilisateur.entity';
import { stat } from 'fs';
import { QrcodeEntity } from 'src/database/qrcode/qrcode.entity';
import { sqrt } from 'mathjs';
import * as geolib from 'geolib';

// import moment from 'moment';
let cron = require('node-cron');
// const { getManager } = require('typeorm');

@Injectable()
export class ScanMetierService {
  constructor() { }

  //Au scan, enregistrer les informations de l'utilisateur.
  async Scanner(manager: EntityManager, scan: any) {

    const currentDate: any = new Date();
    const heure = (moment(currentDate).format('HH:mm'));
    const dateJour = (moment(currentDate).format('DD/MM/YYYY'));

    console.log(dateJour, 'dateJour');
    const raduis = 50;
    const centreLatitude = 5.3564235;
    const centreLongitude = -3.9801648;
    const distance = geolib.getDistance(
      { latitude: centreLatitude, longitude: centreLongitude },
      { latitude: scan.latitude, longitude: scan.longitude }
    );

    console.log(distance, "mètre");
    // console.log(scan);

    const listeQrcode = await manager.find(QrcodeEntity, {
      where: {
        libelle: scan.qrCode,
        actif: 0,
      },
    });
    const dates = moment(currentDate).format('yyyy/MM/DD');
    const usersWithScan = await manager
      .createQueryBuilder(UtilisateurEntity, 'utilisateur')
      .innerJoin('utilisateur.scan', 'scan', 'TO_DAYS(scan.dateCreation) = TO_DAYS(:date)', { date: dates })
      .select(['utilisateur.id as id', 'utilisateur.nom', 'utilisateur.prenom'])
      .getRawMany();

    // console.log(usersWithScan);

    cron.schedule('30 14 * * 1-5', async () => {
      const manager = getManager();
      const usersWithoutScan = await manager
        .createQueryBuilder(UtilisateurEntity, 'utilisateur')
        .leftJoin('utilisateur.scan', 'scan', 'TO_DAYS(scan.dateCreation) = TO_DAYS(:date)', { date: dates })
        .where('scan.id IS NULL')
        .select([
          'utilisateur.id as id',
          'utilisateur.nom',
          'utilisateur.prenom'
        ])
        .getRawMany();
      // console.log(usersWithoutScan, "usersWithoutScan");
      for (let i = 0; i < usersWithoutScan.length; i++) {
        const element = usersWithoutScan[i]
        const scanEntity = new ScanEntity({
          dateCreation: "",
          empty1: null,
          empty2: null,
          empty3: null,
          geler: 0,
          heure_arrive: "00:00",
          heure_depart: "00:00",
          idusrcreation: 1,
          localisation: "NULL",
          numero_de_serie: "NULL",
          utilisateur: element.id,
          statut: 6,
        });

        console.log('scanEntity', scanEntity);
        console.log('usersWithoutScan', usersWithoutScan);
        await manager.save(scanEntity);
      }
      console.log('ibra')
    });

    // for (let i = 0; i < usersWithScan.length; i++) {
    //  element = usersWithScan[i]
    // if (!listeScan.id) {     
    if (listeQrcode.length > 0 && distance < raduis) {
      if (heure <= "08:00") {
        let scanEntity = new ScanEntity({
          ...scan,
          statut: 4,
        });
        scanEntity = await manager.save(scanEntity);
        return scanEntity;

      }
      else {
        let scanEntity = new ScanEntity({
          ...scan,
          statut: 5,
        });
        scanEntity = await manager.save(scanEntity);
        return scanEntity;

      }

      // }
    }
    else {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'TON MESSAGE D4ERREUR',
      }, HttpStatus.FORBIDDEN);
    }
    // console.log(scanEntity,'scanEntity')*

    // }

  };

  async userAbsent(manager: EntityManager, scan: any) {
    // Tâche cron pour enregistrer les utilisateurs sans scan chaque lundi à vendredi à 14h00
    // cron.schedule('01 * * * 1-5', async () => {
    const currentDate = new Date();
    const dates = moment(currentDate).format('yyyy/MM/DD');
    const usersWithoutScan = await manager
      .createQueryBuilder(UtilisateurEntity, 'utilisateur')
      .leftJoin('utilisateur.scan', 'scan', 'TO_DAYS(scan.dateCreation) = TO_DAYS(:date)', { date: dates })
      .where('scan.id IS NULL')
      .select(['utilisateur.id as id', 'utilisateur.nom', 'utilisateur.prenom'])
      .getRawMany();

    console.log(usersWithoutScan, 'usersWithoutScan');

    for (const utilisateur of usersWithoutScan) {
      const scanEntity = new ScanEntity({
        dateCreation: "",
        empty1: null,
        empty2: null,
        empty3: null,
        geler: 0,
        heure_arrive: "null",
        heure_depart: "null",
        idusrcreation: 1,
        localisation: "null",
        numero_de_serie: "",
        utilisateur: utilisateur.id,
        statut: 6,
      });

      console.log(usersWithoutScan);
      await manager.save(scanEntity);
    }
    // });
  }

  // Afficher la liste général de présence

  async recupererlistedepresenceGeneral(manager: EntityManager) {
    const recupererlistedepresence = await manager
      .createQueryBuilder(ScanEntity, 'scan')
      .select(['scan', 'statut.libelle', 'utilisateur.id', 'utilisateur.nom', 'utilisateur.prenom'])
      .leftJoin('scan.utilisateur', 'utilisateur')
      .leftJoin('scan.statut', 'statut')
      .where('scan.geler=0')
      .getMany();
    return recupererlistedepresence;
  }

  //Afficher la liste des retard
  async recupererlistederetard(manager: EntityManager) {
    const recupererlistedepresence = await manager
      .createQueryBuilder(ScanEntity, 'scan')
      .select(['scan', 'statut.libelle', 'utilisateur.id', 'utilisateur.nom', 'utilisateur.prenom'])
      .leftJoin('scan.utilisateur', 'utilisateur')
      .leftJoin('scan.statut', 'statut')
      .where('scan.statut=5')
      .andWhere('scan.dateCreation="2023-03-31T14:20:50.000Z"')
      .getMany();
    return recupererlistedepresence;
  }

  //Afficher la liste des présences
  async recupererlistedepresence(manager: EntityManager) {
    const recupererlistedepresence = await manager
      .createQueryBuilder(ScanEntity, 'scan')
      .select(['scan', 'statut.libelle', 'utilisateur.id', 'utilisateur.nom', 'utilisateur.prenom'])
      .leftJoin('scan.utilisateur', 'utilisateur')
      .leftJoin('scan.statut', 'statut')
      .where('scan.statut=4')
      .getMany();
    return recupererlistedepresence;
  }

  // Afficher la liste des statuts
  async recupererlistedeStatut(manager: EntityManager) {
    const recupererlistedepresence = await manager
      .createQueryBuilder(StatutEntity, 'statut')
      .select(['statut.id', 'statut.libelle'])
      .where('statut.geler=0')
      .andWhere('statut.id > 3')
      .getMany();
    return recupererlistedepresence;
  }


  //recherche journalière
  async rechercherByDay(manager: EntityManager, query: any) {
    // console.log(query, 'QUERY');
    const requete = await manager
      .createQueryBuilder(ScanEntity, 'scan')
      .select(['scan', 'statut.id', 'utilisateur.id', 'utilisateur.nom', 'utilisateur.prenom', 'statut.libelle'])
      .leftJoin('scan.utilisateur', 'utilisateur')
      .leftJoin('scan.statut', 'statut')
    if (query.statut == 'All') {
      requete
        .where('TO_DAYS(scan.dateCreation)=TO_DAYS(:dateAssiduite)', { dateAssiduite: query.dateJour })

    } else {
      requete
        .where('TO_DAYS(scan.dateCreation)=TO_DAYS(:dateAssiduite)', { dateAssiduite: query.dateJour })
        .andWhere('scan.statut=:statut', { statut: query.statut })
    }


    const rechercherByDayAll = requete.getMany();
    return rechercherByDayAll;
  }

  //recherche journalière de Mobile
  async rechercherByDayMobile(manager: EntityManager, query: any, user: UtilisateurEntity) {

    const requete = await manager
      .createQueryBuilder(ScanEntity, 'scan')
      .select(['scan', 'statut.id', 'utilisateur.id', 'utilisateur.nom', 'utilisateur.prenom', 'statut.libelle'])
      .leftJoin('scan.utilisateur', 'utilisateur')
      .leftJoin('scan.statut', 'statut')
      .orderBy('scan.id', 'DESC')
      .where('TO_DAYS(scan.dateCreation)=TO_DAYS(:dateAssiduite)', { dateAssiduite: query.dateJour })
      .andWhere('utilisateur.id=:userid', { userid: user.id })
    const rechercherByDayAll = requete.getMany();
    // console.log(requete, 'QUERY');
    return rechercherByDayAll;
  }



  //recherche Hebdo
  async rechercherByWeek(manager: EntityManager, query: any) {
    console.log(query, 'QUERYHEBDO');
    const requete = await manager
      .createQueryBuilder(ScanEntity, 'scan')
      .select(['scan', 'statut.id', 'utilisateur.id', 'utilisateur.nom', 'utilisateur.prenom', 'statut.libelle'])
      .leftJoin('scan.utilisateur', 'utilisateur')
      .leftJoin('scan.statut', 'statut')
    if (query.statut == 'All') {
      requete
        .where(
          'TO_DAYS (scan.dateCreation) BETWEEN TO_DAYS(:datedebutAssiduite) AND TO_DAYS(:datefinAssiduite)',
          { datedebutAssiduite: query.dateDebut, datefinAssiduite: query.dateFin },
        )
    } else {
      requete
        .where(
          'TO_DAYS (scan.dateCreation) BETWEEN TO_DAYS(:datedebutAssiduite) AND TO_DAYS(:datefinAssiduite)',
          { datedebutAssiduite: query.dateDebut, datefinAssiduite: query.dateFin },
        )
        .andWhere('scan.statut=:statut', { statut: query.statut })
    }


    const rechercherByWeekAll = requete.getMany();
    return rechercherByWeekAll;
  }


  //recherche Hebdo du Mobile
  async rechercherByWeekMobile(manager: EntityManager, query: any) {
    console.log(query, 'QUERYHEBDO');
    const requete = await manager
      .createQueryBuilder(ScanEntity, 'scan')
      .select(['scan', 'statut.id', 'utilisateur.id', 'utilisateur.nom', 'utilisateur.prenom', 'statut.libelle'])
      .leftJoin('scan.utilisateur', 'utilisateur')
      .leftJoin('scan.statut', 'statut')
      .orderBy('scan.id', 'DESC')
      .where(
        'TO_DAYS (scan.dateCreation) BETWEEN TO_DAYS(:datedebutAssiduite) AND TO_DAYS(:datefinAssiduite)',
        { datedebutAssiduite: query.dateDebut, datefinAssiduite: query.dateFin },
      )

    const rechercherByWeekAll = requete.getMany();
    return rechercherByWeekAll;
  }



  //recherche Mensuelle
  async rechercherByMonth(manager: EntityManager, query: any) {
    // console.log(query, 'QUERY');
    const requete = await manager
      .createQueryBuilder(ScanEntity, 'scan')
      .select(['scan', 'statut.id', 'utilisateur.id', 'utilisateur.nom', 'utilisateur.prenom', 'statut.libelle'])
      .leftJoin('scan.utilisateur', 'utilisateur')
      .leftJoin('scan.statut', 'statut')
    if (query.statut == 'All') {
      requete
        .where('EXTRACT(YEAR FROM scan.dateCreation)=:annee', {
          annee: query.annee,
        })
        .andWhere('EXTRACT(MONTH FROM scan.dateCreation)=:mois', {
          mois: query.mois,
        })

    } else {
      requete
        .where('EXTRACT(YEAR FROM scan.dateCreation)=:annee', {
          annee: query.annee,
        })
        .andWhere('EXTRACT(MONTH FROM scan.dateCreation)=:mois', {
          mois: query.mois,
        })
        .andWhere('scan.statut=:statut', { statut: query.statut })
    }


    const rechercherByMonthAll = requete.getMany();
    return rechercherByMonthAll;
  }

  //recherche Mensuelle du mobile
  async rechercherByMonthMobile(manager: EntityManager, query: any, user: UtilisateurEntity) {
    // console.log(query, 'QUERY');
    const requete = await manager
      .createQueryBuilder(ScanEntity, 'scan')
      .select(['scan', 'statut.id', 'utilisateur.id', 'utilisateur.nom', 'utilisateur.prenom', 'statut.libelle'])
      .leftJoin('scan.utilisateur', 'utilisateur')
      .leftJoin('scan.statut', 'statut')
      .orderBy('scan.id', 'DESC')
      .where('EXTRACT(YEAR FROM scan.dateCreation)=:annee', {
        annee: query.annee,
      })
      .andWhere('EXTRACT(MONTH FROM scan.dateCreation)=:mois', {
        mois: query.mois,
      })
      .andWhere('utilisateur.id=:userid', { userid: user.id })
    const rechercherByMonthAll = requete.getMany();
    return rechercherByMonthAll;
  }


  //recherche Annuelle
  async rechercherByYear(manager: EntityManager, query: any) {
    // console.log(query, 'QUERY');
    const requete = await manager
      .createQueryBuilder(ScanEntity, 'scan')
      .select(['scan', 'statut.id', 'utilisateur.id', 'utilisateur.nom', 'utilisateur.prenom', 'statut.libelle'])
      .leftJoin('scan.utilisateur', 'utilisateur')
      .leftJoin('scan.statut', 'statut')
    if (query.statut == 'All') {
      requete
        .where('EXTRACT(YEAR FROM scan.dateCreation)=:annee', {
          annee: query.annee,
        })

    } else {
      requete
        .where('EXTRACT(YEAR FROM scan.dateCreation)=:annee', {
          annee: query.annee,
        })
        .andWhere('scan.statut=:statut', { statut: query.statut })
    }


    const rechercherByYearAll = requete.getMany();
    return rechercherByYearAll;
  }

  //recherche Annuelle du Mobile
  async rechercherByYearMobile(manager: EntityManager, query: any, user: UtilisateurEntity) {
    // console.log(query, 'QUERY');
    const requete = await manager
      .createQueryBuilder(ScanEntity, 'scan')
      .select(['scan', 'statut.id', 'utilisateur.id', 'utilisateur.nom', 'utilisateur.prenom', 'statut.libelle'])
      .leftJoin('scan.utilisateur', 'utilisateur')
      .leftJoin('scan.statut', 'statut')
      .orderBy('scan.id', 'DESC')
      .where('EXTRACT(YEAR FROM scan.dateCreation)=:annee', {
        annee: query.annee,
      })
      .andWhere('utilisateur.id=:userid', { userid: user.id })
    const rechercherByYearAll = requete.getMany();
    return rechercherByYearAll;
  }


  //indicateur du jour (Dashboard)

  async getSatutByDay(liste: any[], statut) {
    let retour: any = 0;
    for (let i = 0; i < liste.length; i++) {
      const element = liste[i];
      if (element.libelle == statut) {
        retour = parseInt(element.Nombre)
        break;
      }
    }
    return parseInt(retour)
  }
  //Graph et données du jour
  async recupererDayData(manager: EntityManager) {
    const currentDate: any = new Date();
    const dates = moment(currentDate).format('yyyy/MM/DD');
    const statut = await manager.find(StatutEntity, { where: { empty3: 1 } })
    const recupererDayData = await manager
      .createQueryBuilder(ScanEntity, 'scan')
      .select([
        'COUNT(scan.id) As Nombre',
        'statut.libelle As libelle',
      ])
      .leftJoin('scan.statut', 'statut')
      .groupBy('statut.libelle')
      .where('TO_DAYS(scan.dateCreation)=TO_DAYS(:date)', { date: dates })
      .getRawMany();

    const result = [];
    for (let j = 0; j < recupererDayData.length; j++) {
      const element = recupererDayData[j];
      const resultData = [];
      resultData.push(element.libelle, parseInt(element.Nombre));
      result.push(resultData)
    }
    //  console.log(result,'Resultatibra');

    const result1 = [];
    for (let i = 0; i < statut.length; i++) {
      const element = statut[i];
      const resultatStatut = { statut: element.libelle, nombre: 0 };
      for (let j = 0; j < recupererDayData.length; j++) {
        const statutduJour = recupererDayData[j];
        if (element.libelle == statutduJour.libelle) {
          const statutByDay = await this.getSatutByDay(recupererDayData, statutduJour.libelle);
          resultatStatut.nombre = statutByDay;
        }
      }
      result1.push(resultatStatut)
    }
    console.log(result1, 'Resultat1');
    return {
      result,
      recupererDayData,
      result1
    };
  }



  async getNomByStatut(liste: any[], statut, mois) {
    let retour: any = 0;
    for (let i = 0; i < liste.length; i++) {
      const element = liste[i];
      if (element.Mois == mois && element.libelle == statut) {
        retour = element.Nombre;
        break;
      }
    }
    return parseInt(retour)
  }


  async getNomByPermissioin(liste: any[], mois) {
    let retour: any = 0;
    for (let i = 0; i < liste.length; i++) {
      const element = liste[i];
      if (element.Mois == mois) {
        retour = element.NombrePermission;
        break;
      }
    }
    return parseInt(retour)
  }
  //Graph du Taux annuel
  async recupererMonthData(manager: EntityManager) {
    const currentDate: any = new Date();
    const dates = moment(currentDate).format('yyyy/MM/DD');
    console.log(dates, 'Query');
    const statut = await manager.find(StatutEntity, { where: { empty3: 1 } })
    console.log(statut, 'statut');

    const recupererMonthData = await manager
      .createQueryBuilder(ScanEntity, 'scan')
      .select([
        'DISTINCT (statut.libelle) As libelle',
        'COUNT(statut.id) As Nombre',
        'EXTRACT(YEAR FROM scan.dateCreation) as Annee',
        'EXTRACT(MONTH FROM scan.dateCreation) as Mois'
      ])

      .leftJoin('scan.statut', 'statut')
      .leftJoin('statut.statutPermission', 'statutPermission')
      .leftJoin('statutPermission.permission', 'permission')
      .groupBy('Mois')
      .orderBy('Mois')
      .addGroupBy('statut.id')
      .where('EXTRACT(YEAR FROM scan.dateCreation)=:date', { date: dates })
      .getRawMany();


    const recupererDayData = await manager
      .createQueryBuilder(PermissionEntity, 'permission')
      .select([
        'COUNT(permission.id) As NombrePermission',
        'EXTRACT(YEAR FROM permission.dateCreation) as Annee',
        'EXTRACT(MONTH FROM permission.dateCreation) as Mois'
      ])

      .leftJoin('permission.statutPermission', 'statutPermission')
      .leftJoin('statutPermission.statut', 'statut')
      .groupBy('Mois')
      .where('EXTRACT(YEAR FROM permission.dateCreation)=:date', { date: dates })
      .andWhere('statutPermission.actif=0')
      .getRawMany();

    //  Tableau des mois de l'années
    const mois = [
      { id: 1, nom: 'Janvier', trigramme: 'Jan' },
      { id: 2, nom: 'Fevrier', trigramme: 'Fev' },
      { id: 3, nom: 'Mars', trigramme: 'Mars' },
      { id: 4, nom: 'Avril', trigramme: 'Avr' },
      { id: 5, nom: 'Mai', trigramme: 'Mai' },
      { id: 6, nom: 'Juin', trigramme: 'Juin' },
      { id: 7, nom: 'Juillet', trigramme: 'Juill' },
      { id: 8, nom: 'Août', trigramme: 'Août' },
      { id: 9, nom: 'Septembre', trigramme: 'Sept' },
      { id: 10, nom: 'Octobre', trigramme: 'Oct' },
      { id: 11, nom: 'Novembre', trigramme: 'Nov' },
      { id: 12, nom: 'Decembre', trigramme: 'Dec' },
    ];

    // Formatage en fonction du graphe
    const result = [];
    for (let i = 0; i < mois.length; i++) {
      const moisEnCours = mois[i];
      const resultMoisEnCours = [];
      resultMoisEnCours.push(moisEnCours.trigramme);
      for (let j = 0; j < statut.length; j++) {
        const statutDuMois = statut[j];
        const nombreStatutMoisCourrant = await this.getNomByStatut(recupererMonthData, statutDuMois.libelle, moisEnCours.id);
        resultMoisEnCours.push(nombreStatutMoisCourrant);
        if (j == (statut.length - 1)) {
          const nombrePermission = await this.getNomByPermissioin(recupererDayData, moisEnCours.id);
          resultMoisEnCours.push(nombrePermission);
        }
      }
      result.push(resultMoisEnCours)
    }
    console.log(result, 'Resultat');



    return {
      result,
      // recupererMonthData,
      // recupererDayData,
    };

  }


  // Top 5 des retardataires
  async recupererRetardataireData(manager: EntityManager) {
    const recupererDayData = await manager
      .createQueryBuilder(ScanEntity, 'scan')
      .select([
        'COUNT((utilisateur.id)) As Nombre',
        'utilisateur.nom As Nom',
        'statut.libelle'
      ])
      .leftJoin('scan.utilisateur', 'utilisateur')
      .leftJoin("utilisateur.utilisateurProfil", "utilisateurProfil")
      .leftJoin("utilisateurProfil.profil", "profil")
      .leftJoin('scan.statut', 'statut')
      .groupBy('utilisateur.nom')
      .orderBy('Nombre', 'DESC')
      .limit(5)
      .where('statut.id=5')
      .andWhere("utilisateurProfil.profil=3")
      .andWhere('utilisateurProfil.geler=0')
      .getRawMany();
    const result = [];
    for (let j = 0; j < recupererDayData.length; j++) {
      const element = recupererDayData[j];
      const resultData = [];
      resultData.push(element.Nom, parseInt(element.Nombre));
      result.push(resultData)
    }
    console.log(result, 'Resultat');
    return { result };
    // return recupererDayData;
  }


  // Nombre de retard selon le genre 
  async repartitionRetardData(manager: EntityManager) {
    const recupererDayData = await manager
      .createQueryBuilder(ScanEntity, 'scan')
      .select([
        'utilisateur.sexe As Genre',
        'COUNT((utilisateur.id)) As NombreRetard',
        'statut.libelle as libelle'
      ])
      .leftJoin('scan.utilisateur', 'utilisateur')
      .leftJoin("utilisateur.utilisateurProfil", "utilisateurProfil")
      .leftJoin("utilisateurProfil.profil", "profil")
      .leftJoin('scan.statut', 'statut')
      .groupBy('utilisateur.sexe')
      .orderBy('Genre', 'ASC')
      .where('statut.id=5')
      .andWhere("utilisateurProfil.profil=3")
      .andWhere('utilisateurProfil.geler=0')
      .getRawMany();
    const result = [];
    const tab = [
      { id: 1, libelle: 'Retard' }
    ]
    for (let i = 0; i < tab.length; i++) {
      const element = tab[i];
      const resultData = [];
      resultData.push(element.libelle);
     
      for (let j = 0; j < recupererDayData.length; j++) {
        const element = recupererDayData[j];
        let nombreRetard = parseInt(element.NombreRetard);
        if (isNaN(nombreRetard)) {
          nombreRetard = 0;
        }
        resultData.push(nombreRetard)
      }
      result.push(resultData)
    }
    console.log(result, 'Resultat');
    return { result };
    // return recupererDayData;
  }

  //Graphe du mobile
  // Formatage en fonction du graphe
  async getGraphSatut(liste: any[], statuts) {
    let retour: any = 0;
    for (let i = 0; i < liste.length; i++) {
      const element = liste[i];
      if (element.libelle == statuts) {
        retour = parseInt(element.Nombre)
        break;
      }
    }
    return parseInt(retour)
  }

  async getNombrePermission(liste: any[], permissionNombre) {
    let retour: any = 0;
    for (let i = 0; i < liste.length; i++) {
      const element = liste[i];
      if (element.libelle == permissionNombre) {
        retour = element.NombrePermission;
        break;
      }

    }
    return parseInt(retour)
  }


  async recupererGraphData(manager: EntityManager, user: UtilisateurEntity) {
    const currentDate: any = new Date();
    const dates = moment(currentDate).format('yyyy');
    // const statuts= await manager.find(StatutEntity, {where:{empty2:1} })
    const recupererGraphData = await manager
      .createQueryBuilder(ScanEntity, 'scan')
      .select([
        'COUNT(scan.id) As Nombre',
        'statut.libelle As libelle',
        'utilisateur.nom As Nom',
      ])
      .leftJoin('scan.statut', 'statut')
      .leftJoin('scan.utilisateur', 'utilisateur')
      .groupBy('statut.libelle')
      .where('EXTRACT(YEAR FROM scan.dateCreation)=:date', { date: dates })
      .andWhere('utilisateur.geler=0')
      .andWhere('utilisateur.id=:userid', { userid: user.id })
      .getRawMany();

    const recupererPermissionGraphData = await manager
      .createQueryBuilder(PermissionEntity, 'permission')
      .select([
        'COUNT(permission.id) As NombrePermission',
        'statut.libelle As libelle'
      ])

      .leftJoin('permission.statutPermission', 'statutPermission')
      .leftJoin('statutPermission.statut', 'statut')
      .where('EXTRACT(YEAR FROM permission.dateCreation)=:date', { date: dates })
      .andWhere('statutPermission.actif=0')
      .andWhere('statutPermission.statut=2')
      // .andWhere('utilisateur.id=:userid',{userid: user.id})
      .getRawMany();


    //Tableau des statuts d'assisduité
    const statuts = [
      { id: 1, libelle: "Absence", valeur: "Absent", color: "#BA0F0F", },
      { id: 2, libelle: "Présence", valeur: "Ponctuel", color: "#808000", },
      { id: 3, libelle: "Rétard", valeur: "Retard", color: "#008080", },
      { id: 4, libelle: "Permission", valeur: "Valider", color: "#023C85", },
    ]



    const result1 = [];
    for (let i = 0; i < statuts.length; i++) {
      const element = statuts[i];
      const date = []
      const resultatStatut = {
        name: element.libelle, nombre: 0, color: element.color, legendFontColor: "black", legendFontSize: 15,
      };
      for (let j = 0; j < recupererGraphData.length; j++) {
        const statutduGraph = recupererGraphData[j];
        for (let k = 0; k < recupererPermissionGraphData.length; k++) {
          const permissionNombre = recupererPermissionGraphData[k];
          if (element.valeur == statutduGraph.libelle) {
            const statutByYear = await this.getGraphSatut(recupererGraphData, statutduGraph.libelle);
            resultatStatut.nombre = (statutByYear);
            // resultatStatut.date=(dates);
          }
          else if (element.valeur == permissionNombre.libelle) {
            const nombrePermission = await this.getNombrePermission(recupererPermissionGraphData, permissionNombre.libelle);
            resultatStatut.nombre = (nombrePermission);

          }
        }
        // resultatStatut.date = (dates);
      }
      result1.push(resultatStatut)
    }
    console.log(result1, 'ResultatGraphMobile');
    return result1;
  }
  //
}


