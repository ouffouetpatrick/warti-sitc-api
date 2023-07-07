import { IsString, IsInt, IsOptional } from 'class-validator';
import { StatutPermissionDto } from '../statut_permission/statutPermission.dto';
import { UtilisateurDto } from '../utilisateur/utilisateur.dto';
import { TypePermissionDto } from '../type-permission/typePermission.dto';
// import UtilisateurDto from '../visite/visite.dto';

export class PermissionDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  
  @IsString()
  readonly detail: string;

  @IsString()
  readonly date_debut: string;

  @IsString()
  readonly date_fin: string;
 
  @IsOptional()
  @IsString()
  readonly empty1: string;

  @IsOptional()
  @IsString()
  readonly empty2: string;

  @IsOptional()
  @IsString()
  readonly empty3: string;

  @IsInt()
  readonly geler: number;

  @IsString()
  readonly dateCreation: string;

  @IsInt()
  readonly idusrcreation: number;

  @IsOptional()
  readonly utilisateur: UtilisateurDto;

  @IsOptional()
  readonly statutPermission: StatutPermissionDto[];


  
  @IsOptional()
  readonly typePermission: TypePermissionDto[];


//   @IsOptional()
//   readonly statutPermission: StatutPermissionDto[];

}
