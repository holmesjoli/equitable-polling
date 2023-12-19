library(sf)
library(ggplot2)
library(dplyr)
library(tigris)
library(osmdata)
library(tidycensus)
library(sf)
library(spikemap)
library(cartography)
library(ggdist)
library(maps)

set.seed(1234)

sc_precinct_2020 <- sf::read_sf("./data/sc_vest_20/sc_vest_20.shp")
sc_voting_district_2020 <- tigris::voting_districts(year = 2020, state="SC")
sc_blockgroup_2020 <- tigris::block_groups(year = 2020, state="SC")
sc_tract_2020 <- tigris::tracts(year = 2020, state="SC")
sc_county_2020 <- tigris::counties(year = 2020, state="SC") %>% 
  mutate(county_name = paste0(NAMELSAD, ", South Carolina")) %>% 
  left_join(read.csv("../data/sc_county_level_polling_rv_info.csv", na.strings = "NULL")) 
sc_blocks_2020 <- tigris::blocks(year = 2020, state = "SC")

nc_county_2020 <- tigris::counties(year = 2020, state="NC")

centroids <- sc_county_2020 %>%  
  sf::st_centroid() %>% 
  mutate(county_name = paste0(NAMELSAD, ", South Carolina")) %>% 
  select(GEOID, geometry, county_name) %>% 
  sf::write_sf("../data/sc_county_centroids.geojson")

sc_county_2020 %>% 
  mutate(county_name = paste0(NAMELSAD, ", South Carolina")) %>% 
  select(STATEFP, COUNTYFP, GEOID, NAME, county_name, geometry) %>% 
  sf::write_sf("../data/sc_county.geojson")

sc_county_change <- read.csv("../data/sc_county_level_polling_rv_info.csv", na.strings = "NULL") %>%  
  mutate(changeYear = case_when(year == 2014 ~ "2012-2014",
                                year == 2016 ~ "2014-2016",
                                year == 2018 ~ "2016-2018",
                                year == 2020 ~ "2018-2020",
                                year == 2022 ~ "2020-2022"),
         changeNoPoll = polling_locations_added_since_last_general-polling_locations_removed_since_last_general,
         noRVPerPoll = changeNoPoll/registered_voters_total,
         pctBlackBin = case_when(percentage_race_black_african_american < .15 ~ "<15%",
                                 percentage_race_black_african_american >= .15 & percentage_race_black_african_american < .25 ~ "15 - 25%",
                                 percentage_race_black_african_american >= .25 & percentage_race_black_african_american < .50 ~ "25 - 50%",
                                 percentage_race_black_african_american >= .5 & percentage_race_black_african_american < .75 ~ "50 - 75%",
                                 percentage_race_black_african_american >= .75~ "75%"),
         changePoll = case_when(changeNoPoll > 0 ~ ">1",
                                changeNoPoll == 0 ~ "0",
                                changeNoPoll < 0 ~ "<-1"),
         changeNoPollBin = case_when(changeNoPoll >= 11 ~ ">10",
                                     changeNoPoll >= 3 & changeNoPoll < 10 ~ "4 - 10",
                                     changeNoPoll >= 1 & changeNoPoll < 3 ~ "1 - 3",
                                     changeNoPoll== 0 ~ "0",
                                     changeNoPoll <= -1 & changeNoPoll > -3 ~ "-1 - -3",
                                     changeNoPoll <= -3 & changeNoPoll > -10 ~ "-4 - -10",
                                     changeNoPoll <= -11 ~ "<-10"
                                     ),
         changeNoPollBin = ordered(changeNoPollBin, levels = c(">10", "4 - 10", "1 - 3", "0", "-1 - -3", "-4 - -10", "<-10")),
         totalChanges = polling_locations_added_since_last_general + polling_locations_removed_since_last_general) %>% 
  filter(year != 2012) %>% 
  left_join(sc_county_2020 %>% 
              mutate(county_name = paste0(NAMELSAD, ", South Carolina")) %>% 
              select(county_name, GEOID) %>% st_drop_geometry()) %>% 
  readr::write_csv("../data/sc_county_change.csv")

iso <- readr::read_csv("../data/test_ms_15min_drive_time_isochrones_geojson.csv") %>% 
  sf::geometry

ms_precinct_2020 <- sf::read_sf("./data/ms_vest_20/ms_vest_20.shp")
ms_voting_district_2020 <- tigris::voting_districts(year = 2020, state="MS")
ms_blockgroup_2020 <- tigris::block_groups(year = 2020, state="MS")
ms_tract_2020 <- tigris::tracts(year = 2020, state="MS")
ms_county_2020 <- tigris::counties(year = 2020, state="MS")

