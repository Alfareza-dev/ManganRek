"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRestoDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class RegisterRestoDto {
    email;
    password;
    name;
    restaurantName;
    address;
    latitude;
    longitude;
    legalPhoto;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, password: { required: true, type: () => String }, name: { required: true, type: () => String }, restaurantName: { required: true, type: () => String }, address: { required: true, type: () => String }, latitude: { required: true, type: () => Number }, longitude: { required: true, type: () => Number }, legalPhoto: { required: false, type: () => Object } };
    }
}
exports.RegisterRestoDto = RegisterRestoDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], RegisterRestoDto.prototype, "latitude", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], RegisterRestoDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string', format: 'binary', description: 'Berkas foto bukti legalitas restoran' }),
    __metadata("design:type", Object)
], RegisterRestoDto.prototype, "legalPhoto", void 0);
//# sourceMappingURL=register-resto.dto.js.map