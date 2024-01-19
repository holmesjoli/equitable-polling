source('./R/nest_data.R')

# State fips codes, adjust this list and rerun to add additional states
stfp <- c("13", "45", "28", "55")

# Write out all the geo data
getStates(stfp)
getCounties(stfp)
getTracts(stfp)
getVd(stfp)
