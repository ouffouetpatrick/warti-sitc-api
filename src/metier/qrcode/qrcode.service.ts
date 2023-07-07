import { Injectable } from '@nestjs/common';
import { Like, Between } from 'typeorm';
import { Transaction, TransactionManager, EntityManager, getManager,} from 'typeorm';
import { QrcodeEntity } from 'src/database/qrcode/qrcode.entity';

@Injectable()
export class QrcodeMetierService {
  constructor() {}

  //créer une nouvelle qrcode et lui attribuer un actif 0 (valide) par defaut.

  async nouveauQrcode(manager: EntityManager, qrcode: any) {
    let qrcodeEntity = new QrcodeEntity({
      ...qrcode,
      actif:0,
      localisation: 'localisation sitc',
    });

    const listeQrcode = await manager.find(QrcodeEntity, {
      where: {
        actif: 0,
      },
    });

    if (listeQrcode.length > 0) {
      for (let i = 0; i < listeQrcode.length; i++) {
        const statut = listeQrcode[i];
        statut.actif = 1;
        await manager.save(statut);
      }
    }

    qrcodeEntity = await manager.save(qrcodeEntity);

    return qrcodeEntity;
  }

}
