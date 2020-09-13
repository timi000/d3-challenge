var svgHeight =600;
var svgWeight=700;

var margin={
    top: 50,
    right:50,
    bottom:200, 
    left:100
};

var chartWidth=svgWeight-margin.left-margin.right;
var chartHeight = svgHeight-margin.top -margin.bottom; 

var svg=d3.select("#scatter")
    .append("svg")
    .attr("width", svgWeight)
    .attr("height", svgHeight)

var chartGroup =svg.append("g")
    .attr("transform",`translate(${margin.left}, ${margin.right})`)

var chosenXAxis="poverty"
var chosenYAxis="healthcareLow"


function xScale(cityData, chosenXAxis){
    var xLinearScale=d3.scaleLinear()
        .domain([d3.min(cityData, d=> d[chosenXAxis]), 
        d3.max(cityData, d=> d[chosenXAxis])])
        .range([0, chartWidth])
    return xLinearScale
}

function yScale(cityData, chosenYAxis){
    var yLinearScale=d3.scaleLinear()
        .domain([d3.min(cityData, d=> d[chosenYAxis]), 
        d3.max(cityData, d=> d[chosenYAxis])])
        .range([chartHeight,0])

    return yLinearScale
}

function renderXAxes(newXScale, xAxis){
    var bottomAxis = d3.axisBottom(newXScale)
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis)
     return xAxis
}


function renderYAxes(newYScale, yAxis){
    var leftAxis = d3.axisLeft(newYScale)
    yAxis.transition()
        .duration(1000)
        .call(leftAxis)
    return yAxis
}


function renderCircles(circlesGroup, newXScale, newYScale,chosenXAxis, chosenYAxis){
    circlesGroup.transition()
        .duration(1000)
        .attr("cx",d=> newXScale(d[chosenXAxis]))
        .attr("cy",d=> newYScale(d[chosenYAxis]))
        return circlesGroup
        
}

function renderText(abbrG,newXScale, newYScale,chosenXAxis, chosenYAxis ){
    abbrG.transition()
    .duration(1000)
    .text(d=>d.abbr)
    .attr("x", d=> newXScale(d[chosenXAxis]))
    .attr("y", d=>newYScale(d[chosenYAxis]) )

    return abbrG
}
function updateToolTip(chosenXAxis, chosenYAxis,circlesGroup){
    var xLabel;
    
    if(chosenXAxis=="poverty") {
    xLabel="Poverty(%):"
    }
    else if (chosenXAxis=="age"){
    xLabel="Age(Median):"
    }
    else{
    xLabel="Household Income (Median):"
    }

    var yLabel;
    if(chosenYAxis=="healthcareLow") {
        yLabel="Healthcare(%):"
    }
    else if (chosenYAxis=="obesityHigh"){
        yLabel="Obesity(%):"
    }
    else{
        yLabel="Smokers(%):"
    }


    var toolTip =d3.tip()
        .attr("class", "d3-tip")
        .offset([80,-60])
        .html(d=>{return `${d.state}<br> ${xLabel} ${d[chosenXAxis]} <br> ${yLabel} ${d[chosenYAxis]}`})

    circlesGroup.call(toolTip)
    circlesGroup.on("mouseover", d=>{
        toolTip.show(d, this)
    })
    .on("mouseout", d=> {
        toolTip.hide(d)
    })
    return circlesGroup

}




