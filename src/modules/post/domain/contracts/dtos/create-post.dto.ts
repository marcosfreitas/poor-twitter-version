import { IsDefined, IsOptional, IsUUID, Length } from 'class-validator';

// @todo may derivates to post dto as a base for this class
export class CreatePostDto {
  @IsDefined()
  @IsUUID('4')
  public userUuid: string;

  @IsDefined()
  @Length(0, 777)
  public content: string;

  @IsOptional()
  @IsUUID('4')
  public repostedUuid?: string;
}
