// @flow
import * as redis from 'redis'
import type { TTProvider } from '../'

const client = redis.createClient(process.env.REDIS_URI || '')

const { promisify } = require('util')

const set = promisify(client.set).bind(client)
const get = promisify(client.get).bind(client)

// I've gotta sign off for now, but I'd love to use: https://www.npmjs.com/package/georedis
// const geoAdd = promisify(client.geoadd).bind(client)

const keys = {
    PROVIDERS: 'providers',
    STOPS: 'stops'
} 

export default {
    setProviders: async (providers: TTProvider[]) => set(keys.PROVIDERS, providers),
    getProviders: async () => get(keys.PROVIDERS),
    // addStop: async (id, lat, lng) => geoAdd
}