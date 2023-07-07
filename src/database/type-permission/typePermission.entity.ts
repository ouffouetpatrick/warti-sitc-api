import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { PermissionEntity } from '../permission/permission.entity';
// import { VisiteEntity } from '../visite';
@Entity('typepermission_tpr')
@Index('fx_idusrcreation_idx', ['idusrcreation'])
export class TypePermissionEntity { 
 
  @PrimaryGeneratedColumn (DefaultEntity.convertDataType({ type: 'integer', name:'id_tpr', length: 11, scale: 0, primary:true, nullable: false, unique: true  }))
  id : number;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'libelle_tpr', length: 100, scale: 0, nullable: false, unique: false  }))
  libelle : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty1_tpr', length: 100, scale: 0, nullable: true, unique: false  }))
  empty1 : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty2_tpr', length: 100, scale: 0, nullable: true, unique: false  }))
  empty2 : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty3_tpr', length: 100, scale: 0, nullable: true, unique: false  }))
  empty3 : string;

  @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'geler_tpr', length: 100, scale: 0, nullable: false, unique: false  }))
  geler : number;

  @Column (DefaultEntity.convertDataType({ type: 'timestamp' , name:'date_creation_tpr', scale: 0, nullable: false, unique: false  }))
  dateCreation : Date; 

  @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'idusrcreation_tpr', scale: 0, nullable: true, unique: false  }))
  idusrcreation : number; 



  @OneToMany(type => PermissionEntity, permission => permission.typePermission, {onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  permission : PermissionEntity[];
  
  
  constructor(init?: Partial<any>) { 
    Object.assign(this, init);
  }
} 
