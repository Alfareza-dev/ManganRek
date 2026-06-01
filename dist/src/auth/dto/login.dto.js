"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDto = void 0;
const openapi = require("@nestjs/swagger");
class LoginDto {
    email;
    password;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, password: { required: true, type: () => String } };
    }
}
exports.LoginDto = LoginDto;
//# sourceMappingURL=login.dto.js.map