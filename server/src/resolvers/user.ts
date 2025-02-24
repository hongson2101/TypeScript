import { User } from "../entities/User";
import { Arg,Mutation, Resolver } from "type-graphql";
import argon2  from "argon2";
import { UserMutationResponse } from "../types/UserMutationRespone";
import { RegisterInput } from "../types/RegisterInput";
import { validateRegisterInput } from "../utils/validateRegisterInput";


@Resolver()
export class UserResolver{
    @Mutation(_return => UserMutationResponse, {nullable:true})
    async register(
        @Arg('registerInput') registerInput: RegisterInput
    ): Promise<UserMutationResponse>
    {
        const validateRegisterInputErrors = validateRegisterInput(registerInput)
        
        if(validateRegisterInputErrors !== null)
                return {
                    code: 400,
                    success: false,
                    ...validateRegisterInputErrors
                }
        try{
            const {username,email, password} = registerInput
            const existingUser = await User.findOne({where: [{username: username},{email: email}]})

            if(existingUser) 
                return {
                     code: 400,
                     success: false,
                     message: 'Data duplicate',
                     error:[
                        {
                            field: existingUser.username === username ? 'username': 'email',
                            message: `${existingUser.username === username ? 'username': 'email'} exists `
                        }
                     ]   
                }

            const hashedPassword = await argon2.hash(password)
            const newUser = User.create({
                username,
                password: hashedPassword,
                email
            })

            return {
                code: 200,
                success: true,
                message: 'User registration successful',
                user: await User.save(newUser)
            }
        }
        catch (error){
            console.log(error)
            return {
                code: 500,
                success: false,
                message: `Internal server error ${error.message}`  
            }
        }
        
    }
}