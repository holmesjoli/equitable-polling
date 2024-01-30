library(tigris)
library(jsonlite)
library(dplyr)
library(magrittr)

stfp <- c("13", "45", "28", "55") #state fips codes
year <- c(2012, 2014, 2016, 2018, 2020, 2022)

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
    select(NAME, STATEFP, GEOID, STUSPS, geometry) %>% 
    rename(stfp = STATEFP,
           name = NAME,
           geoid = GEOID,
           abbr = STUSPS) %>% 
    mutate(zoom = ifelse(stfp == "45", 8, 7),
           abbr = tolower(abbr))
  
  df <- cbind(df, getBbox(df))
  df <- getCentroid(df)
  
  exportJSON <- toJSON(df)
  write(exportJSON, file.path(pth, "statesGeoJSON.json"))
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
  
  df <- df %>% 
    arrange(stfp, name)

  exportJSON <- toJSON(df)
  write(exportJSON, file.path(pth, "countiesGeoJSON.json"))
}

#' Get Census tracts
#' Writes out a json file at the census tract level
getTracts <- function(state_fips, years, pth) {
  
  statesdata <- lapply(state_fips, function(state) {

    yearsdata <- lapply(c(2010, 2020), function(year) {
      
      df <- tigris::tracts(state = state, year = year, cb = TRUE) %>% 
        mutate(year = year)
      
      if (year == 2010) {

        df <- df %>%
          select(COUNTY, STATE, TRACT, NAME, geometry, year) %>% 
          rename(cntyfp = COUNTY,
                 stfp = STATE,
                 name = NAME,
                 tractfp = TRACT) %>% 
          mutate(geoid = paste0(stfp, cntyfp, tractfp))

      } else {
        df <- df %>% 
          select(COUNTYFP, STATEFP, TRACTCE, NAME, GEOID, geometry, year) %>% 
          rename(cntyfp = COUNTYFP,
                 stfp = STATEFP,
                 name = NAME,
                 tractfp = TRACTCE,
                 geoid = GEOID)
      }

      df <- cbind(df, getBbox(df))
      df <- getCentroid(df)
      
      return(df)

    }) %>% bind_rows()
    
    return(yearsdata)
    
  }) %>% bind_rows()
  
  exportJSON <- toJSON(statesdata)
  write(exportJSON, file.path(pth, "tractsGeoJSON.json"))

  return(statesdata)
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
  write(exportJSON, file.path(pth, "votingDistrictsGeoJSON.json"))
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
           baseYear = year) %>%
    mutate(pctBlack = round(pctBlack*100, 1))

  return(df)
}

#' Get Counties longitudinal
#' Writes out a json file at the year-cntyfp level
getCountiesLongitudinal <- function(df, state_fips, years, pth) {

  df <- getLongitudinal(df, state_fips, years)
  exportJSON <- toJSON(df)
  write(exportJSON, file.path(pth, "countiesLongitudinal.json"))
  
  return(df)
}

#' Get Tracts longitudinal
#' Writes out a json file at the year-tractfp level
getTractsLongitudinal <- function(df, state_fips, years, pth) {

  df <- getLongitudinal(df, state_fips, years)
  exportJSON <- toJSON(df)
  write(exportJSON, file.path(pth, "tractsLongitudinal.json"))
  
  return(df)
}

#' Get Polling Locations
#' Writes out a json file at the voting poll level
getPollingLocations <- function(df) {
  df <- df %>% 
    distinct(pollid, location_name_clean, r3latitude, r3longitude, stfp) %>% 
    rename(name = location_name_clean, 
           pollId = pollid,
           Y = r3latitude,
           X = r3longitude)

  exportJSON <- toJSON(df)
  write(exportJSON, "../data/processed/pollsLocation.json")
  
  return(df)
}

