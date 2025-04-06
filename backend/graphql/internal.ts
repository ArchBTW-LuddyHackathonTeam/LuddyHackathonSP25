import apolloServer from "../server";

async function internalRequest(query: string, variables: object = {}) {
    const response = await apolloServer.executeOperation({ query, variables });

    if (response.body.kind === "incremental"){
        throw Error("GraphQL incremental responses not supported");
    }

    if (response.body.singleResult.errors){
        throw Error(JSON.stringify(response.body.singleResult.errors));
    }

    return response.body.singleResult.data;
}

export default internalRequest;
