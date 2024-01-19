library(tigris)
library(jsonlite)
library(dplyr)
library(magrittr)

#' Get bbox
#' Computes the bbox of the geometry that exists in the dataframe
#' Returns dataframe
getBbox <- function(df) {

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

  return(bbox)
}

#' Get centroid
#' Computes the centroid of the geometry that exists in the dataframe
#' Returns dataframe
getCentroid <- function(df) {
  df <- df %>% 
    bind_cols(df %>% 
                sf::st_centroid() %>% 
                sf::st_coordinates()) 

  return(df)
}

#' Get states
#' Writes out a json file at the state level
getStates <- function(state_fips, pth) {
  df <- tigris::states(cb = T) %>% 
    filter(STATEFP %in% state_fips) %>% 
    select(NAME, STATEFP, GEOID, geometry) %>% 
    rename(stfp = STATEFP,
           name = NAME,
           geoid = GEOID) %>% 
    mutate(zoom = ifelse(stfp == "45", 8, 7))
  
  df <- cbind(df, getBbox(df))
  df <- getCentroid(df)
  
  exportJSON <- toJSON(df)
  write(exportJSON, file.path(pth, "stateGeoJSON.json"))
}

#' Get Counties
#' Writes out a json file at the county
getCounties <- function(state_fips, pth) {

  df <- tigris::counties(cb = T) %>% 
    filter(STATEFP %in% state_fips) %>% 
    select(STATEFP, NAME, COUNTYFP, GEOID, geometry) %>% 
    rename(stfp = STATEFP,
           cntyfp = COUNTYFP,
           name = NAME,
           geoid = GEOID)
  
  df <- cbind(df, getBbox(df))
  df <- getCentroid(df)

  exportJSON <- toJSON(df)
  write(exportJSON, file.path(pth, "countyGeoJSON.json"))
}

#' Get Census tracts
#' Writes out a json file at the census tract level
getTracts <- function(state_fips, pth) {

  df <- tigris::tracts(cb = T) %>% 
    filter(STATEFP %in% state_fips) %>% 
    select(COUNTYFP, STATEFP, TRACTCE, NAME, GEOID, geometry) %>% 
    rename(cntyfp = COUNTYFP,
           stfp = STATEFP,
           name = NAME,
           tractfp = TRACTCE,
           geoid = GEOID)

  df <- cbind(df, getBbox(df))
  df <- getCentroid(df)

  exportJSON <- toJSON(df)
  write(exportJSON, file.path(pth, "tractGeoJSON.json"))
}

#' Get Voting Districts
#' Writes out a json file at the voting district level
getVd <- function(state_fips, pth, year = 2020) {
  
  vd_geo <- lapply(state_fips, function(st) {
    
    df <- tigris::voting_districts(year = year, state=st, cb=T) %>% 
      rename(stfp = STATEFP20,
             cntyfp = COUNTYFP20,
             vtdst = VTDST20,
             geoid = GEOID20,
             name = NAME20) %>% 
      select(stfp, cntyfp, vtdst, geoid, name, geometry) %>% 
      mutate(year = year)
    
    df <- cbind(df, getBbox(df))
    df <- getCentroid(df)
    
    return(df)
  }) %>% dplyr::bind_rows()
  
  exportJSON <- toJSON(vd_geo)
  write(exportJSON, file.path(pth, "votingDistrictGeoJSON.json"))
}

#' Process longitudinal data
getLongitudinal <- function(df, state_fips, years) {

  df <- df %>% 
    mutate(stfp = stringr::str_sub(fips_code, 1, 2),
           cntyfp = stringr::str_sub(fips_code, 1, 5)) %>% 
    filter(stfp %in% state_fips) %>%
    filter(year %in% years) %>% 
    select(fips_code, percentage_race_black_african_american, year, stfp, cntyfp) %>% 
    rename(geoid = fips_code,
           pctBlack = percentage_race_black_african_american,
           baseYear = year)

  return(df)
}

getCountiesLongitudinal <- function(df, state_fips, years, pth) {

  df <- getLongitudinal(df, state_fips, years)
  exportJSON <- toJSON(df)
  write(exportJSON, file.path(pth, "countyLongitudinal.json"))
}

getTractsLongitudinal <- function(df, state_fips, years, pth) {

  df <- getLongitudinal(df, state_fips, years)
  exportJSON <- toJSON(df)
  write(exportJSON, file.path(pth, "tractLongitudinal.json"))
}
