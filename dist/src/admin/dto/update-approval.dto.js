"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateApprovalDto = void 0;
const openapi = require("@nestjs/swagger");
class UpdateApprovalDto {
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: true, enum: ["PENDING", "ACTIVE", "REJECTED"] } };
    }
}
exports.UpdateApprovalDto = UpdateApprovalDto;
//# sourceMappingURL=update-approval.dto.js.map