library(dplyr)
library(tidyr)

data <- read.csv("G:/data_visualisation_project/data/vast2019mc1/MC1/severity2.csv",
                 stringsAsFactors = FALSE)

data$time <- as.POSIXct(data$time, format = "%Y/%m/%d %H:%M")

data <- data %>%
  mutate(
    date = as.Date(time),
    hour = as.numeric(format(time, "%H")),
    time_interval = as.POSIXct(paste(date, sprintf("%02d:00", hour)))
  )

data <- data %>%
  filter(!(date %in% as.Date(c("2020-04-05", "2020-04-11"))))

cols_to_calc <- setdiff(names(data), c("time", "location", "date", "hour", "time_interval"))

result <- data %>%
  group_by(location, time_interval) %>%
  summarise(across(all_of(cols_to_calc), ~ {
    valid <- .x[!is.na(.x)]
    if(length(valid) < 2) {
      if(length(valid) == 1) {
        valid
      } else {
        NA
      }
    } else {
      var(.x, na.rm = TRUE)
    }
  }), .groups = "drop")

