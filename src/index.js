// @flow
import { ApolloServer, gql } from 'apollo-server'
import axios from 'axios'
import cache from './cache'

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

    type Stop {
        name: String
        description: String
        id: String
        latitude: Float
        longitude: Float
        distance: Float
    }

    type Query {
        routes: [Route]
        providers: [Provider]
        stops(latitude: Float, longitude: Float, radius: Float, units: String): [Stop]
        stop(id: String): Stop
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
        },
        stops: async (obj, {latitude, longitude, radius, units}, ctx) => {
            const response = await cache.getStopsInRadius(latitude, longitude, radius, units)
            const stops = Promise.all(response.map(async ({key, latitude, longitude, distance}) => {
                const {name, description, id} = await cache.getStop(key)
                return {name, description, id, latitude, longitude, distance}
            }))
            return stops
        },
        stop: async (obj, { id }, ctx) => await cache.getStop(id)
    }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
    console.log(`✅ Listening at ${url}`)
})