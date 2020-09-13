// @TODO: YOUR CODE HERE!
var svgHeight =600;
var svgWeight=600;

var margin={
    top: 50,
    right:20,
    bottom:50, 
    left:20
};

var chartWidth=svgWeight-margin.left-margin.right;
var chartHeight = svgHeight-margin.top -margin.bottom; 

var svg=d3.select("#scatter")
    .append("svg")
    .attr("width", svgWeight)
    .attr("height", svgHeight)


var chartGroup =svg.append("g")
    .attr("transform",`translate(${margin.left}, ${margin.right})`)


d3.csv("data.csv").then(cityData=>{
   
    cityData.forEach(function(d){
        d.poverty=+d.poverty
        d.povertyMoe=+d.povertyMoe
        d.age=+d.age
        d.ageMoe=+d.ageMoe
        d.income=+d.income
        d.incomeMoe=+d.incomeMoe
        d.healthcare=+d.healthcare
        d.healthcareLow=+d.healthcareLow
        d.healthcareHigh=+d.healthcareHigh
        d.obesity=+d.obesity
        d.obesityLow=+d.obesityLow
        d.obesityHigh=+d.obesityHigh
        d.smokes=+d.smokes
        d.smokesLow=+d.smokesLow
        d.smokesHigh=+d.smokesHigh

    })
    console.log(cityData)
    var xScale = d3.scaleLinear()
        .domain([d3.min(cityData, data=>data.poverty)*0.9,d3.max(cityData, data=>data.poverty)*1.1])
        .range([0, chartWidth]);

    var yScale = d3.scaleLinear()
        .domain([d3.min(cityData, data=>data.healthcareLow)*0.9, d3.max(cityData, data=>data.healthcareLow)*1.1])
        .range([ chartHeight, 0]);
       console.log( d3.extent(cityData, data=>data.healthcareLow))
    var bottomAxis =d3.axisBottom(xScale);
    var leftAxis =d3.axisLeft(yScale);

    chartGroup.append("g")
    .call(leftAxis);

    chartGroup.append("g")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(bottomAxis);

 
var gdots =  chartGroup.selectAll("circle")
    .data(cityData)
    .enter().append('g')



var radius = 10
    
    gdots.append("circle")
      .attr("cx", d=> xScale(d.poverty) )
      .attr("cy", d=> yScale(d.healthcareLow))
      .attr("r", radius)
      .classed("stateCircle", true)
    


    gdots.append("text").text(d=>d.abbr)
    .classed("stateText", true)
    .attr("font-size","5px")

    .attr("x", d=> xScale(d.poverty))
    .attr("y", d=> yScale(d.healthcareLow) );





})
