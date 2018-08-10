// @flow

// Types prefixed with `MTC` represent the format returned by the MetroTransit API.
// Those prefixed with `TT` (`ThisTrip`) represent the format used by these projects.

// PROVIDERS
export type MTCProvider = { Text: string, Value: string }
export type TTProvider = { name: string, id: string }

// ROUTES
export type MTCRoute = { Description: string, ProviderID: string, Route: string }
export type TTRoute = { name: string, providerId: string, id: string }

// DIRECTIONS
export type MTCDirection = { Text: string, Value: string}
export type TTDirection = { name: string, id: string }

// STOPS
export type TTStop = { name: string, description: string, id: string, latitude: number, longitude: number }

// DEPARTURES
export type MTCDeparture = {
    Actual: boolean, // We only care about "actual" departures, so this will not be part of the app's internal type
    BlockNumber: number,
    DepartureText: string, // e.g., "7min"
    DepartureTime: string, // This comes across as pseudocode, so we'll rely on DepartureText for now.
    Gate: string, // Out of scope for now
    Route: string,
    RouteDirection: string,
    Terminal: string,
    VehicleHeading: number, // Out of scope for now
    VehicleLatitude: number,
    VehicleLongitude: number
}

export type TTDeparture = {
    departingIn: string,
    routeId: string, 
    direction: string,
    latitude: number,
    longitude: number
}