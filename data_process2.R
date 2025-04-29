library(dplyr)

data1 <- read.csv("./data_visualisation_project/data/vast2019mc1/MC1/variance1.csv", stringsAsFactors = FALSE)

data2 <- read.csv("./data_visualisation_project/data/vast2019mc1/MC1/variance2.csv", stringsAsFactors = FALSE)

print(names(data1))
print(names(data2))

merged_data <- left_join(
  data1,
  data2 %>% select(time_interval, location, severity),
  by = c("time_interval", "location")
)

head(merged_data)

write.csv(merged_data, "./data_visualisation_project/data/vast2019mc1/MC1/severity1.csv", row.names = FALSE)