ga_precinct_2020 <- sf::read_sf("./data/ms_vest_20/ms_vest_20.shp")
ga_voting_district_2020 <- tigris::voting_districts(year = 2020, state="GA")
ga_blockgroup_2020 <- tigris::block_groups(year = 2020, state="GA")
ga_tract_2020 <- tigris::tracts(year = 2020, state="GA")
ga_county_2020 <- tigris::counties(year = 2020, state="GA")

cities <- sf::read_sf("./data/USA_Major_Cities/USA_Major_Cities.shp") 
cities <- cities %>% 
  bind_cols(sf::st_coordinates(cities$geometry) %>% as.data.frame())

polling_loc <- readr::read_csv("./data/polling_location_initial_removed_added_2012-2022_final.csv") %>% 
    st_as_sf(coords = c("r3longitude", "r3latitude"), crs = 'NAD83')

charleston_demo <- sc_tract_2020 %>% 
  filter(COUNTYFP == "019") %>% 
  select(geometry, NAME) %>% 
  left_join(
  readr::read_csv("./data/Charleston_Census_Tract_ACSDP5Y2021.csv") %>% 
    slice(35, 39, 40) %>% 
    select(`Label (Grouping)`, contains("Estimate")) %>% 
    mutate(`Census Tract 32, Charleston County, South Carolina!!Estimate` = as.numeric(gsub(",", "", `Census Tract 32, Charleston County, South Carolina!!Estimate`)),
           `Census Tract 9901, Charleston County, South Carolina!!Estimate` = as.numeric(`Census Tract 9901, Charleston County, South Carolina!!Estimate`)) %>% 
    tidyr::pivot_longer(names_to = "NAME", values_to = "values", -`Label (Grouping)`) %>% 
    tidyr::pivot_wider(names_from = "Label (Grouping)", values_from = "values") %>% 
    mutate(NAME = gsub("Census Tract ", "", NAME),
           NAME = gsub(", Charleston County, South Carolina!!Estimate", "", NAME),
           pctBlack = (`            Black or African American`/`    Total population`)*100,
           pctBlackBin = case_when(pctBlack < .15 ~ "<15%",
                                   pctBlack >= .15 & pctBlack < .25 ~ "15 - 25%",
                                   pctBlack >= .25 & pctBlack < .50 ~ "25 - 50%",
                                   pctBlack >= .5 & pctBlack < .75 ~ "50 - 75%",
                                   pctBlack >= .75 ~ ">75%"),
           pctBlackBin = ordered(pctBlackBin, labels = c("<15%", "15 - 25%", "25 - 50%", "50 - 75%", ">75%"),
                                 levels = c("<15%", "15 - 25%", "25 - 50%", "50 - 75%", ">75%")))
  )


fill <- "#F1F1F1"
secondary_color <- "#B7B7B7"
primary_color <- "#666666"

ggplot() +
  geom_sf(data=ms_tract_2020, aes(geometry = geometry), fill = NA, color=secondary_color) +
  geom_sf(data=ms_county_2020, aes(geometry = geometry), fill = NA, color=primary_color) +
  theme_minimal() +
  theme(panel.grid = element_blank(),
        axis.text = element_blank())

ggsave("./images/sc.svg")
ggsave("./images/sc.png")

ggplot() +
  geom_sf(data=sc_county_2020 %>% 
            rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE), 
          aes(geometry = geometry), fill = fill, color=secondary_color) +
  geom_text(data = cities %>% 
              filter(ST == "SC") %>% 
              filter(POP_CLASS %in% c(7, 8)) %>% 
              filter(CLASS == "city") %>% 
              select(X, Y, NAME), 
            aes(x = X, y = Y, label = NAME), size = 3, color = primary_color) + 
  theme_minimal() +
  theme(panel.grid = element_blank(),
        axis.text = element_blank(),
        axis.title = element_blank())

ggsave("./images/sc_counties.svg")
ggsave("./images/sc_counties.png")


xlim <- sf::st_bbox(sc_county_2020)[c(1, 3)]
ylim <- sf::st_bbox(sc_county_2020)[c(2, 4)]


