// @TODO: YOUR CODE HERE!
var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 60,
  bottom: 80,
  left: 60
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
console.log(width)

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {

    console.log(healthData);

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d.poverty*0.9), d3.max(healthData, d => d.poverty*1.1)])
      .range([0, width]);
    // console.log(d3.min(healthData, d => d.poverty))
    // console.log(d3.max(healthData, d => d.poverty))

    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d.healthcare*0.5), d3.max(healthData, d => d.healthcare*1.1)])
    // .domain([0, 26])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

    chartGroup.append("g")
    .call(yAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")
    .attr("class","stateCirlce")
    .attr("fill", "LightSteelBlue")
    .attr("stroke-width", "1")
    .attr("stroke", "white");

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`<strong>${d.state}<hr>Poverty:${d.poverty}%<hr>Healthcare:${d.healthcare}%<strong>`
      );
    });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
    })
    
    .on("mouseout", function(d) {
      toolTip.hide(d);
    });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("Lacks Healthcare");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
      .attr("class", "aText")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });
