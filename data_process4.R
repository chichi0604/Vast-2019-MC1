library(dplyr)
library(tidyr)

data <- read.csv("./data_visualisation_project/data/vast2019mc1/MC1/mc1-reports-data.csv",
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

result <- result %>%
  group_by(location) %>%
  complete(time_interval = seq(min(time_interval), max(time_interval), by = "1 hour")) %>%
  ungroup()

result$time_interval <- format(result$time_interval, "%Y/%m/%d %H:%M")
result$time_interval <- gsub("/0", "/", result$time_interval)

write.csv(result, "./data_visualisation_project/data/vast2019mc1/MC1/variance1.csv",
          row.names = FALSE)
