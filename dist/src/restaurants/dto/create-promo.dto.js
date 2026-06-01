"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePromoDto = void 0;
const openapi = require("@nestjs/swagger");
class CreatePromoDto {
    type;
    discount;
    startHour;
    endHour;
    menuIds;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: false, enum: ["ALL", "SPECIFIC"] }, discount: { required: true, type: () => Number }, startHour: { required: true, type: () => String }, endHour: { required: true, type: () => String }, menuIds: { required: false, type: () => [String] } };
    }
}
exports.CreatePromoDto = CreatePromoDto;
//# sourceMappingURL=create-promo.dto.js.map