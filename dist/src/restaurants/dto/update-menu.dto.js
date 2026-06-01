"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMenuDto = void 0;
const openapi = require("@nestjs/swagger");
class UpdateMenuDto {
    name;
    description;
    price;
    image;
    isAvailable;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, description: { required: false, type: () => String }, price: { required: false, type: () => Number }, image: { required: false, type: () => String }, isAvailable: { required: false, type: () => Boolean } };
    }
}
exports.UpdateMenuDto = UpdateMenuDto;
//# sourceMappingURL=update-menu.dto.js.map