import express from 'express';
import cors from 'cors';
import compression from 'compression';
import {createServer} from 'http';
import enviroment from './config/enviroments';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema/Index';
import expressPlayground from 'graphql-playground-middleware-express';
import Database from './lib/database';
import {IContext} from './interfaces/context.interface';
///importacion variables de entorno
if (process.env.NODE_ENV !== 'production'){
    const env = enviroment;
    console.log(env);
}

async function init() {
    



const app = express();

app.use(cors());

app.use(compression());

const database = new Database();

const db = await database.init();

 

const context = async({req , connection}: IContext) => {
    const token = (req) ? req.headers.authorization : connection.authorization ;
    return {db, token};
};

app.get('/',expressPlayground({

    endpoint: '/graphql'
}));

const server = new ApolloServer({
    schema ,
    introspection: true ,
    context: context
});    

server.applyMiddleware({app});

const httpServer = createServer(app);

const PORT = process.env.PORT || 2002;

httpServer.listen({
    port: PORT
},
 ()=> console.log(' Mercado Vida') 
);
}

init();