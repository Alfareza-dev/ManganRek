"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePromoDto = void 0;
const openapi = require("@nestjs/swagger");
class UpdatePromoDto {
    type;
    discount;
    startHour;
    endHour;
    menuIds;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: false, enum: ["ALL", "SPECIFIC"] }, discount: { required: false, type: () => Number }, startHour: { required: false, type: () => String }, endHour: { required: false, type: () => String }, menuIds: { required: false, type: () => [String] } };
    }
}
exports.UpdatePromoDto = UpdatePromoDto;
//# sourceMappingURL=update-promo.dto.js.map