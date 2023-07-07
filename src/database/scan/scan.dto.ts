import { IsString, IsInt, IsOptional } from 'class-validator';
import { StatutDto } from '../statut/statut.dto';
import { QrcodeDto } from '../qrcode/qrcode.dto';
// import VisiteDto from '../visite/visite.dto';

export class ScanDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsString()
  readonly heure_arrive: string;

  @IsString()
  readonly heure_depart: string;

  @IsString()
  readonly localisation: string;

  @IsString()
  readonly numero_de_serie: string;


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
  readonly statut: StatutDto[];

  @IsOptional()
  readonly qrcode: QrcodeDto[];

  // @IsOptional()
  // readonly visite: VisiteDto;

//   @IsOptional()
//   readonly statutScan: StatutScanDto[];

}
