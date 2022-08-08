import { IsDefined, IsNumber } from 'class-validator';

/**
 * User config attributes
 */
export class UserConfig {
  @IsDefined()
  @IsNumber()
  public readonly postDailyLimit: number;
}
