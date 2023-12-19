library(tigris)
library(jsonlite)
library(dplyr)

stfp <- c("013", "045", "028", "055")

counties <- lapply(stfp, function(state) {
  
  stname <- tigris::states() %>% 
    mutate(STATEFP = stringr::str_pad(STATEFP, width = 3, side = "left", pad="0")) %>% 
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
  filter(STATEFP %in% c("13", "45", "28", "55")) %>% 
  select(NAME, STATEFP, geometry) %>% 
  rename(stfp = STATEFP,
         name = NAME)

states_geo <- states_geo %>% 
  bind_cols(states_geo %>% 
                 sf::st_centroid() %>% 
                 select(geometry) %>% 
                 rename(centroid = geometry))

exportJSON <- toJSON(states_geo)
write(exportJSON, "../data/states.json")


# sf::write_sf("../data/states.geojson")
