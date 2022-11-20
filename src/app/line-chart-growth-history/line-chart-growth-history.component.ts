import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';
import { DimensionsType } from '../utils/types';

import * as d3 from "d3";

@Component({
  selector: 'app-line-chart-growth-history',
  templateUrl: './line-chart-growth-history.component.html',
  styleUrls: ['./line-chart-growth-history.component.css']
})
export class LineChartGrowthHistoryComponent implements OnInit {

  @ViewChild('chartContainer', {static: true}) 
  chartContainer!: ElementRef;

  dimensions: DimensionsType;
  wrapper: any;
  bounds: any;
  lines: any;

  data: any[] = [];
  legendTitle: string = "Total Simbiocreaciones"
  lineClass: string = "line-1";  

  constructor(
    private analyticsService: AnalyticsService
  ) {
    this.dimensions = {
      marginTop: 20,
      marginRight: 45,
      marginBottom: 20,
      marginLeft: 40,
      height: 240,
      width: 600,
    }
    this.dimensions = {
      ...this.dimensions, 
      boundedHeight: Math.max(this.dimensions.height - this.dimensions.marginTop - this.dimensions.marginBottom, 0),
      boundedWidth: Math.max(this.dimensions.width - this.dimensions.marginLeft - this.dimensions.marginRight, 0),
    }
  }

  ngOnInit(): void {
    this.analyticsService.getSymbioCountsDaily()
      .subscribe(array => {
        //console.log(array);
        this.setLineChartData(array);
        //console.log(this.data);
        this.cleanAndCreateChart();
      });
  }

  setLineChartData(array: any[]): void {
    this.data = [];
    this.data = array;
    let accumulator = 0;

    this.data.forEach(item => {
      accumulator += item.count;
      item.count = accumulator;
    });
  }

  cleanAndCreateChart(): void {
    // remove any pre-existing chart
    if (this.wrapper) {
      this.wrapper.remove();
    }

    // SVG container
    this.wrapper = d3.select(this.chartContainer.nativeElement)
      .append("svg")
        .attr("width", this.dimensions.width)
        .attr("height", this.dimensions.height)
        .style("-webkit-tap-highlight-color", "transparent");
        // .style("border", "1px solid black");

    // inner g
    this.bounds = this.wrapper
      .append("g")
        .attr("transform", `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);

    const dateParser = d3.timeParse("%Y-%m-%d"); 
    const xAccessor = d => dateParser(d._id);
    const yAccessor = d => d.count;

    // scales
    const xScale = d3.scaleTime()
                    .domain(d3.extent(this.data, xAccessor))
                    .range([0, this.dimensions.boundedWidth]);
    const yScale = d3.scaleLinear()
                    .domain(d3.extent(this.data, yAccessor))
                    .range([this.dimensions.boundedHeight, 0]);

    // axes
    let xAxisGenerator = d3.axisBottom(xScale);
    let yAxisGenerator = d3.axisRight(yScale)/*.tickArguments([5, '~s'])*/;

    // line
    const lineGenerator = d3.line()
      .x((d: any) => xScale(xAccessor(d)))
      .y((d: any) => yScale(yAccessor(d)));

    // add the axes last
    // need to reinstantiate the generators
    xAxisGenerator = d3.axisBottom(xScale);
    yAxisGenerator = d3.axisRight(yScale).tickFormat(d3.format(".0f"));

    const xAxis = this.bounds
      .append("g")
        .attr("class", "axis")
        .call(xAxisGenerator)
        .style("transform", `translateY(${this.dimensions.boundedHeight}px)`);
  
    const yAxis = this.bounds
      .append("g")
        .attr("class", "axis")
        .call(yAxisGenerator)
        .style("transform", `translateX(${this.dimensions.boundedWidth}px)`);

    // // Draw lines at the end. One line per dataset
    // this.lines = this.bounds
    //   .selectAll("lines")
    //   .data()
    //   .enter()
    //   .append("g");

    this.bounds.append("path")
      .attr("class", this.lineClass)
      .attr("d", lineGenerator(this.data))
      .attr("fill", "none")
      //.attr("stroke", "#af9358")
      .attr("stroke-width", 1.8);

    // legend
    const legendGroup = this.wrapper.append("g")
                                      .attr("transform", `translate(${ 20 }, ${ 30 })`);
    const legendTitle = legendGroup.append("text")
                                      //.attr("y", -10)
                                      .attr("class", "legend-title")
                                      .text(this.legendTitle);
    const legendSubtitle = legendGroup.append("text")
                            .attr("class", "legend-subtitle")
                            //.attr("x", legendWidth / 2 + 10)
                            .attr("y", 25)
                            .text(yAccessor(this.data[this.data.length - 1]));
    const legendDate = legendGroup.append("text")
                            .attr("class", "legend-date")
                            //.attr("x", -legendWidth / 2 - 10)
                            .attr("y", 43)
                            .text("");
                            //.style("text-anchor", "end");

    const mouseG = this.bounds.append("g");

    mouseG.append("path")
            .attr("class", "mouse-line")
            .style("stroke", "#cdcbcb")
            .style("stroke-width", 1.6)
            .style("opacity", "0");

    mouseG.append("rect")
            .attr("class", "overlay")
            .attr("fill", "none")
            .attr("width", this.dimensions.boundedWidth)
            .attr("height", this.dimensions.boundedHeight)
            .on("touchstart", (event: any) => event.preventDefault())
            .on("mouseover", () => {
              d3.select(".mouse-line").style("opacity", "1");
            })
            .on("mouseout", () => {
              d3.select(".mouse-line").style("opacity", "0");

              legendSubtitle.text(yAccessor(this.data[this.data.length - 1]));
              legendDate.text("");
            })
            .on("mousemove", () => {
              let mouseRelativePosition = d3.mouse(d3.event.currentTarget);
              // console.log(mouseRelativePosition);

              mouseG.select(".mouse-line")
                      .attr("d", () => {
                        const xDate = xScale.invert(mouseRelativePosition[0]);
                        const bisect = d3.bisector((d: any) => xAccessor(d)).left;
                        const i = bisect(this.data, xDate);
                        //console.log("i: " + i);

                        legendSubtitle.text(yAccessor(this.data[i]));
                        legendDate.text(xAccessor(this.data[i]).toLocaleDateString());

                        const scaledXValue = xScale(xAccessor(this.data[i]));
                        let data = `M${scaledXValue},${this.dimensions.boundedHeight} ${scaledXValue},0`;

                        //console.log(data);
                        return data;
                      });
            });
  }

  onDataSelectorChange(value: number): void {
    switch (value) {
      case 0:
        console.log(0);
        this.showSymbiocreationsGrowthLineChart();
        break;
      case 1:
        console.log(1);
        this.showUsersGrowthLineChart();
        break;
    }
  }

  showSymbiocreationsGrowthLineChart(): void {
    this.legendTitle = "Total Simbiocreaciones";
    this.lineClass = "line-1";

    this.analyticsService.getSymbioCountsDaily().subscribe(array => {
      this.setLineChartData(array);
      this.cleanAndCreateChart();
    });
  }

  showUsersGrowthLineChart(): void {
    this.legendTitle = "Total Usuarios";
    this.lineClass = "line-2";

    this.analyticsService.getUserCountsDaily().subscribe(array => {
      this.setLineChartData(array);
      this.cleanAndCreateChart();
    });
  }
}
