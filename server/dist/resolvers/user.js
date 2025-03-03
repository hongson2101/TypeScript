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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const UserMutationRespone_1 = require("../types/UserMutationRespone");
const RegisterInput_1 = require("../types/RegisterInput");
const validateRegisterInput_1 = require("../utils/validateRegisterInput");
const LoginInput_1 = require("../types/LoginInput");
let UserResolver = class UserResolver {
    async register(registerInput) {
        const validateRegisterInputErrors = (0, validateRegisterInput_1.validateRegisterInput)(registerInput);
        if (validateRegisterInputErrors !== null)
            return Object.assign({ code: 400, success: false }, validateRegisterInputErrors);
        try {
            const { username, email, password } = registerInput;
            const existingUser = await User_1.User.findOne({ where: [{ username: username }, { email: email }] });
            if (existingUser)
                return {
                    code: 400,
                    success: false,
                    message: 'Data duplicate',
                    error: [
                        {
                            field: existingUser.username === username ? 'username' : 'email',
                            message: `${existingUser.username === username ? 'username' : 'email'} exists `
                        }
                    ]
                };
            const hashedPassword = await argon2_1.default.hash(password);
            const newUser = User_1.User.create({
                username,
                password: hashedPassword,
                email
            });
            return {
                code: 200,
                success: true,
                message: 'User registration successful',
                user: await User_1.User.save(newUser)
            };
        }
        catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: `Internal server error ${error.message}`
            };
        }
    }
    async login(loginInput) {
        try {
            const existingUser = await User_1.User.findOne({ where: loginInput.usernameOrEmail.includes('@') ? { email: loginInput.usernameOrEmail } : { username: loginInput.usernameOrEmail } });
            if (!existingUser)
                return {
                    code: 400,
                    success: false,
                    message: 'User not found',
                    error: [
                        {
                            field: 'usernameOremail', message: 'Username or Email incorrect'
                        }
                    ]
                };
            const passwordValid = await argon2_1.default.verify(existingUser.password, loginInput.password);
            if (!passwordValid)
                return {
                    code: 400,
                    success: false,
                    message: 'Wrong pass',
                    error: [{
                            field: 'pass', message: 'Wrong pass'
                        }]
                };
            return {
                code: 200,
                success: true,
                message: 'Login successfully',
                user: existingUser
            };
        }
        catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: `Internal server error ${error.message}`
            };
        }
    }
};
exports.UserResolver = UserResolver;
__decorate([
    (0, type_graphql_1.Mutation)(_return => UserMutationRespone_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)('registerInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterInput_1.RegisterInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(_return => UserMutationRespone_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)('loginInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInput_1.LoginInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
exports.UserResolver = UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
//# sourceMappingURL=user.js.map