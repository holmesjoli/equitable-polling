# Equitable Polling Locations

This respository contains code that produces the equitable polling locations interactive data visualization. The repository is structured as follow:

public/
src/

## To update data

1. To add a new state's geographies update line 6 in `/src/services/R/nest_data.R` to include the new state's fips code. For example, if you want to add Texas, you would change line 6 to `stfp <- c("13", "45", "28", "55", "48")`. 
2. Run `nest_data.R` to update `src/data/countyGeoJson.json` and `scr/data/stateGeoJson.json`.

## To run application locally

* You must have node.js installed on your machine. If you do not have node.js installed, you can download it [here](https://nodejs.org/en/download/).

1. `npm install`
2. `npm start`

## To deploy application
