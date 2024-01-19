library(tigris)
library(magrittr)
library(dplyr)
library(glue)

lapply(c("LA", "AL", "FL"), function(state) {
    
  df <- lapply(seq(2012, 2022, 2), function(year) {
    
    df <- tigris::voting_districts(year = year, state=state, cb = T) %>% 
      mutate(year = year,
             state = state)
    
    return(df)
  
  }) %>% bind_rows()
  
 df %>% 
   sf::write_sf(glue::glue("./data/voting_districts/tigris_voting_districts_{state}_2012-2022.geojson", state=state))
 
 # df <- df %>% 
 #   rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE) 
 # 
 # %>% 
 #   sf::write_sf(glue::glue("./data/voting_districts_simplified/tigris_voting_districts_{state}_2012-2022.geojson", state=state))
  
})
  
# df %>% 
#   sf::write_sf("./data/tigris_voting_districts_2012-2020.geojson")
# 
# df %>% 
#   rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE) %>% 
#   sf::write_sf("./data/tigris_voting_districts_simplified_2012-2020.geojson")
