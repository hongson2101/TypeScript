"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const Post_1 = require("./entities/Post");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const hello_1 = require("./resolvers/hello");
const user_1 = require("./resolvers/user");
const apollo_server_core_1 = require("apollo-server-core");
const mongoose_1 = __importDefault(require("mongoose"));
const main = async () => {
    await (0, typeorm_1.createConnection)({
        type: 'postgres',
        database: "TypeScript",
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        logging: true,
        synchronize: true,
        entities: [User_1.User, Post_1.Post]
    });
    const app = (0, express_1.default)();
    await mongoose_1.default.connect(`mongodb+srv://vipford01:Admin@123456@typescript.n0wex.mongodb.net/?retryWrites=true&w=majority&appName=TypeScript`, {
        serverApi: { version: '1', strict: true, deprecationErrors: true }
    });
    console.log("MongoDB Connect");
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({ resolvers: [hello_1.HelloResolver, user_1.UserResolver], validate: false }),
        plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)()]
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app: app, cors: false });
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`sonlh connect ${PORT}${apolloServer.graphqlPath}`));
};
main().catch(error => console.log(error));
//# sourceMappingURL=index.js.map