import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";

const app = express();

app.use(cors({
    origin: "http://localhost:3321",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

async function startServer() {
    await server.start();

    app.use(
        "/graphql",
        cors<cors.CorsRequest>(),
        express.json(),
        expressMiddleware(server),
    );

    dotenv.config();

    const port = 3000;
    app.listen(
        port,
        () => console.log(`Server is running on http://localhost:${port}`),
    );
}

startServer();
