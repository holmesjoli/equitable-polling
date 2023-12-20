library(tigris)
library(jsonlite)
library(dplyr)

stfp <- c("13", "45", "28", "55")

states_geo <- tigris::states(cb = T) %>% 
  filter(STATEFP %in% stfp) %>% 
  select(NAME, STATEFP, geometry) %>% 
  rename(stfp = STATEFP,
         stname = NAME) %>% 
  mutate(zoom = ifelse(stfp == "45", 8, 7))

states_geo <- states_geo %>% 
  bind_cols(states_geo %>% 
                 sf::st_centroid() %>% 
                 sf::st_coordinates())

exportJSON <- toJSON(states_geo)
write(exportJSON, "../data/stateGeoJSON.json")

county_geo <- tigris::counties(cb = T) %>% 
  filter(STATEFP %in% stfp) %>% 
  select(STATEFP, NAME, COUNTYFP, GEOID, geometry) %>% 
  rename(stfp = STATEFP,
         cntyfp = COUNTYFP,
         cntyname = NAME,
         cntygeoid = GEOID)

county_geo <- county_geo %>% 
  bind_cols(county_geo %>% 
              sf::st_centroid() %>% 
              sf::st_coordinates()) %>% 
  arrange(stfp, cntyname)

exportJSON <- toJSON(county_geo)
write(exportJSON, "../data/countyGeoJSON.json")

