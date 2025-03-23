import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import financialData from '../data/dummy.json';

const FinancialCharts = () => {
  const chartRefs = {
    expenses: useRef(null),
    profitLoss: useRef(null),
    investments: useRef(null),
    bankAccounts: useRef(null),
    assets: useRef(null),
  };
  
  useEffect(() => {
    Object.values(chartRefs).forEach(ref => d3.select(ref.current).selectAll("*").remove());

    createPieChart(chartRefs.expenses, Object.entries(financialData.users[0].expenses), "Expenses Distribution");
    createBarChart(chartRefs.profitLoss, [
      { label: 'Revenue', value: financialData.users[0].annual_revenue },
      { label: 'Expenses', value: financialData.users[0].expenses.total_expenses },
      { label: 'Profit', value: financialData.users[0].business_income }
    ], "Profit/Loss Overview");
    createPieChart(chartRefs.investments, [
      ...financialData.users[0].investments.stocks.map(s => [s.company, s.stocks_owned * s.purchase_price]),
      ...financialData.users[0].investments.mutual_funds.map(mf => [mf.fund_name, mf.investment_amount]),
      ["Real Estate", financialData.users[0].investments.real_estate[0].value],
      ["Gold Bonds", financialData.users[0].investments.gold_bonds[0].grams * financialData.users[0].investments.gold_bonds[0].purchase_price]
    ], "Investment Breakdown");
    createPieChart(chartRefs.bankAccounts, Object.entries(financialData.users[0].bank_accounts).map(([key, val]) => [key, val.balance || (val.amount || 0)]), "Bank Account Distribution");
    createPieChart(chartRefs.assets, financialData.users[0].inventory.categories.map(c => [c.category, c.value]), "Assets Inventory");
  }, []);

  const createPieChart = (ref, data, title) => {
    const width = 400, height = 400, margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(ref.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal().domain(data.map(d => d[0])).range(d3.schemeCategory10);

    const pie = d3.pie().value(d => d[1]);
    const arc = d3.arc().innerRadius(50).outerRadius(radius);

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "#fff")
      .style("padding", "5px 10px")
      .style("border-radius", "5px");

    svg.selectAll("arc")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data[0]))
      .style("stroke", "#fff").style("stroke-width", "2px")
      .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible").text(`${d.data[0]}: ₹${d.data[1]}`);
      })
      .on("mousemove", (event) => {
        tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", () => tooltip.style("visibility", "hidden"));

    // Legend
    const legend = svg.append("g").attr("transform", `translate(-${width / 2.5}, ${height / 2.5})`);
    data.forEach((d, i) => {
      legend.append("rect")
        .attr("x", 10)
        .attr("y", i * 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color(d[0]));

      legend.append("text")
        .attr("x", 30)
        .attr("y", i * 20 + 12)
        .text(d[0])
        .style("font-size", "14px")
        .style("fill", "#333");
    });
  };

  const createBarChart = (ref, data, title) => {
    const width = 500, height = 400, margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(data.map(d => d.label)).range([0, innerWidth]).padding(0.3);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).nice().range([innerHeight, 0]);

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "#fff")
      .style("padding", "5px 10px")
      .style("border-radius", "5px");

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.label))
      .attr("y", innerHeight)
      .attr("width", x.bandwidth())
      .attr("fill", "#4f46e5")
      .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible").text(`${d.label}: ₹${d.value}`);
      })
      .on("mousemove", (event) => {
        tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", () => tooltip.style("visibility", "hidden"))
      .transition().duration(800)
      .attr("y", d => y(d.value))
      .attr("height", d => innerHeight - y(d.value));

    svg.append("g").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y).ticks(5));
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Expenses</h2>
        <div ref={chartRefs.expenses}></div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Profit/Loss</h2>
        <div ref={chartRefs.profitLoss}></div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Investments</h2>
        <div ref={chartRefs.investments}></div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Bank Accounts</h2>
        <div ref={chartRefs.bankAccounts}></div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Assets</h2>
        <div ref={chartRefs.assets}></div>
      </div>
    </div>
  );
};

export default FinancialCharts;
