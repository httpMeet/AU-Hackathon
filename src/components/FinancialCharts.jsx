import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import dummyData from '../data/dummy.json';

const FinancialCharts = () => {
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    // Clear existing charts
    d3.select(pieChartRef.current).selectAll("*").remove();
    d3.select(barChartRef.current).selectAll("*").remove();

    // Create Pie Chart
    createPieChart();
    
    // Create Bar Chart
    createBarChart();
  }, []);

  const createPieChart = () => {
    const width = 400;
    const height = 400;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(pieChartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width/2}, ${height/2})`);

    const color = d3.scaleOrdinal()
      .domain(dummyData.income_distribution.map(d => d.category))
      .range(d3.schemeCategory10);

    const pie = d3.pie()
      .value(d => d.amount);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    // Add tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    // Create the pie chart
    const arcs = svg.selectAll("arc")
      .data(pie(dummyData.income_distribution))
      .enter()
      .append("g");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.category))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .on("mouseover", function(event, d) {
        tooltip.style("visibility", "visible")
          .html(`${d.data.category}: ₹${d.data.amount.toLocaleString()}`);
      })
      .on("mousemove", function(event) {
        tooltip.style("top", (event.pageY-10)+"px")
          .style("left",(event.pageX+10)+"px");
      })
      .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
      });

    // Add labels
    arcs.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text(d => d.data.category);
  };

  const createBarChart = () => {
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(barChartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .domain(dummyData.monthly_expenses.map(d => d.month))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(dummyData.monthly_expenses, d => d.amount)])
      .nice()
      .range([innerHeight, 0]);

    // Add tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    // Add bars
    svg.selectAll("rect")
      .data(dummyData.monthly_expenses)
      .enter()
      .append("rect")
      .attr("x", d => x(d.month))
      .attr("y", d => y(d.amount))
      .attr("width", x.bandwidth())
      .attr("height", d => innerHeight - y(d.amount))
      .attr("fill", "#4f46e5")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "#6366f1");
        tooltip.style("visibility", "visible")
          .html(`Month: ${d.month}<br/>Amount: ₹${d.amount.toLocaleString()}`);
      })
      .on("mousemove", function(event) {
        tooltip.style("top", (event.pageY-10)+"px")
          .style("left",(event.pageX+10)+"px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", "#4f46e5");
        tooltip.style("visibility", "hidden");
      });

    // Add axes
    svg.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d => `₹${d/1000}K`));

    // Add labels
    svg.append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -innerHeight / 2)
      .attr("text-anchor", "middle")
      .text("Monthly Expenses (₹)");
  };

  return (
    <div className="p-4 space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Income Distribution</h2>
        <div ref={pieChartRef} className="flex justify-center"></div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Expenses</h2>
        <div ref={barChartRef} className="flex justify-center"></div>
      </div>
    </div>
  );
};

export default FinancialCharts; 