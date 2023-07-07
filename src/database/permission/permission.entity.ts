import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { StatutPermissionEntity } from '../statut_permission/statutPermission.entity';
import { UtilisateurEntity } from '../utilisateur/utilisateur.entity';
import { TypePermissionEntity } from '../type-permission/typePermission.entity';
// import { VisiteEntity } from '../utilisateur';
@Entity('permission_per')
@Index('fx_idusrcreation_idx', ['idusrcreation'])
export class PermissionEntity { 
 
  @PrimaryGeneratedColumn (DefaultEntity.convertDataType({ type: 'integer', name:'id_per', length: 11, scale: 0, primary:true, nullable: false, unique: true  }))
  id : number;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'detail_per', length: 255, scale: 0, nullable: false, unique: false  }))
  detail : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'date_debut_per', length: 255, scale: 0, nullable: false, unique: false  }))
  date_debut : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'date_fin_per', length: 255, scale: 0, nullable: false, unique: false  }))
  date_fin : string;


  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty1_per', length: 100, scale: 0, nullable: true, unique: false  }))
  empty1 : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty2_per', length: 100, scale: 0, nullable: true, unique: false  }))
  empty2 : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty3_per', length: 100, scale: 0, nullable: true, unique: false  }))
  empty3 : string;

  @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'geler_per', length: 100, scale: 0, nullable: false, unique: false  }))
  geler : number;

  @Column (DefaultEntity.convertDataType({ type: 'timestamp' , name:'date_creation_per', scale: 0, nullable: false, unique: false  }))
  dateCreation : Date; 

  @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'idusrcreation_per', scale: 0, nullable: true, unique: false  }))
  idusrcreation : number; 

   
  @ManyToOne(type => UtilisateurEntity, utilisateur => utilisateur.permission, {  nullable: true, primary:false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idusr_per'})
  utilisateur : UtilisateurEntity;

   
  @ManyToOne(type => TypePermissionEntity, typePermission => typePermission.permission, {  nullable: true, primary:false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idtpr_per'})
  typePermission : TypePermissionEntity;


  @OneToMany(type =>StatutPermissionEntity , statutPermission => statutPermission.permission, {onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  statutPermission : StatutPermissionEntity[];


  constructor(init?: Partial<any>) { 
    Object.assign(this, init);
  }
} 
