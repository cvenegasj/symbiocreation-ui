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

  constructor(
    private analyticsService: AnalyticsService
  ) {
    this.dimensions = {
      marginTop: 20,
      marginRight: 40,
      marginBottom: 30,
      marginLeft: 70,
      height: 280,
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
        // console.log(array);

        this.data = array;

        let accumulator = 0;
        this.data.forEach(item => {
          accumulator += item.count;
          item.count = accumulator;
        });

        console.log(this.data);
        
        this.cleanAndCreateChart();
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
        .attr("height", this.dimensions.height);
        //.style("border", "1px solid black");

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

    // // grid
    // // add the x gridlines
    // this.bounds.append("g")			
    //   .attr("class", "grid")
    //   .attr("transform", "translate(0," + this.dimensions.boundedHeight + ")")
    //   .call(xAxisGenerator
    //       .tickSize(-this.dimensions.boundedHeight!)
    //       .tickFormat(() => "")
    //   );

    // // add the y gridlines
    // this.bounds.append("g")			
    //   .attr("class", "grid")
    //   .call(yAxisGenerator
    //       .tickSize(-this.dimensions.boundedWidth!)
    //       .tickFormat(() => "")
    //   );

    // add the axes last
    // need to reinstantiate the generators
    xAxisGenerator = d3.axisBottom(xScale);
    yAxisGenerator = d3.axisRight(yScale)/*.tickArguments([5, '~s'])*/;

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
      .attr("class", "line")
      .attr("d", lineGenerator(this.data))
      .attr("fill", "none")
      //.attr("stroke", "#af9358")
      .attr("stroke-width", 1.8);
  }

}