ggplot(data = nc_county_2020 %>% 
         bind_rows(sc_county_2020) %>% 
         bind_rows(ga_county_2020) %>% 
         rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE)) +
  geom_sf(aes(geometry = geometry), fill = fill, color=secondary_color, size = .5) +
  geom_sf(data=sc_county_2020 %>% 
            rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE),
          aes(geometry = geometry), fill = NA, color="black", size = .75) +
  theme_minimal() +
  theme(panel.grid = element_blank(),
        axis.text = element_blank(),
        axis.title = element_blank()) +
  geom_text(data = cities %>% 
              filter(ST %in% c("NC", "SC", "GA")) %>% 
              filter(POP_CLASS %in% c(7, 8)) %>% 
              filter(CLASS == "city") %>% 
              select(X, Y, NAME), 
            aes(x = X, y = Y, label = NAME), size = 3, color = primary_color) +
  coord_sf(xlim = xlim, ylim = ylim)

ggsave("./images/sc_counties.svg")

ggplot() +
  geom_sf(data=sc_county_change %>% 
            filter(changeYear == "2012-2014") %>% 
            rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE) %>% 
            distinct(geometry), 
          aes(geometry = geometry), fill = fill, color=secondary_color) +
  geom_text(data = cities %>% 
              filter(ST == "SC") %>% 
              filter(POP_CLASS %in% c(7, 8)) %>% 
              filter(CLASS == "city") %>% 
              select(X, Y, NAME), 
            aes(x = X, y = Y, label = NAME), size = 3, color = primary_color) + 
  geom_sf(data = sc_county_change %>% 
            distinct(geometry, changeYear, changeNoPoll, changePoll, pctBlackBin) %>% 
            sf::st_centroid() %>% 
            filter(changeYear == "2012-2014"), 
          aes(geometry = geometry, color= pctBlackBin, shape = changePoll)) +
  theme_minimal() +
  theme(panel.grid = element_blank(),
        axis.text = element_blank(),
        axis.title = element_blank()) +
  scale_color_manual(values = c("#FFEFE6","#FFCEB3", "#FF9D66", "#FF7D33", "#FF5C00")) +
  scale_shape_manual(values = c(25, 24, 20)) +
  scale_alpha_manual(values = c(.1, 1))

ggsave("./images/sc_counties.svg")
ggsave("./images/sc_counties.png")

ggplot() +
  geom_sf(data=sc_county_change %>% 
            filter(changeYear == "2018-2020") %>% 
            rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE) %>% 
            distinct(geometry), 
          aes(geometry = geometry), fill = fill, color=secondary_color) +
  geom_text(data = cities %>% 
              filter(ST == "SC") %>% 
              filter(POP_CLASS %in% c(7, 8)) %>% 
              filter(CLASS == "city") %>% 
              select(X, Y, NAME), 
            aes(x = X, y = Y, label = NAME), size = 3, color = primary_color) + 
  geom_sf(data = sc_county_change %>% 
            distinct(geometry, changeYear, changeNoPoll, changeNoPollBin, changePoll, pctBlackBin, totalChanges) %>% 
            sf::st_centroid() %>% 
            filter(changeYear == "2018-2020"), 
          aes(geometry = geometry, color= changeNoPollBin, size = totalChanges)) +
  theme_minimal() +
  theme(panel.grid = element_blank(),
        axis.text = element_blank(),
        axis.title = element_blank()) +
  scale_color_manual(values = c('#610063', '#935485', '#C498A6', '#C6C6C6', '#FBB18A', '#F28559', '#E45729'))

ggsave("./images/sc_counties.svg")

ggplot(data = sc_county_change %>% 
         filter(changeYear == "2012-2014"), 
       aes(x = changeYear, y = reorder(NAME, changeNoPoll), 
           fill = changeNoPollBin, color = changeNoPollBin)) +
  geom_tile() +
  scale_fill_manual(values = c('#610063', '#935485', '#C498A6', '#C6C6C6', '#FBB18A', '#F28559', '#E45729')) +
  scale_color_manual(values = c('#610063', '#610063', '#610063', '#757575', '#E45729', '#E45729', '#E45729')) +
  theme_minimal() +
  theme(panel.grid.major.x = element_blank())

ggplot(data = sc_county_change, 
       aes(x = changeYear, y = reorder(NAME, changeNoPoll), 
          color = changeNoPollBin, size = totalChanges)) +
  geom_point() +
  scale_color_manual(values = c('#610063', '#935485', '#C498A6', '#C6C6C6', '#FBB18A', '#F28559', '#E45729')) +
  theme_minimal() +
  theme(panel.grid.major.x = element_blank(),
        panel.grid.major.y = element_blank())

ggsave("./images/sc_counties_heatmap.svg")

