# ThisTrip API

An in-the-moment reference for MetroTransit bus and rail services. This project contains the GraphQL API in use by the web project.

## Getting Started

Install packages with `yarn`, and start the server with `yarn start`.

## Technologies and Tools Used

The project is bundled with `parcel`, and makes use of `jest` for testing, and `flow` for type checking. I did not use generators or boilerplate projects to begin this portion of the project, as I wanted to keep the needs here relatively minimal.

The APIs I used are described on [MetroTransit's API documentation site](http://svc.metrotransit.org/). For certain situations, it was necessary to pre-load or store certain data that MetroTransit does not provide through their API endpoint (instead, this data originates from [a ZIP of CSV files](https://gisdata.mn.gov/dataset/us-mn-state-metc-trans-transit-schedule-google-fd) that is generated weekly). A copy of the data used can be found at `src/data/*.csv`.

For testing, I often refer to [this Hacker Noon](https://hackernoon.com/extensive-graphql-testing-57e8760f1c25) article for structural guidance, though generally resolver testing follows a similar approach across projects (whether using apollo-server on Node, `graphql-rails` on Ruby/Rails, or other platforms) in my experience.

## Caveats and constraints

Due to time constraints, a strong reliance is placed on the type system to validate correctness of functions that transform objects from one format into another, and the use of proper property accesses. This leans on the strengths of `flow` in comparison to writing out equivalent specs in `jest` (which may look rather similar to methodically checking the existence and values of certain properties on resulting objects), however as the application grows there could be additional business logic imbued in those transformations that could necessitate more extensive testing. 

Flow may provide some assurances that the values we're operating on have an expected type, but it can't help guard against data that is invalid, incorrect or useless. With more time, a greater emphasis on integration testing would be priority 1.

Additionally, with more time, there could be a greater degree of shared code across the web interface and the API. While the Flow types are shared across the project, keeping them in sync would be cleaner if both the `web` and `api` projects used a third `types` module. For ease of development, I did not create a separate package for this. There are a number of opportunities to ensure the Flow types and GraphQL schemas remain in sync as well, which would be another focus for future work.