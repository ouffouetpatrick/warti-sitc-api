import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { StatutEntity } from '../statut/statut.entity';
import { UtilisateurEntity } from '../utilisateur/utilisateur.entity';
import { QrcodeEntity } from '../qrcode/qrcode.entity';
// import { VisiteEntity } from '../visite';
@Entity('scan_sca')
@Index('fx_idusrcreation_idx', ['idusrcreation'])
export class ScanEntity { 
 
  @PrimaryGeneratedColumn (DefaultEntity.convertDataType({ type: 'integer', name:'id_sca', length: 11, scale: 0, primary:true, nullable: false, unique: true  }))
  id : number;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'heure_arrive_sca', length: 255, scale: 0, nullable: false, unique: false  }))
  heure_arrive : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'heure_depart_sca', length: 255, scale: 0, nullable: false, unique: false  }))
  heure_depart : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'localisation_sca', length: 255, scale: 0, nullable: false, unique: false  }))
  localisation : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'numero_de_serie_sca', length: 255, scale: 0, nullable: false, unique: false  }))
  numero_de_serie : string;


  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty1_sca', length: 100, scale: 0, nullable: true, unique: false  }))
  empty1 : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty2_sca', length: 100, scale: 0, nullable: true, unique: false  }))
  empty2 : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty3_sca', length: 100, scale: 0, nullable: true, unique: false  }))
  empty3 : string;

  @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'geler_sca', length: 100, scale: 0, nullable: false, unique: false  }))
  geler : number;

  @Column (DefaultEntity.convertDataType({ type: 'timestamp' , name:'date_creation_sca', scale: 0, nullable: false, unique: false  }))
  dateCreation : Date; 

  @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'idusrcreation_sca', scale: 0, nullable: true, unique: false  }))
  idusrcreation : number; 

  @ManyToOne(type => UtilisateurEntity, utilisateur => utilisateur.scan, {  nullable: true, primary:false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idusr_sca'})
  utilisateur : UtilisateurEntity;


  @ManyToOne(type => StatutEntity, statut => statut.scan, {  nullable: true, primary:false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idsta_sca'})
  statut : StatutEntity;


  @ManyToOne(type => QrcodeEntity, qrcode => qrcode.scan, {  nullable: true, primary:false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idqrc_sca'})
  qrcode : QrcodeEntity;



  constructor(init?: Partial<any>) { 
    Object.assign(this, init);
  }
} 
