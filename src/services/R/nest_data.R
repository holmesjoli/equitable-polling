library(tigris)
library(jsonlite)
library(dplyr)

stfp <- c("13", "45", "28", "55")

counties <- lapply(stfp, function(state) {
  
  stname <- tigris::states() %>% 
    filter(STATEFP == state) %>% 
    pull(NAME)
  
  df <- tigris::counties(state = state) %>% 
    select(COUNTYFP, GEOID, NAME) %>% 
    rename(cntyfp = COUNTYFP,
           cntygeoid = GEOID, 
           cntyname = NAME) %>% 
    sf::st_drop_geometry() %>% 
    arrange(cntyname)
  
  st <- list(stname, state, df)
  names(st) <- c('stname', 'stfp', 'counties')
  
  return(st)
})

exportJSON <- toJSON(counties)
write(exportJSON, "../data/geoData.json")


states_geo <- tigris::states(cb = T) %>% 
  filter(STATEFP %in% stfp) %>% 
  select(NAME, STATEFP, geometry) %>% 
  rename(stfp = STATEFP,
         stname = NAME)

states_geo <- states_geo %>% 
  bind_cols(states_geo %>% 
                 sf::st_centroid() %>% 
                 sf::st_coordinates())

exportJSON <- toJSON(states_geo)
write(exportJSON, "../data/stateGeoJSON.json")

us_geo <- tigris::states(cb = T) %>%
  filter(!(STATEFP %in% stfp)) %>% 
  select(NAME, STATEFP, geometry) %>% 
  rename(stfp = STATEFP,
         stname = NAME)

exportJSON <- toJSON(us_geo)
write(exportJSON, "../data/usGeoJSON.json")

