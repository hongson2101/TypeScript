import { RegisterInput } from "../types/RegisterInput";

export const validateRegisterInput = (registerInput: RegisterInput) => {
    if(!registerInput.email.includes('@'))
        return{
            message: 'Invalid email',
            error: [
                {
                    field: 'email',
                    message: 'Email must include @'
                }
            ]
        }

    if(registerInput.password.length <= 2)
        return{
            message: 'Invalid password',
            error: [
                {
                    field: 'password',
                    message: 'Length must be greater than 2'
                }
            ]
        }
    return null
}