ggplot(data = sc_county_change %>% 
         filter(changeYear == "2018-2020"), 
       aes(x = changeYear, y = reorder(NAME, totalChanges), 
           color = changeNoPollBin, size = totalChanges)) +
  geom_point() +
  scale_color_manual(values = c('#610063', '#935485', '#C498A6', '#C6C6C6', '#FBB18A', '#F28559', '#E45729')) +
  theme_minimal() +
  theme(panel.grid.major.x = element_blank())

ggsave("./images/sc_counties_heatmap2.svg")


ggplot() +
  geom_sf(data=sc_county_change %>% 
            filter(changeYear == "2012-2014") %>% 
            distinct(geometry) %>% 
            rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE), 
          aes(geometry = geometry), fill = fill, color=secondary_color) +
  geom_text(data = cities %>% 
              filter(ST == "SC") %>% 
              filter(POP_CLASS %in% c(7, 8)) %>% 
              filter(CLASS == "city") %>% 
              select(X, Y, NAME), 
            aes(x = X, y = Y, label = NAME), size = 3, color = primary_color) + 
  geom_sf(data = sc_county_change %>% 
            distinct(geometry, changeYear, changeNoPoll, changePoll, pctBlackBin) %>% 
            sf::st_centroid() %>% 
            filter(changeYear == "2012-2014"), 
          aes(geometry = geometry), size = 3) +
  theme_minimal() +
  theme(panel.grid = element_blank(),
        axis.text = element_blank(),
        axis.title = element_blank())


charleston <- sc_voting_district_2020 %>%
  filter(COUNTYFP20 == "019") %>%
  rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE)

ggplot() +
  geom_sf(data=sc_blocks_2020 %>%
            filter(COUNTYFP20 == "019") %>%
            rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE), 
          aes(geometry = geometry), fill = "darkgreen", alpha=.5, color="darkgreen") +
  theme_minimal() +
  theme(panel.grid = element_blank(),
        axis.text = element_blank(),
        axis.title = element_blank()) +
  labs(title = "Block group")

ggplot(data=sc_tract_2020 %>%
         filter(COUNTYFP == "019") %>%
         rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE) %>% 
         mutate(nPolls = sample(c(10, -10, 30, -30, 50, -50), n(), replace = TRUE)) +
  geom_sf(data = charleston, aes(geometry = geometry), fill = "purple", alpha=.3, color="purple")) +
  geom_spike(aes()) + 
  theme_minimal() +
  theme(panel.grid = element_blank(),
        axis.text = element_blank(),
        axis.title = element_blank()) +
  labs(title = "Census tract")

ggplot() +
  geom_sf(data=charleston, aes(geometry = geometry), fill = "red", alpha = .5, color="red") +
  theme_minimal() +
  theme(panel.grid = element_blank(),
        axis.text = element_blank(),
        axis.title = element_blank()) +
  labs(title = "Voting districts")

xlim <- sf::st_bbox(charleston_demo)[c(1, 3)]
ylim <- sf::st_bbox(charleston_demo)[c(2, 4)]

surround_tracts <- sc_tract_2020 %>% 
  filter(COUNTYFP %in% c("019", "043", "015", "035", "029")) %>% 
  select(geometry, NAME) %>% 
  rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE)

ggplot() +
  geom_sf(data = surround_tracts,
          aes(geometry = geometry), fill = "#E1E1E1", color="#B7B7B7") +
  geom_sf(data=charleston_demo %>%
            rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE), 
          aes(geometry = geometry, fill = pctBlackBin), color = "#757575") +
  geom_sf(data = charleston, aes(geometry = geometry), fill = NA, color="#047391") +
  geom_sf(data = polling_loc %>% 
           sf::st_filter(surround_tracts) %>%
            filter(change_year %in% c(2012, 2014)), aes(geometry = geometry, color = change_type)) +
  theme_minimal() +
  theme(panel.grid = element_blank(),
        axis.text = element_blank(),
        axis.title = element_blank()) +
  scale_color_manual(values = c('#610063', '#C6C6C6', '#E45729')) +
  scale_fill_manual(values = c('#d4e2e8', '#aac5d2', '#7fa9bc', '#508da6')) +
  coord_sf(xlim = xlim, ylim = ylim)

ggsave("./images/Charleston.svg")

ggplot() +
  geom_sf(data=charleston, aes(geometry = geometry), fill = "red", alpha = .5, color="red") +
  theme_minimal() +
  theme(panel.grid = element_blank(),
        axis.text = element_blank(),
        axis.title = element_blank()) +
  labs(title = "Voting districts")

