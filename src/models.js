// @flow
import type {
  MTCRoute,
  TTRoute,
  MTCProvider,
  TTProvider,
  MTCDirection,
  TTDirection,
  MTCDeparture,
  TTDeparture
} from '../types'

// MODELS
//
// Constants and helpers that correspond to our data types
//
// `parse`: a fn that transforms data from its API-side format to a normalized result
// `url`: the URL we'll use to pull the corresponding records of that type
//

export const Provider = {
  parse: ({ Text, Value }: MTCProvider): TTProvider => ({
    name: Text,
    id: Value
  }),
  url: `https://svc.metrotransit.org/nextrip/providers`
}

export const Route = {
  parse: ({ Description, ProviderID, Route }: MTCRoute): TTRoute => ({
    name: Description,
    providerId: ProviderID,
    id: Route
  }),
  url: `https://svc.metrotransit.org/nextrip/routes`
}

export const Direction = {
  parse: ({ Text, Value }: MTCDirection): TTDirection => ({
    name: Text,
    id: Value
  }),
  url: (routeId: string) =>
    `http://svc.metrotransit.org/NexTrip/Directions/${routeId}?format=json`
}

export const Departure = {
  parse: ({
    Actual,
    DepartureText,
    Route,
    RouteDirection,
    VehicleLatitude,
    VehicleLongitude
  }: MTCDeparture): ?TTDeparture => {
    if (!Actual) return null // If the times aren't live, we don't want 'em
    return {
      routeId: Route,
      departingIn: DepartureText,
      direction: RouteDirection,
      latitude: VehicleLatitude,
      longitude: VehicleLongitude
    }
  },
  url: (stopId: string) =>
    `http://svc.metrotransit.org/NexTrip/${stopId}?format=json`
}
