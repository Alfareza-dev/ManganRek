import { AccountStatus } from '@prisma/client';

export class UpdateApprovalDto {
  status!: AccountStatus;
}
