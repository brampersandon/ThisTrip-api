// @flow
import { ApolloServer } from 'apollo-server'
import axios from 'axios'

import { typeDefs, createResolvers } from './schema'
import { createCache, defaultClient } from './cache'

const cache = createCache(defaultClient)
const resolvers = createResolvers(cache, axios)

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(`✅ Listening at ${url}`)
})
