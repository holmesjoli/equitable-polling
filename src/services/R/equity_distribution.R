library(ggplot2)

cnty_equity <- readr::read_csv("../data/raw/sc_county_level_polling_rv_info_12192023.csv")

tract_equity <- readr::read_csv("../data/raw/sc_census_tract_level_polling_info_12192023.csv")


ggplot(data = cnty_equity) +
  geom_histogram(aes(x=percentage_race_black_african_american), bins = 40)

quantile(cnty_equity$percentage_race_black_african_american, probs = seq(0, 1, 0.25))

quantile(tract_equity$percentage_race_black_african_american, probs = seq(0, 1, 0.25))
