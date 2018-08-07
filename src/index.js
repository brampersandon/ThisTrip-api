// @flow
const { ApolloServer, gql } = require('apollo-server')
const axios = require('axios')

// Types prefixed with `MTC` represent the format returned by the MetroTransit API.
// Those prefixed with `TT` (`ThisTrip`) represent the format used by these projects.
type MTCProvider = { Text: string, Value: string }
export type TTProvider = { name: string, id: string }

// Constants and helpers that correspond to our data types
//
// `parse`: a fn that transforms data from its API-side format to a normalized result
// `url`: the URL we'll use to pull the corresponding records of that type
//
const Provider = {
    parse: ({ Text, Value }: MTCProvider): TTProvider => ({ name: Text, id: Value }),
    url: `https://svc.metrotransit.org/nextrip/providers`
}

type MTCRoute = { Description: string, ProviderID: string, Route: string }
export type TTRoute = { name: string, providerId: string, id: string }
const Route = {
    parse: ({ Description, ProviderID, Route }: MTCRoute): TTRoute => ({ name: Description, providerId: ProviderID, id: Route }),
    url: `https://svc.metrotransit.org/nextrip/routes`
}

const typeDefs = gql`
    type Provider {
        name: String
        id: String
    }

    type Route {
        name: String
        providerId: String
        id: String
    }

    type Query {
        routes: [Route]
        providers: [Provider] 
    }
`

const resolvers = {
    Query: {
        routes: async () => {
            const response = await axios.get(Route.url)
            if (response && response.data && response.data.length > 0) return response.data.map(Route.parse)
        },
        providers: async () => {
            const response = await axios.get(Provider.url)
            if (response && response.data && response.data.length > 0) return response.data.map(Provider.parse)
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
    console.log(`✅ Listening at ${url}`)
})