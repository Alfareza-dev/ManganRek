"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateVoucherDto = void 0;
const openapi = require("@nestjs/swagger");
class ValidateVoucherDto {
    uniqueCode;
    static _OPENAPI_METADATA_FACTORY() {
        return { uniqueCode: { required: true, type: () => String } };
    }
}
exports.ValidateVoucherDto = ValidateVoucherDto;
//# sourceMappingURL=validate-voucher.dto.js.map