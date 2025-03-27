// Combined update function: updates both the heat map and line chart, and displays the reliability score
function updateCharts() {
    if (window.updateHeatMap) window.updateHeatMap();
    if (window.updateLineChart) window.updateLineChart();
    setTimeout(computeReliabilityScore, 500);
}

// Debounce function (in milliseconds)
function debounce(func, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

// Register event listeners: respond to 'regionSelected' and 'metricSelected' events
window.addEventListener('regionSelected', debounce(function(e) {
    window.selectedRegion = e.detail.regionId;
    updateCharts();
}, 300));

window.addEventListener('metricSelected', debounce(function(e) {
    window.selectedMetric = e.detail.metric;
    updateCharts();
}, 300));

// Calculate and display the reliability score for the current region
function computeReliabilityScore() {
    if (!window.aggregatedData) {
        console.error("Aggregated data not loaded yet");
        return;
    }
    const T = window.aggregatedData.length;
    const missingCount = window.aggregatedData.filter(d => isNaN(d.value)).length;
    const completeness = 1 - missingCount / T;
    let varianceArray = window.lineChartData || [];
    let avgVar = varianceArray.length > 0 ? d3.mean(varianceArray) : 0;
    let maxVar = varianceArray.length > 0 ? d3.max(varianceArray) : 1;
    if (maxVar === 0) maxVar = 1;
    const stabilityScore = 1 - (avgVar / maxVar);
    const w1 = 0.5, w2 = 0.5;
    const reliabilityScore = w1 * completeness + w2 * stabilityScore;
    d3.select("#reliability-score").html(
        `<strong>Region ${window.selectedRegion} Reliability Score:</strong> ${reliabilityScore.toFixed(2)}<br>
         Completeness: ${completeness.toFixed(2)}<br>
         Stability: ${stabilityScore.toFixed(2)}`
    );
}
