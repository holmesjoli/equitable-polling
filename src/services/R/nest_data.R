library(tigris)
library(jsonlite)
library(dplyr)
library(magrittr)

stfp <- c("13", "45", "28", "55") #state fips codes

states_geo <- tigris::states(cb = T) %>% 
  filter(STATEFP %in% stfp) %>% 
  select(NAME, STATEFP, GEOID, geometry) %>% 
  rename(stfp = STATEFP,
         name = NAME,
         geoid = GEOID) %>% 
  mutate(zoom = ifelse(stfp == "45", 8, 7))

states_geo <- states_geo %>% 
  bind_cols(states_geo %>% 
                 sf::st_centroid() %>% 
                 sf::st_coordinates()) 
# %>% 
#   rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE)

exportJSON <- toJSON(states_geo)
write(exportJSON, "../data/processed/stateGeoJSON.json")

county_geo <- tigris::counties(cb = T) %>% 
  filter(STATEFP %in% stfp) %>% 
  select(STATEFP, NAME, COUNTYFP, GEOID, geometry) %>% 
  rename(stfp = STATEFP,
         cntyfp = COUNTYFP,
         name = NAME,
         geoid = GEOID)

bbox <- lapply(1:nrow(county_geo), function(x) {
  bb <- county_geo %>% 
    slice(x) %>% 
    sf::st_bbox()
  
  df <- data.frame(xmin = bb[1],
                   xmax = bb[3],
                   ymin = bb[2],
                   ymax = bb[4])
  return(df)
}) %>% bind_rows()

row.names(bbox) <- NULL

county_geo <- cbind(county_geo, bbox)

county_geo <- county_geo %>% 
  bind_cols(county_geo %>% 
              sf::st_centroid() %>% 
              sf::st_coordinates()) %>% 
  arrange(stfp, name) 

# %>% 
#   rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE)

exportJSON <- toJSON(county_geo)
write(exportJSON, "../data/processed/countyGeoJSON.json")

tract_geo <- tigris::tracts(cb = T) %>% 
  filter(STATEFP %in% stfp) %>% 
  select(COUNTYFP, STATEFP, TRACTCE, NAME, GEOID, geometry) %>% 
  rename(cntyfp = COUNTYFP,
         stfp = STATEFP,
         name = NAME,
         tractfp = TRACTCE,
         geoid = GEOID)

bbox <- lapply(1:nrow(tract_geo), function(x) {
  bb <- tract_geo %>% 
    slice(x) %>% 
    sf::st_bbox()
  
  df <- data.frame(xmin = bb[1],
                   xmax = bb[3],
                   ymin = bb[2],
                   ymax = bb[4])
  return(df)
}) %>% bind_rows()

row.names(bbox) <- NULL

tract_geo <- cbind(tract_geo, bbox)

tract_geo <- tract_geo %>% 
  bind_cols(tract_geo %>% 
              sf::st_centroid() %>% 
              sf::st_coordinates()) 
# %>%
#   rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE)

exportJSON <- toJSON(tract_geo)
write(exportJSON, "../data/processed/tractGeoJSON.json")

adj <- readr::read_delim("../data/raw/county_adjacency.txt", delim = "|") %>% 
  rename(geoid = `County GEOID`,
         neighborGeoid = `Neighbor GEOID`) %>%
  select(geoid, neighborGeoid) %>% 
  filter(geoid %in% (county_geo %>% pull(geoid)))

exportJSON <- toJSON(adj)
write(exportJSON, "../data/processed/countyAdjacency.json")

