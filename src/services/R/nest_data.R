library(tigris)
library(jsonlite)
library(dplyr)
library(magrittr)

stfp <- c("13", "45", "28", "55") #state fips codes
year <- c(2012, 2014, 2016, 2018, 2020, 2022)

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
write(exportJSON, "../data/processed/stateGeoJSON.json")

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
write(exportJSON, "../data/processed/countyGeoJSON.json")

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


# lapply(stfp, function(st) {
#   
#   dfs <- lapply(year, function(yr) {
#     
#     df <- tigris::voting_districts(cb = T, state = st, year = yr) %>% 
#       filter(STATEFP20 %in% stfp) %>% 
#       select(STATEFP20, COUNTYFP20, VTDST20, geometry) %>% 
#       rename(stfp = STATEFP20,
#              cntyfp = COUNTYFP20,
#              vdfp = VTDST20
#       )
#   })
#   
#   return(df)
# })

vd_geo <- lapply(stfp, function(st) {
  
    df <- tigris::voting_districts(year = 2020, state=st, cb=T) %>% 
      rename(stfp = STATEFP20,
             cntyfp = COUNTYFP20,
             vtdst = VTDST20,
             geoid = GEOID20,
             name = NAME20) %>% 
      select(stfp, cntyfp, vtdst, geoid, name, geometry) %>% 
      mutate(year = 2020)

    return(df)
}) %>% dplyr::bind_rows()

exportJSON <- toJSON(df)
write(exportJSON, "../data/processed/votingDistrictGeoJSON.json")

