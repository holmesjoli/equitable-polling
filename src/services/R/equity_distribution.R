library(ggplot2)

cnty_equity <- readr::read_csv("../data/raw/sc_county_level_polling_rv_info_12192023.csv")

tract_equity <- readr::read_csv("../data/raw/sc_census_tract_level_polling_info_12192023.csv")


ggplot(data = cnty_equity) +
  geom_histogram(aes(x=percentage_race_black_african_american), bins = 40)

quantile(cnty_equity$percentage_race_black_african_american, probs = seq(0, 1, 0.25))

quantile(tract_equity$percentage_race_black_african_american, probs = seq(0, 1, 0.25))


round(cnty_equity$registered_voters_total/cnty_equity$polling_locations_total)

x = cnty_equity %>% filter(year == c(2012, 2014)) %>% 
  select(county, year, polling_locations_total) %>% 
  mutate(year = paste0("x", year)) %>% 
  tidyr::pivot_wider(names_from = "year", values_from = "polling_locations_total")

x12 <- cnty_equity %>%
  filter(year == 2012) %>% 
  select(county, polling_locations_total, registered_voters_total) %>% 
  rename(polling_locations_total12 = polling_locations_total,
         registered_voters_total12 = registered_voters_total) %>% 
  mutate(rv_per_poll12 = round(registered_voters_total12/polling_locations_total12))

x14 <- cnty_equity %>% 
  filter(year == 2014) %>% 
  select(county, polling_locations_total, registered_voters_total) %>% 
  rename(polling_locations_total14 = polling_locations_total,
         registered_voters_total14 = registered_voters_total) %>% 
  mutate(rv_per_poll14 = round(registered_voters_total14/polling_locations_total14))

x <- x12 %>% 
  left_join(x14) %>% 
  mutate(diff = rv_per_poll12 - rv_per_poll14)
