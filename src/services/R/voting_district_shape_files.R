library(tigris)
library(magrittr)
library(dplyr)
library(glue)

sf_use_s2(FALSE)

years <- c(16, 18, 20)

state <- c("wi", "ga", "ms", "sc")

county_geo <- tigris::counties(cb = T)

crs <- sf::st_crs(county_geo)

vds <- lapply(years, function(year) {

  states <- lapply(state, function(st) {

    print(st)
    df <- sf::read_sf(glue::glue('../data/raw/{toupper(st)}/{st}_vest_{year}/{st}_vest_{year}.shp', year = year, st = st)) 

    if (st == "ga") {
      df <- df %>%
        rename(cntyfp = FIPS2,
               name = PRECINCT_N)
    } else if(st == "wi") {
      if (year == 16) {
        df <- df %>%
          rename(cntyfp = CNTY_FIPS) %>% 
          mutate(name = paste(NAME, STR_WARDS),
                 cntyfp = stringr::str_sub(cntyfp, 3, 5))
      } else if (year == 18) {
        df <- df %>%
          rename(cntyfp = CNTY_FIPS,
                 name = LABEL) %>% 
          mutate(cntyfp = stringr::str_sub(cntyfp, 3, 5))
      } else if (year == 20) {
        df <- df %>%
          rename(cntyfp = CNTY_FIPS,
                 name = LABEL) %>% 
          mutate(cntyfp = stringr::str_sub(cntyfp, 3, 5))
      }

    } else if(st == "ms") {
      df <- df %>% 
        rename(cntyfp = paste0('COUNTYFP', year),
               name = paste0('NAME', year))
    } else if (st == "sc") {

      if (year == 20) {
        df <- df %>%
          rename(cntyfp = COUNTY,
                 name = CODE_NAME)
      } else {
        df <- df %>%
          rename(cntyfp = COUNTYFP,
                 name = NAME)
      }
    }

    df <- df %>%
      mutate(year = as.numeric(paste0('20', year)),
             stfp = case_when(st == "ga" ~ "13",
                              st == "wi" ~ "55",
                              st == "ms" ~ "28",
                              st == "sc" ~ "45")) %>% 
      select(stfp, cntyfp, name, year, geometry)

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

    df <- df %>% 
      bind_cols(df %>% 
                  sf::st_centroid() %>% 
                  sf::st_coordinates()) %>% 
      st_transform(crs)
    
    sf::st_crs(df) <- crs

    df <- df %>% 
      rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE)

    return(df)
  }) %>% bind_rows()
  
  # exportJSON <- toJSON(vds)
  # write(exportJSON, glue::glue("../data/processed/votingDistrictGeoJSON_{year}.json", year = year))

  return(states)
  
}) %>% bind_rows()

exportJSON <- toJSON(vds)
write(exportJSON, glue::glue("../data/processed/votingDistrictGeoJSON.json", year = year))
