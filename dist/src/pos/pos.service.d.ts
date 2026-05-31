import { PrismaService } from '../prisma/prisma.service';
import { ValidateVoucherDto } from './dto/validate-voucher.dto';
export declare class PosService {
    private prisma;
    constructor(prisma: PrismaService);
    validateVoucher(cashierId: string, dto: ValidateVoucherDto): Promise<{
        transactionId: string;
        voucherTitle: string;
        value: number;
        status: string;
    }>;
}
