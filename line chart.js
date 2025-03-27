(function () {
    // Global data variables
    let allCSVData = [];
    let severityData = [];
    window.selectedRegion = window.selectedRegion || "1";
    window.selectedMetric = window.selectedMetric || "sewer_and_water";

    // Metrics array: only "severity" uses new data, others use original data
    const possibleMetrics = [
        "sewer_and_water",
        "power",
        "buildings",
        "roads_and_bridges",
        "medical",
        "shake_intensity",
        "norm_variance",
        "severity",
    ];

    // Global tooltip (used uniformly)
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

    // Load original CSV data (for non-"severity" metric)
    function loadOriginalData() {
        return d3.csv("data/vast2019mc1/MC1/variance1.csv")
            .then((data) => {
                data.forEach((d) => {
                    if (d.time_interval && d.time_interval.trim().length > 0) {
                        const parts = d.time_interval.trim().split(" ");
                        if (parts.length > 1) {
                            d.date = parts[0];
                            const timeParts = parts[1].split(":");
                            d.hour = timeParts.length > 0 ? +timeParts[0] : NaN;
                        } else {
                            d.date = "unknown";
                            d.hour = NaN;
                        }
                    } else {
                        d.date = "unknown";
                        d.hour = NaN;
                    }
                    possibleMetrics.forEach((metric) => {
                        d[metric] = d[metric] !== undefined && d[metric] !== null && d[metric] !== "" ? +d[metric].trim() : NaN;
                    });
                });
                allCSVData = data;
            });
    }

    // Load "severity" data (for "severity" metric only)
    function loadSeverityData() {
        return d3.csv("data/vast2019mc1/MC1/severity1.csv")
            .then((data) => {
                data.forEach((d) => {
                    if (d.time_interval && d.time_interval.trim().length > 0) {
                        const parts = d.time_interval.trim().split(" ");
                        if (parts.length > 1) {
                            d.date = parts[0];
                            const timeParts = parts[1].split(":");
                            d.hour = timeParts.length > 0 ? +timeParts[0] : NaN;
                        } else {
                            d.date = "unknown";
                            d.hour = NaN;
                        }
                    } else {
                        d.date = "unknown";
                        d.hour = NaN;
                    }
                    possibleMetrics.forEach((metric) => {
                        d[metric] = d[metric] !== undefined && d[metric] !== null && d[metric] !== ""
                            ? +d[metric].trim()
                            : NaN;
                    });
                });
                severityData = data;
            });
    }

    loadOriginalData().then(() => {
        if (window.selectedMetric !== "severity") updateLineChart();
    });
    loadSeverityData().then(() => {
        if (window.selectedMetric === "severity") updateLineChart();
    });

    // Update line chart
    function updateLineChart() {
        const dataSource = window.selectedMetric === "severity" ? severityData : allCSVData;
        const chartContainer = d3.select("#line-chart");
        chartContainer.html("");
        // Filter data based on region
        const regionData = dataSource.filter((d) => +d.location === +window.selectedRegion);
        if (regionData.length === 0) {
            chartContainer.append("p").text("No data");
            return;
        }
        // Group by date
        const dataByDate = d3.group(regionData, (d) => d.date);
        const dates = Array.from(dataByDate.keys()).sort((a, b) => new Date(a) - new Date(b));

        // Create title and legend at the top (title on the left, legend on the right)
        const topBar = chartContainer.append("div")
            .style("display", "flex")
            .style("justify-content", "space-between")
            .style("align-items", "center")
            .style("margin-bottom", "10px");

        topBar.append("h2").text(`Variance of ${window.selectedMetric} (region ${window.selectedRegion})`);

        const legendDiv = topBar.append("div")
            .attr("class", "line-legend")
            .style("display", "flex")
            .style("gap", "10px");

        const color = d3.scaleOrdinal().domain(dates).range(d3.schemeCategory10);
        dates.forEach((date) => {
            const legendItem = legendDiv.append("div")
                .style("display", "flex")
                .style("align-items", "center")
                .style("gap", "5px");
            legendItem.append("span")
                .style("width", "14px")
                .style("height", "14px")
                .style("background-color", color(date));
            legendItem.append("span").text(date);
        });

        // Generate line data for each date (aggregated by hour)
        let dateLines = Array.from(dataByDate, ([date, values]) => {
            const groupedByHour = d3.group(values, (d) => d.hour);
            let parsedData = [];
            groupedByHour.forEach((vals, hour) => {
                const validValues = vals.filter((d) => !isNaN(d[window.selectedMetric]));
                if (validValues.length > 0) {
                    const avg = d3.mean(validValues, (d) => d[window.selectedMetric]);
                    parsedData.push({ hour: +hour, avg });
                } else {
                    parsedData.push({ hour: +hour, avg: NaN });
                }
            });
            parsedData.sort((a, b) => a.hour - b.hour);
            return { date, parsedData };
        });
        dateLines.sort((a, b) => new Date(a.date) - new Date(b.date));

        let allValues = [];
        dateLines.forEach((line) => {
            line.parsedData.forEach((d) => {
                if (!isNaN(d.avg)) allValues.push(d.avg);
            });
        });
        if (allValues.length === 0) {
            chartContainer.append("p").text("No valid data");
            return;
        }
        const extent = d3.extent(allValues);
        let padding = (extent[1] - extent[0]) * 0.1;
        if (padding === 0) padding = 1;
        const yDomain = [Math.max(0, extent[0] - padding), extent[1] + padding];

        // Size settings (kept unchanged)
        const marginChart = { top: 35, right: 20, bottom: 20, left: 40 };
        const overallWidth = 1800;
        const subWidth = (overallWidth - marginChart.left - marginChart.right) / 5;
        const subHeight = 250 - marginChart.top - marginChart.bottom;

        const x = d3.scaleLinear().domain([0, 24]).range([0, subWidth]);
        const y = d3.scaleLinear().domain(yDomain).range([subHeight, 0]);

        const numDays = dateLines.length;
        const overallWidthChart = marginChart.left + numDays * subWidth + marginChart.right;
        const overallHeightChart = marginChart.top + subHeight + marginChart.bottom;

        const svg = chartContainer.append("svg")
            .attr("width", overallWidthChart)
            .attr("height", overallHeightChart)
            .style("display", "block")
            .style("margin", "0 auto");

        svg.append("g")
            .attr("transform", `translate(${marginChart.left}, ${marginChart.top})`)
            .call(d3.axisLeft(y));

        const lineGenerator = d3.line()
            .defined((d, i, data) => {
                if (isNaN(d.avg)) return false;
                if (i === 0) return true;
                return d.hour - data[i - 1].hour === 1;
            })
            .x((d) => x(d.hour))
            .y((d) => y(d.avg));

        // Used to store boundary points for each date to connect 23:00 of the previous day with 0:00 of the next day
        let boundaryPoints = [];

        // Draw sub-charts and data points for each date
        dateLines.forEach(({ date, parsedData }, i) => {
            const safeDate = date.replace(/[^\w-]/g, "");
            const offsetX = marginChart.left + i * subWidth;
            const offsetY = marginChart.top;
            const g = svg.append("g")
                .attr("transform", `translate(${offsetX}, ${offsetY})`);
            g.append("text")
                .attr("x", subWidth / 2)
                .attr("y", -10)
                .attr("text-anchor", "middle")
                .attr("font-size", "14px")
                .attr("fill", "#000")
                .text(date);
            g.append("g")
                .attr("transform", `translate(0, ${subHeight})`)
                .call(
                    d3.axisBottom(x)
                        .tickValues([1, 4, 7, 10, 13, 16, 19, 22])
                        .tickFormat((d) => d + "h")
                );
            g.append("path")
                .datum(parsedData)
                .attr("fill", "none")
                .attr("stroke", color(date))
                .attr("stroke-width", 1.5)
                .attr("d", lineGenerator);
            // Add data points and assign the "line-point" class to them
            g.selectAll(`.invisible-circle-${safeDate}`)
                .data(parsedData.filter((d) => !isNaN(d.avg)))
                .enter()
                .append("circle")
                .attr("class", `invisible-circle-${safeDate} line-point`)
                .attr("cx", (d) => x(d.hour))
                .attr("cy", (d) => y(d.avg))
                .attr("r", 10)
                .attr("fill", "transparent")
                .style("cursor", "pointer")
                .on("mouseover", function (event, d) {
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip.html(
                        `<strong>Date:</strong> ${date}<br>` +
                        `<strong>Time:</strong> ${d.hour}h<br>` +
                        `<strong>Value:</strong> ${isNaN(d.avg) ? "NA" : d.avg.toFixed(2)}`
                    )
                        .style("left", event.pageX + 10 + "px")
                        .style("top", event.pageY + 10 + "px");
                    window.dispatchEvent(new CustomEvent("timePointHovered", { detail: { hour: d.hour } }));
                })
                .on("mousemove", function (event, d) {
                    tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY + 10 + "px");
                })
                .on("mouseout", function () {
                    tooltip.transition().duration(500).style("opacity", 0);
                    window.dispatchEvent(new CustomEvent("timePointHovered", { detail: { hour: null } }));
                })
                .on("click", function (event, d) {
                    window.dispatchEvent(new CustomEvent("timePointSelected", { detail: { hour: d.hour } }));
                });
            const isolatedPoints = parsedData.filter((d, idx) => {
                if (isNaN(d.avg)) return false;
                const prevMissing = idx === 0 || isNaN(parsedData[idx - 1].avg);
                const nextMissing = idx === parsedData.length - 1 || isNaN(parsedData[idx + 1].avg);
                return prevMissing && nextMissing;
            });
            g.selectAll(`.isolated-circle-${safeDate}`)
                .data(isolatedPoints)
                .enter()
                .append("circle")
                .attr("class", `isolated-circle-${safeDate}`)
                .attr("cx", (d) => x(d.hour))
                .attr("cy", (d) => y(d.avg))
                .attr("r", 5)
                .attr("fill", "red")
                .attr("stroke", "black")
                .attr("stroke-width", 2);
            g.selectAll(".tick")
                .filter((d) => d === 0)
                .remove();

            // Record boundary points: find data points at hour === 23 and hour === 0 in the current sub-chart
            let pt23 = parsedData.find(d => d.hour === 23 && !isNaN(d.avg));
            let pt0 = parsedData.find(d => d.hour === 0 && !isNaN(d.avg));
            boundaryPoints.push({
                date,
                index: i,
                pt23: pt23 ? { x: offsetX + x(23), y: offsetY + y(pt23.avg) } : null,
                pt0: pt0 ? { x: offsetX + x(0), y: offsetY + y(pt0.avg) } : null
            });
        });

        // Draw dividing lines (original)
        for (let i = 1; i < dateLines.length; i++) {
            svg.append("line")
                .attr("x1", marginChart.left + i * subWidth)
                .attr("x2", marginChart.left + i * subWidth)
                .attr("y1", marginChart.top)
                .attr("y2", marginChart.top + subHeight)
                .attr("stroke", "#ccc")
                .attr("stroke-width", 1);
        }

        // Connect 23:00 of the previous day with 0:00 of the next day
        for (let i = 0; i < boundaryPoints.length - 1; i++) {
            const curr = boundaryPoints[i];
            const next = boundaryPoints[i + 1];
            if (curr.pt23 && next.pt0) {
                svg.append("line")
                    .attr("x1", curr.pt23.x)
                    .attr("y1", curr.pt23.y)
                    .attr("x2", next.pt0.x)
                    .attr("y2", next.pt0.y)
                    .attr("stroke", color(curr.date))
                    .attr("stroke-width", 1.5);
            }
        }

        window.lineChartData = [];
        dateLines.forEach(({ parsedData }) => {
            parsedData.forEach(d => {
                if (!isNaN(d.avg)) {
                    window.lineChartData.push(d.avg);
                }
            });
        });
        // Listen for hover events uniformly, update highlighting for all data points
        window.addEventListener("timePointHovered", function (e) {
            const hoveredHour = e.detail.hour;
            d3.selectAll("circle.line-point").each(function (d) {
                if (hoveredHour !== null && d.hour === hoveredHour) {
                    d3.select(this).attr("stroke", "orange").attr("stroke-width", 3);
                } else {
                    d3.select(this).attr("stroke", "none");
                }
            });
        });

        window.updateLineChart = updateLineChart;
    }
    window.updateLineChart = updateLineChart;
})();