d3.csv("data.csv").then(function(cityData, err){
    if (err) throw err;
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
    
var xLinearScale=xScale(cityData, chosenXAxis)
console.log(xLinearScale)
var yLinearScale=yScale(cityData, chosenYAxis)

var bottomAxis=d3.axisBottom(xLinearScale)
var leftAxis=d3.axisLeft(yLinearScale)

var yAxis =chartGroup.append("g")
    .call(leftAxis);

var xAxis=chartGroup.append("g")
    .attr("transform", `translate(0,${chartHeight})`)
    .classed("x-axis", true)
    .call(bottomAxis);


var dot = chartGroup.selectAll("circle")
.data(cityData)
.enter()
.append("g")

var radius = 10
var circlesGroup= dot
    .append("circle")
    .attr("cx", d=> xLinearScale(d[chosenXAxis]) )
    .attr("cy", d=> yLinearScale(d[chosenYAxis]))
    .attr("r", radius)
    .classed("stateCircle", true)
    
    
var abbrG =dot
    .append("text")
    .text(d=>d.abbr)
    .classed("stateText", true)
    .attr("font-size","3px")
    .attr("x", d=> xLinearScale(d[chosenXAxis]))
    .attr("y", d=> yLinearScale(d[chosenYAxis]) )
    

var labelsXGroup=chartGroup.append("g")
.attr("transform", `translate(${chartWidth/2},${chartHeight+20})`);

var labelsYGroup =chartGroup.append("g")
.attr("transform", `translate(${chartWidth-margin.left/4},${chartHeight/2}) rotate(90)`)

var povertyLabel = labelsXGroup.append("text")
    .attr("x",0)
    .attr("y",20)
    .attr("value", "poverty")
    .classed("active", true)
    .text("In Poverty(%)")

var ageLabel = labelsXGroup.append("text")
    .attr("x",0)
    .attr("y",40)
    .attr("value", "age")
    .classed("active", true)
    .text("Age(Median)")
var incomeLabel = labelsXGroup.append("text")
    .attr("x",0)
    .attr("y",60)
    .attr("value", "income")
    .classed("active", true)
    .text("Household Income (Median)")

var labelsYGroup =chartGroup.append("g")
    

var healthcareLabel = labelsYGroup.append("text")
    .attr("x",0)
    .attr("y",0)
    .attr("transform", `translate(${0-margin.left/2.8},${chartHeight/2}) rotate(90)`)
    .attr("value", "healthcareLow")
    .classed("active", true)
    .text("Lacks Healthcare(%)")

var smokesLabel = labelsYGroup.append("text")
  .attr("transform", `translate(${0-margin.left/1.5},${chartHeight/2}) rotate(90)`)
    .attr("x",0)
    .attr("y",0)
    .attr("value", "smokesHigh")
    .classed("active", true)
    .text("smokes(%)")



var obesityLabel = labelsYGroup.append("text")
    .attr("transform", `translate(${0-margin.left},${chartHeight/2}) rotate(90)`)
    .attr("x",0)
    .attr("y",0)
    .attr("value", "obesityHigh")
    .classed("active", true)
    .text("obesity(%)")


    console.log(circlesGroup)
    console.log(chosenXAxis)
    console.log(chosenYAxis)

var circlesGroup=updateToolTip(chosenXAxis,chosenYAxis, circlesGroup)
console.log(circlesGroup)


labelsXGroup.selectAll("text")
    .on("click", function(){
       var  value = d3.select(this).attr("value")
console.log(value)
       if(value!=chosenXAxis){
           chosenXAxis=value
       
        xLinearScale=xScale(cityData, chosenXAxis)
        xAxis=renderXAxes(xLinearScale,xAxis)
        
        circlesGroup=renderCircles(circlesGroup,xLinearScale,yLinearScale,chosenXAxis,chosenYAxis)
        abbrG =renderText(abbrG,xLinearScale,yLinearScale,chosenXAxis, chosenYAxis )
        
        circlesGroup=updateToolTip(chosenXAxis, chosenYAxis,circlesGroup)

        if (chosenXAxis=="poverty"){
            povertyLabel.classed("active", true)
                .classed("inactive", false)
            ageLabel.classed("active", false)
                .classed("inactive", true)
            incomeLabel.classed("active", false)
                .classed("inactive", true)
        }
        if (chosenXAxis=="age"){
            povertyLabel.classed("active", false)
                .classed("inactive", true)
            ageLabel.classed("active", true)
                .classed("inactive", false)
            incomeLabel.classed("active", false)
                .classed("inactive", true)
        }
        if (chosenXAxis=="income"){
            povertyLabel.classed("active", false)
                .classed("inactive", true)
            ageLabel.classed("active", false)
                .classed("inactive", true)
            incomeLabel.classed("active", true)
                .classed("inactive", false)
        }

       }
    })


labelsYGroup.selectAll("text")
    .on("click", function(){
       var  yvalue = d3.select(this).attr("value")
console.log(yvalue)
       if(yvalue!=chosenYAxis){
           chosenYAxis=yvalue
       
        yLinearScale=yScale(cityData, chosenYAxis)
        yAxis=renderYAxes(yLinearScale,yAxis)
        console.log(chosenYAxis)
        console.log(chosenXAxis)
        console.log(xLinearScale)
        console.log(yLinearScale)
        console.log(circlesGroup)
        circlesGroup=renderCircles(circlesGroup,xLinearScale,yLinearScale,chosenXAxis,chosenYAxis)
        abbrG =renderText(abbrG,xLinearScale,yLinearScale,chosenXAxis, chosenYAxis )
        
        circlesGroup=updateToolTip(chosenXAxis, chosenYAxis,circlesGroup)

        if (chosenYAxis=="healthcareLow"){
            healthcareLabel.classed("active", true)
                .classed("inactive", false)
            obesityLabel.classed("active", false)
                .classed("inactive", true)
            smokesLabel.classed("active", false)
                .classed("inactive", true)
        }
        if (chosenYAxis=="obesityHigh"){
            healthcareLabel.classed("active", false)
                .classed("inactive", true)
            obesityLabel.classed("active", true)
                .classed("inactive", false)
            smokesLabel.classed("active", false)
                .classed("inactive", true)
        }
        if (chosenYAxis=="smokesHigh"){
            healthcareLabel.classed("active", false)
                .classed("inactive", true)
            obesityLabel.classed("active", false)
                .classed("inactive", true)
            smokesLabel.classed("active", true)
                .classed("inactive", false)
        }

       }
    })
      


}).catch(function(error) {
    console.log(error);})
  
