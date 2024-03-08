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
           stabbr = STUSPS) %>% 
    mutate(zoom = ifelse(stfp == "45", 8, 7),
           stabbr = tolower(stabbr))
  
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
           geoid = GEOID) %>% 
    mutate(cntyfp = paste0(stfp, cntyfp)) %>% 
    left_join(tigris::states(cb = T) %>% 
                filter(STATEFP %in% state_fips) %>% 
                select(STATEFP, STUSPS) %>%
                sf::st_drop_geometry() %>% 
                rename(stfp = STATEFP,
                       stabbr = STUSPS) %>% 
                mutate(stabbr = tolower(stabbr)))

  df <- cbind(df, getBbox(df))
  df <- getCentroid(df)
  
  df <- df %>% 
    arrange(stfp, name)

  exportJSON <- toJSON(df)
  write(exportJSON, file.path(pth, "countiesGeoJSON.json"))
  
  return(df)
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
                 tractfp = TRACT)

      } else {
        df <- df %>% 
          select(COUNTYFP, STATEFP, TRACTCE, NAME, GEOID, geometry, year) %>% 
          rename(cntyfp = COUNTYFP,
                 stfp = STATEFP,
                 name = NAME,
                 tractfp = TRACTCE,
                 geoid = GEOID)
      }

      df <- df %>% 
        mutate(geoid = paste0(stfp, cntyfp, tractfp),
               cntyfp = paste0(stfp, cntyfp),
               tractfp = geoid)

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
      mutate(year = year,
             cntyfp = paste0(stfp, cntyfp))

    df <- cbind(df, getBbox(df))
    df <- getCentroid(df)

    return(df)
  }) %>% dplyr::bind_rows()
  
  exportJSON <- toJSON(vd_geo)
  write(exportJSON, file.path(pth, "votingDistrictsGeoJSON.json"))
}

#' Process longitudinal data
getLongitudinal <- function(df) {

  df <- df %>% 
    select(-name) %>%
    rename(baseYear = year,
           baseYearPctBlack = percentage_race_black_african_american,
           baseYearTotalPop = total_population,
           baseYearPopDensity = population_density,
           baseYearPollingLocationsTotal = polling_locations_total) %>%
    mutate(baseYearPctBlack = round(baseYearPctBlack*100, 1),
           stfp = as.character(stringr::str_sub(cntyfp, 1, 2)),
           cntyfp = as.character(cntyfp)) %>%
    filter(!(stfp == "13" & baseYear %in% c(2012, 2014))) %>% # filter out years where georgia is missing data
    filter(!(stfp == "28" & baseYear %in% 2020)) ## filter out years where mississippi is missing data

  return(df)
}

#' Get Counties longitudinal
#' Writes out a json file at the year-cntyfp level
getCountiesLongitudinal <- function(df, pth) {
  
  df <- df %>% 
    rename(baseYear = baseyear,
           changeYear = changeyear,
           baseYearPctBlack = baseyearpctblack,
           baseYearTotalPop = baseyeartotalpop,
           baseYearPopDensity = baseyearpopdensity,
           baseYearPollingLocationsTotal = baseyearpollinglocstotal,
           lastGeYearTotalPop = lastgeyeartotalpop,
           lastGeYearPollingLocsTotal = lastgeyearpollinglocstotal,
           lastGeYearPopPerPoll = lastgeyearpopperpoll,
           baseYearPopPerPoll = baseyearpopperpoll,
           changeYearPopPerPoll = changeyearpopperpoll,
           changeNoPolls = changenopolls,
           noPollsAdded = nopollsadded,
           noPollsRemoved = nopollsremoved) %>%
    mutate(geoid = cntyfp,
           stfp = substr(cntyfp, 1,2),
           baseYearPopPerPoll = baseYearTotalPop/baseYearPollingLocationsTotal,
           lastGePopPerPoll = lastGeYearTotalPop/lastGeYearPollingLocsTotal,
           changeYearPopPerPoll = baseYearPopPerPoll - lastGeYearPopPerPoll,
           overallChange = noPollsAdded - noPollsRemoved)

  exportJSON <- toJSON(df)
  write(exportJSON, file.path(pth, "countiesLongitudinal.json"))
  
  return(df)
}

#' Get Tracts longitudinal
#' Writes out a json file at the year-tractfp level
getTractsLongitudinal <- function(df, pollLocs, state_fips, years, pth) {

  df <- getLongitudinal(df) %>% 
    mutate(tractfp = as.character(tractfp),
           geoid = tractfp)

  pollLocs <- pollLocs %>% 
    group_by(tractfp, baseyear, changetype) %>% 
    tally() %>% 
    tidyr::pivot_wider(names_from = "changetype", values_from = "n") %>% 
    rename(pollsRemoved = removed,
           pollsAdded = added,
           pollsNoChange = no_change,
           baseYear = baseyear) %>% 
    mutate(tractfp = as.character(tractfp))

  df <- df %>% 
    left_join(pollLocs) %>% 
    mutate(pollsRemoved = ifelse(is.na(pollsRemoved), 0, pollsRemoved),
           pollsAdded = ifelse(is.na(pollsAdded), 0, pollsAdded),
           pollsNoChange = ifelse(is.na(pollsNoChange), 0, pollsNoChange),
           overallChange = pollsAdded - pollsRemoved)
  
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
           status = changetype,
           X = x,
           Y = y,
           name = pollname) %>%
    mutate(cntyfp = as.character(cntyfp),
           stfp = as.character(stfp),
           tractfp = as.character(tractfp),
           status = case_when(status == "added" ~ "Added",
                              status == "no_change" ~ "No change",
                              status == "removed" ~ "Removed"))

  exportJSON <- toJSON(df)
  write(exportJSON, "../data/processed/pollsChangeStatus.json")

  return(df)
}

getPollSummary <- function(df) {
  
  df <- df %>% 
    select(changeyear, cntyfp, baseyear, nopollsadded, nopollsremoved, changenopolls) %>% 
    rename(changeYear = changeyear,
           baseYear = baseyear,
           changeNoPolls = changenopolls,
           noPollsAdded = nopollsadded,
           noPollsRemoved = nopollsremoved) %>% 
    mutate(cntyfp = as.character(cntyfp),
           geoid = cntyfp,
           overallChange = noPollsAdded - noPollsRemoved)

  return(df)
}
