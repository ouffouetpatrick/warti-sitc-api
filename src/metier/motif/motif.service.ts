import { Injectable } from '@nestjs/common';
import { Like, Between } from 'typeorm';
import { Transaction, TransactionManager, EntityManager, getManager,} from 'typeorm';
import { MotifEntity } from 'src/database/motif/motif.entity';

@Injectable()
export class MotifMetierService {
  constructor() {}





   //Afficher la liste des Motif 
   async listeMotif(manager: EntityManager) {
    const listemotif = await manager
      .createQueryBuilder(MotifEntity, 'motif')
      .select(['motif'])
      .where('motif.geler=0')
      .getMany();
    return listemotif;
  }


  //créer une nouvelle motif et lui attribuer un geler 0 (valide) par defaut.

  async nouveauMotif(manager: EntityManager, motif: any) {
    let motifEntity = new MotifEntity({
      ...motif,
      geler:0,
    });


    motifEntity = await manager.save(motifEntity);

    
    return motifEntity;
  }



//MOdifier une motif

  async modifierMotif(manager: EntityManager, motif: any) {
    let motifEntity = new MotifEntity({
      ...motif,
    });

    motifEntity = await manager.save(motifEntity);

    return motifEntity;
  }



  //Annuler une motif

  async annulerMotif(manager: EntityManager, motif: any) {
    let motifEntity = new MotifEntity({
      ...motif,
      geler: 1,
    });

    motifEntity = await manager.save(motifEntity);

    return motifEntity;
  }


  
  
}