#' Get poll changes status
#' Writes out a json file at the change year level
getPollsChangeStatus <- function(df) {

  df <- df %>%
    rename(pollId = pollid,
           baseYear = baseyear,
           changeYear = changeyear,
           status = changestatus,
           X = x,
           Y = y,
           name = pollname) %>%
    mutate(overall = ifelse(status == "no_change", "nochange", status),
           id = case_when(overall == "added" ~ "3",
                          overall == "nochange" ~ "0",
                          overall == "removed" ~ "-3"),
           status = case_when(overall == "added" ~ "Added",
                              overall == "nochange" ~ "No change",
                              overall == "removed" ~ "Removed"))

  exportJSON <- toJSON(df)
  write(exportJSON, "../data/processed/pollsChangeStatus.json")

  return(df)
}

getIndicatorsChangeStatus<- function(df, state_fips) {
  
  df <- df %>% 
    select(changeyear, cntyfp, stfp, baseyear, nopollsadded, nopollsremoved, changenopolls) %>% 
    rename(changeYear = changeyear,
           baseYear = baseyear,
           changeNoPolls = changenopolls,
           noPollsAdded = nopollsadded,
           noPollsRemoved = nopollsremoved) %>% 
    mutate(cntyfp = paste0(stfp, stringr::str_pad(cntyfp, width = '3', pad = '0', side= 'left')),
           overallChange = noPollsAdded - noPollsRemoved,
           # totalChangeNoPollsBin = case_when(changeNoPolls == 0 ~ "0",
           #                              changeNoPolls > 0 & changeNoPolls <= 5 ~ "Between 1 and 5",
           #                              changeNoPolls > 5 & changeNoPolls <= 15 ~ "Between 6 and 15",
           #                              changeNoPolls > 15 & changeNoPolls <= 30 ~ "Between 16 and 30",
           #                              changeNoPolls > 30 ~ "Greater than 30"),
           rSize = case_when(changeNoPolls == 0 ~ 1,
                             changeNoPolls > 0 & changeNoPolls <= 5 ~ 2,
                             changeNoPolls > 5 & changeNoPolls <= 15 ~ 5,
                             changeNoPolls > 15 & changeNoPolls <= 30 ~ 15,
                             changeNoPolls > 30 ~ 30),
           # netChangeNoPolls = case_when(noPollsAdded > 10 ~ "Added more than 10 polls",
           #                              noPollsAdded > 3 & noPollsAdded <= 10 ~ "Added 4 – 10 polls",
           #                              noPollsAdded > 0 & noPollsAdded <= 3~ "Added 1 – 3 polls",
           #                              changeNoPolls == 0 ~ "No change",
           #                              noPollsRemoved > 0 & noPollsRemoved <= 3 ~ "Removed 1 – 3 polls",
           #                              noPollsRemoved > 3 & noPollsRemoved <= 10 ~ "Removed 4 – 10 polls",
           #                              noPollsRemoved > 10 ~ "Removed more than 10 polls"
           #                              ),
           overall = case_when(overallChange > 0 ~ "added",
                               overallChange == 0 ~ "nochange",
                               overallChange < 0 ~ "removed"),
           id = case_when(overallChange > 10 ~ "3",
                          overallChange > 3 & overallChange <= 10 ~ "2",
                          overallChange > 0 & overallChange <= 3~ "1",
                          overallChange == 0 ~ "0",
                          overallChange < 0 & overallChange >= -3 ~ "-1",
                          overallChange < -3 & overallChange >= -10 ~ "-2",
                          overallChange < -10 ~ "-3"))

  cnty <- tigris::counties(cb = T) %>% 
    filter(STATEFP %in% state_fips) %>% 
    mutate(cntyfp = paste0(STATEFP, COUNTYFP)) %>% 
    select(cntyfp, geometry, NAME) %>% 
    rename(name = NAME)
  
  cnty <- getCentroid(cnty) %>% 
    sf::st_drop_geometry()
  
  df <- df %>% 
    left_join(cnty)

  exportJSON <- toJSON(df)
  write(exportJSON, "../data/processed/indicatorsChangeStatus.json")

  return(df)
}
