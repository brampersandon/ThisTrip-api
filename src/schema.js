// @flow
import { gql } from 'apollo-server'

import { Provider, Route, Direction, Departure } from './models'

import type { Axios } from 'axios'
import type { CacheClient } from './cache'

export const typeDefs = gql`
  type Provider {
    name: String
    id: String
  }

  type Route {
    name: String
    providerId: String
    id: String
  }

  type Direction {
    id: String
    name: String
  }

  type Departure {
    departingIn: String
    routeId: String
    direction: String
    latitude: Float
    longitude: Float
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
    nearbyStops(
      latitude: Float
      longitude: Float
      radius: Float
      units: String
    ): [Stop]
    stop(id: String): Stop
    departures(stopId: String): [Departure]
    directions(routeId: String): [Direction]
  }
`

export const createResolvers = (cache: CacheClient, axios: Axios) => ({
  Query: {
    routes: async () => {
      const response = await axios.get(Route.url)
      if (response && response.data && response.data.length > 0)
        return response.data.map(Route.parse)
    },
    providers: async () => {
      const response = await axios.get(Provider.url)
      if (response && response.data && response.data.length > 0)
        return response.data.map(Provider.parse)
    },
    departures: async (_: *, { stopId }: { stopId: string }) => {
      const response = await axios.get(Departure.url(stopId))
      if (response && response.data && response.data.length > 0)
        return response.data.map(Departure.parse).filter(d => d != null)
    },
    nearbyStops: async (
      _: *,
      {
        latitude,
        longitude,
        radius = 500,
        units = 'm'
      }: { latitude: string, longitude: string, radius: number, units: string }
    ) => {
      const response = await cache.getStopsInRadius(
        latitude,
        longitude,
        radius,
        units
      )
      // Response should be an array, else we can't decorate our stops correctly.
      if (!response || !response.length) return
      const stops = Promise.all(
        response
          .map(async ({ key, latitude, longitude, distance }) => {
            const stopResponse = await cache.getStop(key)
            if (!stopResponse) return null
            const { name, description, id } = stopResponse
            return { name, description, id, latitude, longitude, distance }
          })
          .filter(stop => stop != null)
      )
      return stops
    },
    stop: async (_: *, { id }: { id: string }) => {
      const response = await cache.getStop(id)
      if (response) return response
    },
    directions: async (_: *, { routeId }: { routeId: string }) => {
      const response = await axios.get(Direction.url(routeId))
      return response.data.map(Direction.parse)
    }
  }
})
