require ('dotenv').config()
import 'reflect-metadata'
import express from 'express'
import { createConnection } from 'typeorm'
import { User } from './entities/User'
import { Post } from './entities/Post'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { UserResolver } from './resolvers/user'
import { ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core'

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

const app = express();
const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [HelloResolver,UserResolver], validate: false}),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
})

await apolloServer.start()
apolloServer.applyMiddleware({app: app as any, cors: false})

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> console.log(`sonlh connect ${PORT}${apolloServer.graphqlPath}`))
}

main().catch(error => console.log(error))