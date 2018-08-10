# ThisTrip

An in-the-moment reference for MetroTransit bus and rail services. 

## Getting Started

Install packages with `yarn`, and start the server with `yarn start`.

## Technologies and Tools Used

The project is bundled with `parcel`, and makes use of `jest` for testing, and `flow` for type checking. I did not use generators or boilerplate projects to begin this portion of the project, as I wanted to keep the needs here relatively minimal.

The APIs I used are described on [MetroTransit's API documentation site](http://svc.metrotransit.org/). For certain situations, it was necessary to pre-load or store certain data that MetroTransit does not provide through their API endpoint (instead, this data originates from [a ZIP of CSV files](https://gisdata.mn.gov/dataset/us-mn-state-metc-trans-transit-schedule-google-fd) that is generated weekly). A copy of the data used can be found at `src/data/*.csv`.