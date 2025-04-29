if (!require("dplyr")) {
  install.packages("dplyr")
  library(dplyr)
}

data <- read.csv("./data_visualisation_project/data/vast2019mc1/MC1/mc1-reports-data.csv", stringsAsFactors = FALSE)

if (!"date" %in% names(data)) {
  data$date <- as.Date(substr(data$time, 1, 10))
} else {
  data$date <- as.Date(data$date)
}

exclude_locations <- c(1, 3, 5, 6, 9, 11, 16)

data$medical <- ifelse(data$location %in% exclude_locations, data$medical, NA)

mode_func <- function(x) {
  ux <- unique(x)
  ux[which.max(tabulate(match(x, ux)))]
}

if (any(is.na(data$sewer_and_water))) {
  mode_val <- mode_func(data$sewer_and_water[!is.na(data$sewer_and_water)])
  data$sewer_and_water[is.na(data$sewer_and_water)] <- mode_val
}

if (any(is.na(data$buildings))) {
  mode_val <- mode_func(data$buildings[!is.na(data$buildings)])
  data$buildings[is.na(data$buildings)] <- mode_val
}

train_shake <- data[!is.na(data$shake_intensity), ]
test_shake  <- data[is.na(data$shake_intensity), ]

set.seed(500)

model_shake <- lm(shake_intensity ~ sewer_and_water + power + roads_and_bridges + buildings,
                  data = train_shake)

predicted_shake <- as.integer(predict(model_shake, newdata = test_shake))

data$shake_intensity[is.na(data$shake_intensity)] <- predicted_shake
data$shake_intensity[data$shake_intensity < 0] <- 0

data$severity <- ifelse(
  data$location %in% exclude_locations,
  data$sewer_and_water * 0.12 + data$power * 0.12 + data$roads_and_bridges * 0.12 +
    data$medical * 0.12 + data$buildings * 0.12 + data$shake_intensity * 0.40,
  data$sewer_and_water * 0.15 + data$power * 0.15 + data$roads_and_bridges * 0.15 +
    data$buildings * 0.15 + data$shake_intensity * 0.40
)

data <- data %>%
  filter(!(date %in% as.Date(c("2020-04-05", "2020-04-11"))))

output_file <- "./data_visualisation_project/data/vast2019mc1/MC1/severity2.csv"
write.csv(data, file = output_file, row.names = FALSE)
