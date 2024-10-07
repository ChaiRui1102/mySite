d3.csv("/download").then(function(data) {
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
});
