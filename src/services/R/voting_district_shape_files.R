library(tigris)
library(magrittr)
library(dplyr)
library(glue)

years <- c(16, 18, 20)

lapply(years, function(year) {

  df <- sf::read_sf(glue::glue('../data/raw/GA/ga_vest_{year}/ga_vest_{year}.shp', year = year)) %>% 
    # select(FIPS2, geometry) %>% 
    rename(cntyfp = FIPS2) %>% 
    mutate(stfp = '13',
           geoid = paste0(stfp, cntyfp),
           year = paste0('20', year))

  bbox <- lapply(1:nrow(df), function(x) {
    bb <- df %>% 
      slice(x) %>% 
      sf::st_bbox()

    df <- data.frame(xmin = bb[1],
                     xmax = bb[3],
                     ymin = bb[2],
                     ymax = bb[4])
    return(df)
  }) %>% bind_rows()

  row.names(bbox) <- NULL

  df <- cbind(df, bbox)

  # df <- df %>% 
  #   bind_cols(df %>% 
  #               sf::st_centroid() %>% 
  #               sf::st_coordinates())

})
