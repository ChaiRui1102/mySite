// Parse the date/time from CSV data
const parseTime = d3.timeParse("%Y-%m-%d");

d3.csv("/download", function(d) {
    d.date = parseTime(d.date);
    d.gdp = +d.gdp;
    d.population = +d.population;
    d.unemployment_rate = +d.unemployment_rate;
    return d;
}).then(function(data) {
    // Set up dimensions
    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    // Create scales
    let x = d3.scaleTime().domain(d3.extent(data, d => d.date)).range([margin.left, width - margin.right]);
    let y = d3.scaleLinear().domain([0, d3.max(data, d => d.gdp)]).range([height - margin.bottom, margin.top]);

    // Line generators for different attributes
    const line1 = d3.line().x(d => x(d.date)).y(d => y(d.gdp));
    const line2 = d3.line().x(d => x(d.date)).y(d => y(d.population));
    const line3 = d3.line().x(d => x(d.date)).y(d => y(d.unemployment_rate));

    // Create initial chart
    const svg1 = d3.select("#chart1").append("svg").attr("width", width).attr("height", height);

    // Add X-axis
    const xAxis = svg1.append("g").attr("transform", `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x));

    // Add Y-axis
    const yAxis = svg1.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));

    // Draw initial line chart for GDP
    const path1 = svg1.append("path").datum(data).attr("fill", "none").attr("stroke", "steelblue").attr("d", line1);
    const path2 = svg1.append("path").datum(data).attr("fill", "none").attr("stroke", "green").attr("d", line2).style("display", "none");
    const path3 = svg1.append("path").datum(data).attr("fill", "none").attr("stroke", "red").attr("d", line3).style("display", "none");

    // Function to filter data by date range
    function filterDataByDateRange(startDate, endDate) {
        return data.filter(d => d.date >= new Date(startDate) && d.date <= new Date(endDate));
    }

    // Function to update chart based on selected attributes
    function updateChart(filteredData, selectedAttributes) {
        // Update Y-axis domain dynamically based on the attribute
        y.domain([0, d3.max(filteredData, d => d3.max(selectedAttributes.map(attr => d[attr])))]);
        yAxis.call(d3.axisLeft(y));

        // Show/hide paths based on selected attributes
        path1.datum(filteredData).attr("d", line1).style("display", selectedAttributes.includes('gdp') ? "block" : "none");
        path2.datum(filteredData).attr("d", line2).style("display", selectedAttributes.includes('population') ? "block" : "none");
        path3.datum(filteredData).attr("d", line3).style("display", selectedAttributes.includes('unemployment_rate') ? "block" : "none");
    }

    // Function to update axis scale dynamically
    function updateAxisScale(scaleType) {
        if (scaleType === 'linear') {
            y = d3.scaleLinear().domain([0, d3.max(data, d => d.gdp)]).range([height - margin.bottom, margin.top]);
        } else if (scaleType === 'logarithmic') {
            y = d3.scaleLog().domain([1, d3.max(data, d => d.gdp)]).range([height - margin.bottom, margin.top]);
        }
        yAxis.call(d3.axisLeft(y));
    }

    // Listen for filter button click
    document.getElementById("applyFilter").addEventListener("click", function() {
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;

        // Get selected attributes
        const selectedAttributes = Array.from(document.querySelectorAll('input[name="attribute"]:checked')).map(input => input.value);

        // Filter data by date range and update chart
        const filteredData = filterDataByDateRange(startDate, endDate);
        updateChart(filteredData, selectedAttributes);
    });

    // Listen for chart type and axis scale changes
    document.getElementById("axisScaleSelect").addEventListener("change", function() {
        const scaleType = document.getElementById("axisScaleSelect").value;
        updateAxisScale(scaleType);
    });
});
