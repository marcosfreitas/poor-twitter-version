import {
  IsDateString,
  IsNumberString,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class ListPostDto {
  @IsOptional()
  @IsUUID('4')
  public userUuid: string;

  @IsOptional()
  @IsDateString()
  public dateFrom: Date;

  @IsOptional()
  @IsDateString()
  public dateTo: Date;

  @IsOptional()
  @IsNumberString()
  public page: string;

  @IsOptional()
  @IsNumberString()
  public take: string;

  constructor(userUuid: string, dateFrom?: Date, dateTo?: Date) {
    this.userUuid = userUuid;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
  }
}
