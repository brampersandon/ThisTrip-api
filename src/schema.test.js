import { typeDefs, createResolvers } from './schema'

import { departures, stops } from './support'

const createMockRedis = (stopsData, stopData) => ({
  getStopsInRadius: async (..._) => Promise.resolve(stopsData),
  getStop: async _key => Promise.resolve(stopData)
})
const createMockAxios = data => ({ get: _url => Promise.resolve({ data }) })

// Resolver spec structure inspired in part by https://hackernoon.com/extensive-graphql-testing-57e8760f1c25
describe('resolvers', () => {
  const stopId = '12345'
  describe('departures', () => {
    it('can handle success', async () => {
      const redis = () => null
      const axios = createMockAxios(departures)
      const resolvers = createResolvers(redis, axios)

      const result = await resolvers.Query.departures({}, { stopId })
      expect(result).toMatchSnapshot()
    })
    it('can handle failure', async () => {
      const redis = () => null
      // Mock a bad HTTP response
      const axios = createMockAxios(false)
      const resolvers = createResolvers(redis, axios)

      const result = await resolvers.Query.departures({}, { stopId })

      // Expect the query to fail.
      expect(result).toBe(undefined)
    })
  })
  describe('stop', () => {
    it('can handle success', async () => {
      const redis = createMockRedis(stops, stops[0])
      const axios = () => null
      const resolvers = createResolvers(redis, axios)

      const result = await resolvers.Query.stop({}, { id: stopId })
      expect(result).toMatchSnapshot()
    })
    it('can handle failure', async () => {
      const redis = createMockRedis(false)
      const axios = () => null
      const resolvers = createResolvers(redis, axios)

      const result = await resolvers.Query.stop({}, { id: stopId })

      // Expect the query to fail.
      expect(result).toBe(undefined)
    })
  })
})
describe('nearbyStops', () => {
  const coords = { latitude: 45.0, longitude: -93.0 }
  it('can handle success', async () => {
    const redis = createMockRedis(stops, stops[0])
    const axios = () => null
    const resolvers = createResolvers(redis, axios)

    const result = await resolvers.Query.nearbyStops({}, coords)
    expect(result).toMatchSnapshot()
  })
  it('can handle failure', async () => {
    const redis = createMockRedis(false, false)
    const axios = () => null
    const resolvers = createResolvers(redis, axios)

    const result = await resolvers.Query.nearbyStops({}, coords)

    // Expect the query to fail.
    expect(result).toBe(undefined)
  })
})
xdescribe('routes')
xdescribe('providers')
xdescribe('directions')
