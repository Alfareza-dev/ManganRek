"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVoucherDto = void 0;
const openapi = require("@nestjs/swagger");
class CreateVoucherDto {
    title;
    price;
    value;
    stock;
    expiryDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, price: { required: true, type: () => Number }, value: { required: true, type: () => Number }, stock: { required: true, type: () => Number }, expiryDate: { required: true, type: () => String } };
    }
}
exports.CreateVoucherDto = CreateVoucherDto;
//# sourceMappingURL=create-voucher.dto.js.map