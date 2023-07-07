import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { ScanEntity } from '../scan/scan.entity';

// import { QrcodePermissionEntity } from '../qrcode_permission/qrcodePermission.entity';
// import { VisiteEntity } from '../visite';
@Entity('qrcode_qrc')
@Index('fx_idusrcreation_idx', ['idusrcreation'])
export class QrcodeEntity {
  
  @PrimaryGeneratedColumn (DefaultEntity.convertDataType({ type: 'integer', name:'id_qrc', length: 11, scale: 0, primary:true, nullable: false, unique: true  }))
  id : number;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'libelle_qrc', length: 100, scale: 0, nullable: false, unique: false  }))
  libelle : string;

  @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'actif_qrc', scale: 0, nullable: false, unique: false  }))
  actif : number; 

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'localisation_qrc', length: 100, scale: 0, nullable: true, unique: false  }))
  localisation : string;


  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty1_qrc', length: 100, scale: 0, nullable: true, unique: false  }))
  empty1 : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty2_qrc', length: 100, scale: 0, nullable: true, unique: false  }))
  empty2 : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty3_qrc', length: 100, scale: 0, nullable: true, unique: false  }))
  empty3 : string;

  @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'geler_qrc', length: 100, scale: 0, nullable: false, unique: false  }))
  geler : number;

  @Column (DefaultEntity.convertDataType({ type: 'timestamp' , name:'date_creation_qrc', scale: 0, nullable: false, unique: false  }))
  dateCreation : Date; 

  @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'idusrcreation_qrc', scale: 0, nullable: true, unique: false  }))
  idusrcreation : number; 



  @OneToMany(type => ScanEntity, scan => scan.qrcode, {onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  scan : ScanEntity[];

  // @OneToMany(type => QrcodePermissionEntity, qrcodePermission => qrcodePermission.qrcode, {onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  // qrcodePermission : QrcodePermissionEntity[];


  // @OneToMany(type => ScanEntity, scan => scan.qrcode, {onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  // scan : ScanEntity[];

  constructor(init?: Partial<any>) { 
    Object.assign(this, init);
  }
} 
