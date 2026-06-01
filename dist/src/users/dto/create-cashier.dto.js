"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCashierDto = void 0;
const openapi = require("@nestjs/swagger");
class CreateCashierDto {
    email;
    password;
    name;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, password: { required: true, type: () => String }, name: { required: true, type: () => String } };
    }
}
exports.CreateCashierDto = CreateCashierDto;
//# sourceMappingURL=create-cashier.dto.js.map