ggplot() +
  geom_sf(data = charleston, aes(geometry = geometry), fill = NA, color="black") +
  theme_minimal() +
  theme(panel.grid = element_blank(),
        axis.text = element_blank(),
        axis.title = element_blank())

ggsave("./images/Voting_Districts.svg")

ggplot() +
  geom_sf(data=charleston_demo %>%
            rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE), 
          aes(geometry = geometry, fill = pctBlackBin), color = "#D7D7D7") +
  theme_minimal() +
  theme(panel.grid = element_blank(),
        axis.text = element_blank(),
        axis.title = element_blank()) +
  scale_fill_manual(values = c('#bee0aa', '#94b681', '#698b57', '#3f612d'))


ggsave("./images/Demographic.svg")

# ggplot() +
#   geom_sf(data=ms_tract_2020, aes(geometry = geometry), fill = NA, color=secondary_color) +
#   geom_sf(data=ms_county_2020, aes(geometry = geometry), fill = NA, color=primary_color) +
#   theme_minimal() +
#   theme(panel.grid = element_blank(),
#         axis.text = element_blank())
# 
# ggsave("./images/ms.svg")
# ggsave("./images/ms.png")
# 
# ggplot() +
#   geom_sf(data=ms_county_2020 %>% 
#             rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE), aes(geometry = geometry), 
#           fill = fill, color=secondary_color) +
#   geom_text(data = cities %>% 
#               filter(ST == "MS") %>% 
#               filter(POP_CLASS %in% c(7, 8)) %>% 
#               filter(CLASS == "city") %>% 
#               select(X, Y, NAME), 
#             aes(x = X, y = Y, label = NAME), size = 3, color = primary_color) + 
#   theme_minimal() +
#   theme(panel.grid = element_blank(),
#         axis.text = element_blank(),
#         axis.title = element_blank())
# 
# ggsave("./images/ms_counties.svg")
# ggsave("./images/ms_counties.png")
# 
# ggplot() +
#   geom_sf(data=ga_tract_2020, aes(geometry = geometry), fill = NA, color=secondary_color) +
#   geom_sf(data=ga_county_2020, aes(geometry = geometry), fill = NA, color=primary_color) +
#   theme_minimal() +
#   theme(panel.grid = element_blank(),
#         axis.text = element_blank())
# 
# ggsave("./images/ga.svg")
# ggsave("./images/ga.png")
# 
# ggplot() +
#   geom_sf(data=ga_county_2020 %>% 
#             rmapshaper::ms_simplify(keep = 0.05, keep_shapes = TRUE), aes(geometry = geometry), fill = fill, color=secondary_color) +
#   geom_text(data = cities %>% 
#               filter(ST == "GA") %>% 
#               filter(POP_CLASS %in% c(8)) %>% 
#               filter(CLASS == "city") %>% 
#               select(X, Y, NAME), 
#             aes(x = X, y = Y, label = NAME), size = 3, color = primary_color) + 
#   theme_minimal() +
#   theme(panel.grid = element_blank(),
#         axis.text = element_blank(),
#         axis.title = element_blank())
# 
# ggsave("./images/ga_counties.svg")
# ggsave("./images/ga_counties.png")
# 



sc_county_change %>% 
  distinct(NAME, 
           year,
           changeYear, 
           polling_locations_added_since_last_general, 
           polling_locations_removed_since_last_general,
           changeNoPoll,
           percentage_race_black_african_american,
           pctBlackBin) %>% 
  readr::write_csv("./data/test.csv")

# ggplot(tigris::states(cb = TRUE)) +
#   geom_sf(aes(geometry = geometry)) +
#   geom_sf_text(data = tigris::states(cb = TRUE) %>%  
#             sf::st_centroid(), aes(geometry = geometry, label = NAME)) +
#   theme_minimal() +
#   theme(panel.grid = element_blank(),
#         axis.text = element_blank(),
#         axis.title = element_blank()) +
#   coord_map(projection = "albers")

states <- map_data("state")

ggplot(states, aes(long, lat, group = group)) +
  geom_polygon(fill = "#EAEAEA", colour = "#B7B7B7") +
  # geom_text(data = states %>% 
  #             group_by(region) %>% 
  #             summarize(lat = mean(lat), long = mean(long)) %>%
  #             mutate(region = stringr::str_to_title(region)),
  #           aes(long, lat, label = region)) +
  theme_minimal() +
  theme(panel.grid = element_blank(),
        axis.text = element_blank(),
        axis.title = element_blank()) +
  coord_map()

ggsave("usa.svg")

