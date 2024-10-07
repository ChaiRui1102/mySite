// Function to filter data based on selected filters
function filterData(data, year, sex) {
    return data.filter(d => {
        return (year === "All" || d.year_of_school === year) &&
               (sex === "All" || d.sex === sex);
    });
}

// Function to draw the chart with the filtered data
function drawChart(data) {
    // Remove the previous chart
    d3.select("#chart").selectAll("*").remove();

    // Set up chart dimensions
    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    // Create SVG container
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // X and Y scales
    const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.score)]).nice()
        .range([height - margin.bottom, margin.top]);

    // X axis
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    // Y axis
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    // Bars
    svg.append("g")
        .selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.score))
        .attr("height", d => y(0) - y(d.score))
        .attr("width", x.bandwidth())
        .attr("fill", "steelblue");
}

// Initial load of the CSV data and chart
d3.csv("data.csv").then(function(data) {
    let yearFilter = document.getElementById("yearFilter");
    let sexFilter = document.getElementById("sexFilter");

    // Draw the initial chart with all data
    drawChart(data);

    // Event listener for filter changes
    yearFilter.addEventListener("change", () => {
        let filteredData = filterData(data, yearFilter.value, sexFilter.value);
        drawChart(filteredData);
    });

    sexFilter.addEventListener("change", () => {
        let filteredData = filterData(data, yearFilter.value, sexFilter.value);
        drawChart(filteredData);
    });
});
