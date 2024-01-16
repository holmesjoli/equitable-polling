library(tigris)
library(jsonlite)
library(dplyr)
library(magrittr)

polling_loc <- readr::read_csv("../data/raw/polling_location_initial_removed_added_2012-2022_final.csv") %>% 
  select(location_name_clean, r3latitude, r3longitude, change_year, change_type) %>% 
  rename(name = location_name_clean,
         X = r3longitude,
         Y = r3latitude,
         overall = change_type) %>% 
  mutate(change_type = ifelse(change_type == "NULL", "nochange", change_type),
         id = case_when(overall == "added" ~ "3",
                        overall == "nochange" ~ "0",
                        overall == "removed" ~ "-3")) 

exportJSON <- toJSON(polling_loc)
write(exportJSON, "../data/processed/polling_loc.json")

stfp <- c("13", "45", "28", "55") #state fips codes
year <- c(2012, 2014, 2016, 2018, 2020, 2022)

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
    
    bbox <- lapply(1:nrow(df), function(x) {
      bb <- df %>% 
        slice(x) %>% 
        sf::st_bbox()
      
      return(data.frame(xmin = bb[1],
                       xmax = bb[3],
                       ymin = bb[2],
                       ymax = bb[4]))
    }) %>% bind_rows()
    
    row.names(bbox) <- NULL
    
    df <- cbind(df, bbox)
    
    df <- df %>% 
      bind_cols(df %>% 
                  sf::st_centroid() %>% 
                  sf::st_coordinates()) 

    return(df)
}) %>% dplyr::bind_rows()

exportJSON <- toJSON(vd_geo)
write(exportJSON, "../data/processed/votingDistrictGeoJSON.json")
