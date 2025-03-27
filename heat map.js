(function () {
    // Global data variables
    let originalData = [];
    let severityData = [];
    window.selectedRegion = "1";
    window.selectedMetric = "sewer_and_water";

    // Metrics array: only "severity" uses new data, others use original data
    const metrics = [
        "sewer_and_water",
        "power",
        "buildings",
        "roads_and_bridges",
        "medical",
        "shake_intensity",
        "severity",
    ];

    // Create a global tooltip
    let tooltip = d3.select("body").select("#tooltip");
    if (tooltip.empty()) {
        tooltip = d3.select("body").append("div")
            .attr("id", "tooltip")
            .style("position", "absolute")
            .style("background", "#f4f4f4")
            .style("padding", "8px")
            .style("border", "1px solid #333")
            .style("border-radius", "4px")
            .style("pointer-events", "none")
            .style("opacity", 0);
    }

    // Data loading function: original CSV data
    function loadOriginalData() {
        return d3.csv("data/vast2019mc1/MC1/mc1-reports-data.csv")
            .then((data) => {
                data.forEach(row => {
                    Object.keys(row).forEach(key => {
                        if (row[key].trim() === "") {
                            row[key] = "NA";
                        }
                    });
                });
                data.forEach((d) => {
                    d.dateObj = new Date(d.time);
                    d.dateStr = d3.timeFormat("%Y/%m/%d")(d.dateObj);
                    d.timeOfDay = new Date(1970, 0, 1, d.dateObj.getHours(), d.dateObj.getMinutes(), d.dateObj.getSeconds());
                });
                data.sort((a, b) => a.dateObj - b.dateObj);
                originalData = data;
                // Expose data as a global variable
                window.originalData = originalData;
            });
    }

    // Data loading function: CSV data for "severity"
    function loadSeverityData() {
        return d3.csv("data/vast2019mc1/MC1/severity2.csv")
            .then((data) => {
                data.forEach((d) => {
                    d.dateObj = new Date(d.time);
                    d.dateStr = d3.timeFormat("%Y/%m/%d")(d.dateObj);
                    d.timeOfDay = new Date(1970, 0, 1, d.dateObj.getHours(), d.dateObj.getMinutes(), d.dateObj.getSeconds());
                });
                data.sort((a, b) => a.dateObj - b.dateObj);
                severityData = data;
                window.originalData = originalData;
            });
    }

    // Update the heat map after loading data separately
    loadOriginalData().then(() => {
        if (window.selectedMetric !== "severity") updateHeatMap();
    });
    loadSeverityData().then(() => {
        if (window.selectedMetric === "severity") updateHeatMap();
    });

    // Select container
    const chartContainer = d3.select("#heat-map");
    const legendContainer = d3.select("#metric-legend").html("")
        .append("div")
        .attr("class", "metric-legend")
        .style("display", "flex")
        .style("flex-direction", "column");

    // Construct metric legend (vertical layout)
    legendContainer.append("h3")
        .text("Damage")
        .style("margin-bottom", "10px")
        .style("align-self", "center");

    legendContainer.selectAll("button")
        .data(metrics)
        .enter()
        .append("button")
        .attr("class", (d) => "legend-button" + (d === window.selectedMetric ? " selected" : ""))
        .text((d) => d)
        .style("margin", "5px")
        .style("padding", "5px 10px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("cursor", "pointer")
        .on("click", function (event, d) {
            window.selectedMetric = d;
            d3.selectAll("#metric-legend .legend-button").classed("selected", false);
            d3.select(this).classed("selected", true);
            window.dispatchEvent(new CustomEvent("metricSelected", { detail: { metric: d } }));
            updateHeatMap();
        });

    // Select data source based on current metric and update heat map
    function updateHeatMap() {
        let dataSource = window.selectedMetric === "severity" ? severityData : originalData;
        if (!dataSource || dataSource.length === 0) return;
        // Filter out data with date equal to 11
        let filteredData = dataSource.filter((d) => d.dateObj.getDate() !== 11);
        if (window.selectedRegion) {
            filteredData = filteredData.filter((d) => +d.location === +window.selectedRegion);
        }
        drawHeatMap(filteredData, window.selectedMetric);
    }

    // Draw heat map and add uncertainty color logic
    function drawHeatMap(data, metric) {
        chartContainer.html("");
        if (!metric) return;

        const uniqueDates = Array.from(new Set(data.map((d) => d.dateStr))).sort((a, b) => new Date(a) - new Date(b));
        if (uniqueDates.length === 0) {
            chartContainer.append("p").text("No data");
            return;
        }

        // Group by date and 5-minute intervals, calculate average and record count to determine data uncertainty
        const groupedData = d3.group(data, (d) => d.dateStr, (d) => {
            const totalMinutes = d.dateObj.getHours() * 60 + d.dateObj.getMinutes();
            return Math.floor(totalMinutes / 5) * 5;
        });
        let aggregatedData = [];
        uniqueDates.forEach((date) => {
            const dateGroup = groupedData.get(date);
            for (let bucket = 0; bucket < 1440; bucket += 5) {
                let bucketRecords = (dateGroup && dateGroup.get(bucket)) || [];
                let validRecords = bucketRecords.filter((r) => !isNaN(+r[metric]));
                let bucketTime = new Date(1970, 0, 1, Math.floor(bucket / 60), bucket % 60, 0);
                let value, uncertainty;
                if (validRecords.length === 0) {
                    value = NaN;
                    uncertainty = "missing";  // Missing data
                } else {
                    value = d3.mean(validRecords, (r) => +r[metric]);
                    // If the count of valid records is less than 2, mark as high uncertainty
                    uncertainty = validRecords.length < 2 ? "high" : "low";
                }
                aggregatedData.push({ dateStr: date, bucket, bucketTime, value, uncertainty });
            }
        });

        // Save aggregated data to a global variable for later calculations
        window.aggregatedData = aggregatedData;

        // Calculate uncertainty ratio
        let validSlots = aggregatedData.filter(d => !isNaN(d.value));
        let validCount = validSlots.length;
        let uncertainCount = validSlots.filter(d => d.uncertainty === "high").length;
        let uncertaintyRatio = validCount > 0 ? uncertainCount / validCount : 0;

        const svgWidth = 1800,
            svgHeight = 400;
        const margin = { top: 50, right: 50, bottom: 40, left: 100 };

        const startOfDay = new Date(1970, 0, 1, 0, 0, 0);
        const endOfDay = new Date(1970, 0, 1, 23, 59, 59);
        const xScale = d3.scaleTime().domain([startOfDay, endOfDay]).range([margin.left, svgWidth - margin.right]);
        const yScale = d3.scaleBand().domain(uniqueDates).range([margin.top, svgHeight - margin.bottom]).padding(0.05);

        const svg = chartContainer.append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .style("display", "block")
            .style("margin", "0 auto 30px auto");

        const xAxis = d3.axisTop(xScale).ticks(d3.timeHour.every(1)).tickFormat(d3.timeFormat("%H:%M"));
        svg.append("g").attr("class", "x axis").attr("transform", `translate(0, ${margin.top})`).call(xAxis);

        const yAxis = d3.axisLeft(yScale);
        svg.append("g").attr("class", "y axis").attr("transform", `translate(${margin.left},0)`).call(yAxis);

        const cellWidth = (svgWidth - margin.left - margin.right) / 288;
        const cellHeight = yScale.bandwidth();

        const colorScale = d3.scaleLinear().domain([0, 10]).range(["white", "red"]);

        // Draw heat map cells
        svg.selectAll(".cell")
            .data(aggregatedData)
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("x", (d) => xScale(d.bucketTime))
            .attr("y", (d) => yScale(d.dateStr))
            .attr("width", cellWidth)
            .attr("height", cellHeight)
            .style("fill", (d) => {
                if (isNaN(d.value)) return "lightgray";    // Missing
                if (d.uncertainty === "high") return "orange"; // High uncertainty
                if (d.value === 0) return "white";
                return colorScale(d.value);
            })
            .style("stroke", "#fff")
            .on("mouseover", function (event, d) {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(
                    `<strong>Date:</strong> ${d.dateStr}<br>` +
                    `<strong>Time:</strong> ${d3.timeFormat("%H:%M")(d.bucketTime)}<br>` +
                    `<strong>Value:</strong> ${isNaN(d.value) ? "NA" : d.value}`
                )
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY + 10 + "px");
                window.dispatchEvent(new CustomEvent("timePointHovered", { detail: { hour: d.bucketTime.getHours() } }));
            })
            .on("mousemove", function (event) {
                tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY + 10 + "px");
            })
            .on("mouseout", function () {
                tooltip.transition().duration(500).style("opacity", 0);
                window.dispatchEvent(new CustomEvent("timePointHoveredOut", {}));
            })
            .on("click", function (event, d) {
                window.dispatchEvent(new CustomEvent("timePointSelected", { detail: { hour: d.bucketTime.getHours() } }));
            });

        // Add heat map title
        chartContainer.insert("h2", ":first-child").text(window.selectedMetric + " (region " + window.selectedRegion + ")");

        // First, create <defs> in the main heatmap SVG to define a vertical gradient
        const defs = svg.append("defs");
        const linearGradient = defs.append("linearGradient")
            .attr("id", "heatmap-gradient")
            .attr("x1", "0%")
            .attr("y1", "100%")
            .attr("x2", "0%")
            .attr("y2", "0%");
        // Define the two end colors for the gradient: 0% (bottom) white, 100% (top) red
        linearGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "white");
        linearGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "red");

        // Place a <g> on the right side to display a "low-to-high" gradient bar
        const colorScaleGroup = svg.append("g")
            .attr("transform", `translate(${svgWidth - margin.right + 10}, ${margin.top + 10})`);
        colorScaleGroup.append("rect")
            .attr("width", 20)
            .attr("height", 200)
            .style("fill", "url(#heatmap-gradient)");
        colorScaleGroup.append("text")
            .attr("x", 25)
            .attr("y", 200)
            .attr("dy", ".35em")
            .style("font-size", "12px")
            .text("0");
        colorScaleGroup.append("text")
            .attr("x", 25)
            .attr("y", 0)
            .attr("dy", ".35em")
            .style("font-size", "12px")
            .text("10");

        // Place small squares for gray (missing data) and orange (high uncertainty) at the top right of the heatmap
        const smallLegendGroup = svg.append("g")
            .attr("transform", `translate(${svgWidth - margin.right - 150}, ${margin.top + 320})`);
        smallLegendGroup.append("rect")
            .attr("x", -25)
            .attr("y", 0)
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", "lightgray");
        smallLegendGroup.append("text")
            .attr("x", 0)
            .attr("y", 15)
            .style("font-size", "12px")
            .text("missing data");
        smallLegendGroup.append("rect")
            .attr("x", 75)
            .attr("y", 0)
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", "orange");
        smallLegendGroup.append("text")
            .attr("x", 100)
            .attr("y", 15)
            .style("font-size", "12px")
            .text("high uncertainty");

        // Add text to the heatmap to display the uncertainty ratio
        svg.append("text")
            .attr("x", svgWidth - margin.right - 400)
            .attr("y", 15)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text(`uncertainty ratio: ${uncertaintyRatio.toFixed(2)}`);
    }
    window.updateHeatMap = updateHeatMap;
})();
