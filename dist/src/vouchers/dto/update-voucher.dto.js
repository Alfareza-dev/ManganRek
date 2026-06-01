"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVoucherDto = void 0;
const openapi = require("@nestjs/swagger");
class UpdateVoucherDto {
    title;
    price;
    value;
    stock;
    expiryDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String }, price: { required: false, type: () => Number }, value: { required: false, type: () => Number }, stock: { required: false, type: () => Number }, expiryDate: { required: false, type: () => String } };
    }
}
exports.UpdateVoucherDto = UpdateVoucherDto;
//# sourceMappingURL=update-voucher.dto.js.map