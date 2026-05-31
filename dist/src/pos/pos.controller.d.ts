import { PosService } from './pos.service';
import { ValidateVoucherDto } from './dto/validate-voucher.dto';
import type { Request } from 'express';
export declare class PosController {
    private readonly posService;
    constructor(posService: PosService);
    validateVoucher(req: Request, dto: ValidateVoucherDto): Promise<{
        success: boolean;
        message: string;
        data: {
            transactionId: string;
            voucherTitle: string;
            value: number;
            status: string;
        };
    }>;
}
