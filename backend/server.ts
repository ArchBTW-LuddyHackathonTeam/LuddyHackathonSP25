import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";

import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import internalRequest from "./graphql/internal";

const app = express();

app.use(cors({
    origin: "http://localhost:3321",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});

async function startServer() {
    await apolloServer.start();

    app.use(
        "/graphql",
        cors<cors.CorsRequest>(),
        express.json(),
        expressMiddleware(apolloServer),
    );

    dotenv.config();

    const port = 3000;
    app.listen(
        port,
        () => console.log(`Server is running on http://localhost:${port}`),
    );
}

startServer();

export default apolloServer;
