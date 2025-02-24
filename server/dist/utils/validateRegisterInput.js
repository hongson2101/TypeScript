"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegisterInput = void 0;
const validateRegisterInput = (registerInput) => {
    if (!registerInput.email.includes('@'))
        return {
            message: 'Invalid email',
            error: [
                {
                    field: 'email',
                    message: 'Email must include @'
                }
            ]
        };
    if (registerInput.password.length <= 2)
        return {
            message: 'Invalid password',
            error: [
                {
                    field: 'password',
                    message: 'Length must be greater than 2'
                }
            ]
        };
    return null;
};
exports.validateRegisterInput = validateRegisterInput;
//# sourceMappingURL=validateRegisterInput.js.map