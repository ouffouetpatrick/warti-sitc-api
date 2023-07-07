import { IsString, IsInt, IsOptional } from 'class-validator';
import { StatutPermissionDto } from '../statut_permission/statutPermission.dto';
// import VisiteDto from '../visite/visite.dto';

export class MotifDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsString()
  readonly libelle: string;

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
  readonly statut_permission: StatutPermissionDto[];

  // @IsOptional()
  // readonly visite: VisiteDto;

//   @IsOptional()
//   readonly statutMotif: MotifMotifDto[];

}
