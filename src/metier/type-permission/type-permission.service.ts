import { Injectable } from '@nestjs/common';
import { TypePermissionEntity } from 'src/database/type-permission/typePermission.entity';
import { Like, Between } from 'typeorm';
import { Transaction, TransactionManager, EntityManager, getManager,} from 'typeorm';
// import { TypePermissionEntity } from 'src/database/typePermission/typePermission.entity';

@Injectable()
export class TypePermissionMetierService {
  constructor() {}





   //Afficher la liste des TypePermission 
   async listeTypePermission(manager: EntityManager) {
    const listetypePermission = await manager
      .createQueryBuilder(TypePermissionEntity, 'typePermission')
      .select(['typePermission'])
      .where('typePermission.geler=0')
      .getMany();
    return listetypePermission;
  }


  //créer une nouvelle typePermission et lui attribuer un geler 0 (valide) par defaut.

  async nouveauTypePermission(manager: EntityManager, typePermission: any) {
    let typePermissionEntity = new TypePermissionEntity({
      ...typePermission,
      geler:0,
    });


    typePermissionEntity = await manager.save(typePermissionEntity);

    
    return typePermissionEntity;
  }



//MOdifier une typePermission

  async modifierTypePermission(manager: EntityManager, typePermission: any) {
    let typePermissionEntity = new TypePermissionEntity({
      ...typePermission,
    });

    typePermissionEntity = await manager.save(typePermissionEntity);

    return typePermissionEntity;
  }



  //Annuler une typePermission

  async annulerTypePermission(manager: EntityManager, typePermission: any) {
    let typePermissionEntity = new TypePermissionEntity({
      ...typePermission,
      geler: 1,
    });

    typePermissionEntity = await manager.save(typePermissionEntity);

    return typePermissionEntity;
  }


  
  
}
