import { IsBoolean } from 'class-validator';

export class UpdateUserPremiumDto {
  @IsBoolean()
  isPremium!: boolean;
}