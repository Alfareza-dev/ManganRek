"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyVoucherDto = void 0;
const openapi = require("@nestjs/swagger");
class BuyVoucherDto {
    voucherId;
    static _OPENAPI_METADATA_FACTORY() {
        return { voucherId: { required: true, type: () => String } };
    }
}
exports.BuyVoucherDto = BuyVoucherDto;
//# sourceMappingURL=buy-voucher.dto.js.map