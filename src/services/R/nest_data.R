library(tigris)
library(jsonlite)
library(dplyr)
library(magrittr)

stfp <- c("13", "45", "28", "55")

states_geo <- tigris::states(cb = T) %>% 
  filter(STATEFP %in% stfp) %>% 
  select(NAME, STATEFP, geometry) %>% 
  rename(stfp = STATEFP,
         name = NAME) %>% 
  mutate(zoom = ifelse(stfp == "45", 8, 7))

states_geo <- states_geo %>% 
  bind_cols(states_geo %>% 
                 sf::st_centroid() %>% 
                 sf::st_coordinates()) 
# %>% 
#   rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE)

exportJSON <- toJSON(states_geo)
write(exportJSON, "../data/stateGeoJSON.json")

county_geo <- tigris::counties(cb = T) %>% 
  filter(STATEFP %in% stfp) %>% 
  select(STATEFP, NAME, COUNTYFP, GEOID, geometry) %>% 
  rename(stfp = STATEFP,
         cntyfp = COUNTYFP,
         name = NAME,
         geoid = GEOID)

county_geo <- county_geo %>% 
  bind_cols(county_geo %>% 
              sf::st_centroid() %>% 
              sf::st_coordinates()) %>% 
  arrange(stfp, name) 

# %>% 
#   rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE)

exportJSON <- toJSON(county_geo)
write(exportJSON, "../data/countyGeoJSON.json")

tract_geo <- tigris::tracts(cb = T) %>% 
  filter(STATEFP %in% stfp) %>% 
  select(COUNTYFP, STATEFP, TRACTCE, NAME, GEOID, geometry) %>% 
  rename(cntyfp = COUNTYFP,
         stfp = STATEFP,
         name = NAME,
         tractfp = TRACTCE,
         geoid = GEOID)

tract_geo <- tract_geo %>% 
  bind_cols(tract_geo %>% 
              sf::st_centroid() %>% 
              sf::st_coordinates()) %>%
  rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE)

exportJSON <- toJSON(tract_geo)
write(exportJSON, "../data/tractGeoJSON.json")

