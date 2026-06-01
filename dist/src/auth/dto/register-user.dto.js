"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserDto = void 0;
const openapi = require("@nestjs/swagger");
class RegisterUserDto {
    email;
    password;
    name;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, password: { required: true, type: () => String }, name: { required: true, type: () => String } };
    }
}
exports.RegisterUserDto = RegisterUserDto;
//# sourceMappingURL=register-user.dto.js.map