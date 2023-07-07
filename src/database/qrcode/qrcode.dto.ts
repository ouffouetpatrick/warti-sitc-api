import { IsString, IsInt, IsOptional } from 'class-validator';
import { ScanDto } from '../scan/scan.dto';


// import VisiteDto from '../visite/visite.dto';

export class QrcodeDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsString()
  readonly libelle: string;


  @IsInt()
  readonly actif: number;

  
  @IsString()
  readonly localisation: string;

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
  readonly scan: ScanDto[];

  // @IsOptional()
  // readonly scan: ScanDto[];


  // @IsOptional()
  // readonly visite: VisiteDto;

//   @IsOptional()
//   readonly qrcodeQrcode: QrcodeQrcodeDto[];

}
