import { IsString, IsInt, IsOptional } from 'class-validator';
import { StatutDto } from '../statut/statut.dto';
import { PermissionDto } from '../permission/permission.dto';
// import VisiteDto from '../visite/visite.dto';

export class StatutPermissionDto {
  @IsOptional()
  @IsInt()
  readonly id: number;


  @IsInt()
  readonly actif: number;

  
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
  readonly permission: PermissionDto;


  
  @IsOptional()
  readonly statut: StatutDto;


  
  // @IsOptional()
  // readonly permission: PermissionDto;

//   @IsOptional()
//   readonly statutStatutPermission: StatutPermissionStatutPermissionDto[];

}
