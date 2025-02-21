require ('dotenv').config()
import 'reflect-metadata'
import express from 'express'
import { createConnection } from 'typeorm'
import { User } from './entities/User'
import { Post } from './entities/Post'

const main = async() =>{
    await createConnection({
        type: 'postgres',
        database:"TypeScript",
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        logging:true,
        synchronize: true,
        entities:[User,Post]
    })

const app =express()
app.listen(4000, ()=> console.log("connect 4000"))
}

main().catch(error => console.log(error))