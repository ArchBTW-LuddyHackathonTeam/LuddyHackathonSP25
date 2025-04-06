import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();

import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import usersRoute from "./routes/users"
import schedulerRoute from "./routes/scheduler"
import classesRoute from "./routes/classes"

const app = express();

app.use(cors({
    origin: "http://localhost:3321",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/users", usersRoute);
app.use("/scheduler", schedulerRoute);
app.use("/classes", classesRoute);

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

    const port = 3000;
    app.listen(
        port,
        () => console.log(`Server is running on http://localhost:${port}`),
    );
}

startServer();

export default apolloServer;
