source('./R/nest_data.R')

pth <- "../data/processed"

# Georgia, South Carolina, Mississippi, Wisconsin
state_fips <- c("13", "45", "28", "55") # State fips codes, adjust this list and rerun to add additional states
years <- c(2012, 2014, 2016, 2018, 2020, 2022)

# Write out all the geo data
getStates(state_fips, pth)
getCounties(state_fips, pth)
getTracts(state_fips, years, pth)
getVd(state_fips, pth)
getCountiesLongitudinal(readr::read_csv("../data/raw/county_year_summary_RI_World_01032024_fips.csv"), state_fips, years, pth)
getTractsLongitudinal(readr::read_csv("../data/raw/census_tract_year_summary_RI_World_01032024_fips.csv"), state_fips, years, pth)
getPollsChangeStatus(readr::read_csv("../data/raw/sc_ga_ms_wi_polling_location_changes.csv"))
