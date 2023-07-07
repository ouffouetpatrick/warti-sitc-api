import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { StatutEntity } from '../statut/statut.entity';
import { MotifEntity } from '../motif';
import { PermissionEntity } from '../permission/permission.entity';
import { UtilisateurEntity } from '../utilisateur/utilisateur.entity';
// import { VisiteEntity } from '../visite';
@Entity('statutpermission_stp')
@Index('fx_idusrcreation_idx', ['idusrcreation'])
export class StatutPermissionEntity { 
 
  @PrimaryGeneratedColumn (DefaultEntity.convertDataType({ type: 'integer', name:'id_stp', length: 11, scale: 0, primary:true, nullable: false, unique: true  }))
  id : number;

  @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'actif_stp', length: 100, scale: 0, nullable: false, unique: false  }))
  actif : number;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty1_stp', length: 100, scale: 0, nullable: true, unique: false  }))
  empty1 : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty2_stp', length: 100, scale: 0, nullable: true, unique: false  }))
  empty2 : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty3_stp', length: 100, scale: 0, nullable: true, unique: false  }))
  empty3 : string;

  @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'geler_stp', length: 100, scale: 0, nullable: false, unique: false  }))
  geler : number;

  @Column (DefaultEntity.convertDataType({ type: 'timestamp' , name:'date_creation_stp', scale: 0, nullable: false, unique: false  }))
  dateCreation : Date; 

  @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'idusrcreation_stp', scale: 0, nullable: true, unique: false  }))
  idusrcreation : number;
  
  // Recuperer les informations de l'utilisateur à partir de son id se trouvant dans le champ iduscreation
  @ManyToOne(type => UtilisateurEntity, utilisateur => utilisateur.id, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'idusrcreation_stv' })
  utilisateur: UtilisateurEntity;

  @ManyToOne(type => PermissionEntity, permission => permission.statutPermission, {  nullable: true, primary:false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idper_stp'})
  permission : PermissionEntity;

  @ManyToOne(type => StatutEntity, statut => statut.statutPermission, {  nullable: true, primary:false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idsta_stp'})
  statut : StatutEntity;

  @ManyToOne(type => MotifEntity, motif => motif.statutPermission, {  nullable: true, primary:false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idmot_stp'})
  motif : MotifEntity;


  constructor(init?: Partial<any>) { 
    Object.assign(this, init);
  }
} 
