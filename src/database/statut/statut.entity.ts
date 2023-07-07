import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { ScanEntity } from '../scan/scan.entity';
import { StatutPermissionEntity } from '../statut_permission/statutPermission.entity';
// import { VisiteEntity } from '../visite';
@Entity('statut_sta')
@Index('fx_idusrcreation_idx', ['idusrcreation'])
export class StatutEntity { 
 
  @PrimaryGeneratedColumn (DefaultEntity.convertDataType({ type: 'integer', name:'id_sta', length: 11, scale: 0, primary:true, nullable: false, unique: true  }))
  id : number;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'libelle_sta', length: 100, scale: 0, nullable: false, unique: false  }))
  libelle : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty1_sta', length: 100, scale: 0, nullable: true, unique: false  }))
  empty1 : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty2_sta', length: 100, scale: 0, nullable: true, unique: false  }))
  empty2 : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty3_sta', length: 100, scale: 0, nullable: true, unique: false  }))
  empty3 : string;

  @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'geler_sta', length: 100, scale: 0, nullable: false, unique: false  }))
  geler : number;

  @Column (DefaultEntity.convertDataType({ type: 'timestamp' , name:'date_creation_sta', scale: 0, nullable: false, unique: false  }))
  dateCreation : Date; 

  @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'idusrcreation_sta', scale: 0, nullable: true, unique: false  }))
  idusrcreation : number; 



  // @OneToMany(type => VisiteEntity, visite => visite.id, {onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  // visite : VisiteEntity[];

  @OneToMany(type => StatutPermissionEntity, statutPermission => statutPermission.statut, {onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  statutPermission : StatutPermissionEntity[];


  @OneToMany(type => ScanEntity, scan => scan.statut, {onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  scan : ScanEntity[];

  constructor(init?: Partial<any>) { 
    Object.assign(this, init);
  }
} 
