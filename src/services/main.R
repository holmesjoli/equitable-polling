source('./R/nest_data.R')

pth <- "../data/processed"

# State fips codes, adjust this list and rerun to add additional states
state_fips <- c("13", "45", "28", "55")
years <- c(2012, 2014, 2016, 2018, 2020, 2022)

# Write out all the geo data
getStates(state_fips, pth)
getCounties(state_fips, pth)
getTracts(state_fips, pth)
getVd(state_fips, pth)
getCountiesLongitudinal(readr::read_csv("../data/raw/county_year_summary_RI_World_01032024_fips.csv"), state_fips, years, pth)
getTractsLongitudinal(readr::read_csv("../data/raw/census_tract_year_summary_RI_World_01032024_fips.csv"), state_fips, years, pth)
locs <- getPollingLocations(readr::read_csv("../data/raw/wi_polling_location_name_change.csv") %>% 
                     mutate(stfp = '55') %>% 
                     bind_rows(readr::read_csv("../data/raw/ms_polling_location_name_change.csv") %>% 
                                 mutate(stfp = '28')) %>% 
                     bind_rows(readr::read_csv("../data/raw/ga_polling_location_name_change.csv") %>% 
                                 mutate(stfp = '13')))

df <- getPollsChangeStatus(readr::read_csv("../data/raw/wi_polling_location_name_change.csv") %>% 
                      mutate(stfp = '55') %>% 
                      bind_rows(readr::read_csv("../data/raw/ms_polling_location_name_change.csv") %>% 
                                  mutate(stfp = '28')) %>% 
                      bind_rows(readr::read_csv("../data/raw/ga_polling_location_name_change.csv") %>% 
                                  mutate(stfp = '13')) %>% 
                      bind_rows(readr::read_csv("../data/raw/sc_polling_location_name_change.csv") %>% 
                                  mutate(stfp = '45')))
