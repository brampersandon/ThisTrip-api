# ThisTrip API

An in-the-moment reference for MetroTransit bus and rail services. This project contains the GraphQL API in use by the web project.

## Getting Started

Install packages with `yarn`, and start the server with `yarn start`.

## Technologies and Tools Used

The project is bundled with `parcel`, and makes use of `jest` for testing, and `flow` for type checking. I did not use generators or boilerplate projects to begin this portion of the project, as I wanted to keep the needs here relatively minimal.

The APIs I used are described on [MetroTransit's API documentation site](http://svc.metrotransit.org/). For certain situations, it was necessary to pre-load or store certain data that MetroTransit does not provide through their API endpoint (instead, this data originates from [a ZIP of CSV files](https://gisdata.mn.gov/dataset/us-mn-state-metc-trans-transit-schedule-google-fd) that is generated weekly). A copy of the data used can be found at `src/data/*.csv`.

## Caveats and constraints

Due to the time constraints, the test suite are not as comprehensive as I would prefer them to be. In addition to the implemented tests, I've added some scaffolded (but skipped) specs that indicate the kind tests I would add with additional time. 

Correspondingly, a stronger reliance is placed on the type system to validate correctness of functions that transform objects from one format into another. This leans on the strengths of `flow` in comparison to writing out equivalent specs in `jest` (which may look rather similar to methodically checking the existence and values of certain properties on resulting objects), however as the application grows there could be additional business logic imbued in those transformations that could necessitate more extensive testing.

Additionally, with more time, there could be a greater degree of shared code across the web interface and the API. 