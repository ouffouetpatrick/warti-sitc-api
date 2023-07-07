import { IsString, IsInt, IsOptional } from 'class-validator';
import { PermissionDto } from '../permission/permission.dto';

// import VisiteDto from '../visite/visite.dto';

export class TypePermissionDto {
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
  readonly permission: PermissionDto[];

  // @IsOptional()
  // readonly statut_permission: TypePermissionPermissionDto[];

  // @IsOptional()
  // readonly scan: ScanDto[];


  // @IsOptional()
  // readonly visite: VisiteDto;

//   @IsOptional()
//   readonly statutTypePermission: TypePermissionTypePermissionDto[];

}
