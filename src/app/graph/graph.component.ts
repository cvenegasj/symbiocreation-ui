import { Component, OnInit, Input, ViewChild, ElementRef, AfterContentInit, OnChanges, SimpleChanges, HostListener, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { SidenavService } from '../services/sidenav.service';
import * as d3 from "d3"
import { DimensionsType } from '../utils/types';
import { Node, Link } from '../models/forceGraphTypes';
import { MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from '../services/auth.service';
import { SymbiocreationService } from '../services/symbiocreation.service';
import { SharedService } from '../services/shared.service';

import { Queue } from '../utils/queue';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, AfterContentInit, AfterViewInit, OnChanges {

  @ViewChild('nodeMenuTrigger') nodeMenuTrigger: MatMenuTrigger;
  @Output() parentChanged = new EventEmitter<string[]>();
  @Output() nodeDeleted = new EventEmitter<string>();
  @Output() nodeChangedName = new EventEmitter<string>();
  @Output() nodeChangedIdea = new EventEmitter<string>();

  roleOfLoggedIn: string;
  //nodeSelected: Node;

  menuX: number = 0;
  menuY: number = 0;

  @Input() data: Node[];
  groups: Node[];
  dimensions: DimensionsType;

  nodes: Node[];
  links: Link[];

  simulation: any;
  wrapper: any;
  bounds: any;
  g_zoomable: any;

  nodeElements: any;
  linkElements: any;
  textElements: any;

  nodeGroup: any;
  linkGroup: any;
  textGroup: any;
  //public formatDate: (date: object) => string = d3.timeFormat("%-b %-d")
  //public gradientId: string = getUniqueId("Timeline-gradient")
  //public gradientColors: string[] = ["rgb(226, 222, 243)", "#f8f9fa"]
  @ViewChild('container', {static: true}) container: ElementRef;

  constructor(
    private sidenav: SidenavService,
    private auth: AuthService,
    private symbioService: SymbiocreationService,
    private sharedService: SharedService,
    private router: Router, 
    private route: ActivatedRoute,
  ) {
    this.links = [];
    this.nodes = [];
    this.dimensions = {
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      height: 465,
      width: 600,
    }
    this.dimensions = {
      ...this.dimensions, 
      boundedHeight: Math.max(this.dimensions.height - this.dimensions.marginTop - this.dimensions.marginBottom, 0),
      boundedWidth: Math.max(this.dimensions.width - this.dimensions.marginLeft - this.dimensions.marginRight, 0),
    }
    this.groups = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    // remove, create, run
    if (!changes['data'].isFirstChange()) {
      this.removeChart();
      this.createChart();
      this.runSimulation();
      this.groups = this.getGroups(this.data);
    }
  }

  ngOnInit() {
    //this.updateDimensions();
  }

  ngAfterContentInit() {
    //this.updateDimensions();
  }

  ngAfterViewInit() {
    this.updateDimensions(); // called here to have the % dimensions calculated
    
    this.createChart();
    if (this.data?.length) {
      this.runSimulation();
      this.groups = this.getGroups(this.data);
    }
  }

  createChart() {
    // create chart
    this.wrapper = d3.select(this.container.nativeElement)
      .append("svg")
        .attr("width", this.dimensions.width)
        .attr("height", this.dimensions.height)
        .call(d3.zoom().scaleExtent([0.3, 3]).on("zoom", this.zoomed))
        .on("dblclick.zoom", null);
        
    this.bounds = this.wrapper.append("g")
        .attr("transform", 'translate(' + this.dimensions.marginLeft + 'px, ' + this.dimensions.marginTop + 'px)');

    this.linkGroup = this.bounds.append('g').attr('class', 'links');
    this.nodeGroup = this.bounds.append('g').attr('class', 'nodes');
  }

  runSimulation() {
    //const root = d3.hierarchy(this.data);
    this.links = this.getLinks(this.data);
    //const nodes = root.descendants();
    this.nodes = this.getNodes(this.data);
    //const links = d3.hierarchy(this.data).links();
    //console.log('Computed nodes: ', this.nodes);
    //console.log('Computed links: ', this.links);

    this.simulation = d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink(this.links).id((d: any) => d.id).distance(55)) // d is for node, useful to set ids of source and target: default to node.id, then node.index
      .force('charge', d3.forceManyBody().strength(-40))
      .force('center', d3.forceCenter(this.dimensions.width / 2, this.dimensions.height / 2));

    // get the maximum height of any node, which must belong to a root-level node
    let maxNodeHeight = 0;
    for (let node of this.data) {
      let temp = this.getNodeHeight(node);
      if (temp > maxNodeHeight) maxNodeHeight = temp;
    }

    // draw links
    this.linkElements = this.linkGroup
      .selectAll('line')
      .data(this.links);
    
    this.linkElements.exit().remove();

    const linkEnter = this.linkElements
      .enter()
      .append("line")
        .style("stroke-width", d => (6 - 0.8) * (d.source.height / maxNodeHeight) + 0.8);

    this.linkElements = linkEnter.merge(this.linkElements);
    
    // draw nodes
    this.nodeElements = this.nodeGroup
      .selectAll('g')
      .data(this.nodes);
      
    this.nodeElements.exit().remove();

    const nodeEnter = this.nodeElements
      .enter()
      .append("g");

    nodeEnter.append("circle")
        //.attr("fill", d => d.children ? "#fff" : "#FF4081")
        //.attr("stroke", d => d.children ? "#C51162" : "#fff")
        .attr("fill", d => this.getGradientColor(d.height, maxNodeHeight, "#FFFFFF", "#FF4081"))
        .attr("stroke", d => d.children ? this.getDarkerColor(this.getGradientColor(d.height, maxNodeHeight, "#FFFFFF", "#FF4081")) : "#cccccc")
        .attr("stroke-width", 1.5)
        .attr('r', d => this.getGradientRadius(d.height, maxNodeHeight, 8, 25))
        .on('click', d => this.openIdeaDetailSidenav(d.id))
        .on('contextmenu', d => this.openNodeContextMenu(d));

    nodeEnter.append("text")
        .text(d => d.name)
        .attr('x', d => d.children ? -9 : -9)
        .attr('y', d =>  d.children ? -14: -10);

    this.nodeElements = nodeEnter.merge(this.nodeElements);

    this.simulation.on('tick', () => {
        this.linkElements
          .attr("x1", d => (<Node>d.source).x)
          .attr("y1", d => (<Node>d.source).y)
          .attr("x2", d => (<Node>d.target).x)
          .attr("y2", d => (<Node>d.target).y);
        this.nodeElements
          .attr("transform", d => "translate(" + d.x + "," + d.y + ")");
      });
  }

  removeChart() {
    this.wrapper.remove();
  }

  getNodes(data: Node[]): Node[] {
    let nodes: Node[] = [];
    //let i = 0;
    let that = this;

    function recurse(node: Node) {
      node.height = that.getNodeHeight(node);

      if (node.children) node.children.forEach(recurse);
      //if (!node.id) node.id = ++i;
      nodes.push(node);
    }
    // data can have many nodes at root level
    for (let n of data) {
      recurse(n);
    }
  
    return nodes;
  }

  getLinks(data: Node[]): Link[] {
    let links: Link[] = [];

    function recurse(node: Node) {
      if (node.children) {
        node.children.forEach(child => {
          let l: Link = {source: node, target: child};
          links.push(l);
          recurse(child);
        });
      }
    }

    for (let n of data) {
      recurse(n);
    }
    
    return links;
  }

  getGroups(data: Node[]): Node[] {
    let groups: Node[] = [];

    function recurse(node: Node) {
      if (node.children) {
        groups.push(node);
        node.children.forEach(recurse);
      } 
    }
    // data can have many nodes at root level
    for (let n of data) {
      recurse(n);
    }
    return groups;
  }

  zoomed = () => {
    this.bounds.attr("transform", d3.event.transform);
  }

  toggleChildren(d) {
    /*if (d3.event.defaultPrevented) return; // ignore drag
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }*/
    // updateGraph();
  }

  @HostListener('window:resize') windowResize() {
    this.updateDimensions();
    this.wrapper
        .attr("width", this.dimensions.width)
        .attr("height", this.dimensions.height);

    this.runSimulation();
  }

  updateDimensions() {
    const width = this.container.nativeElement.offsetWidth; // take full width and height of container
    const height = this.container.nativeElement.offsetHeight; 
    //console.log(height);

    this.dimensions.width = width;
    this.dimensions.height = height;
    this.dimensions.boundedWidth = Math.max(
      this.dimensions.width
        - this.dimensions.marginLeft
        - this.dimensions.marginRight,
      0
    );
    this.dimensions.boundedHeight = Math.max(
      this.dimensions.height
        - this.dimensions.marginTop
        - this.dimensions.marginBottom,
      0
    );
  }

  openIdeaDetailSidenav(idNode: string) {
    this.sharedService.nextRole(this.roleOfLoggedIn);

    this.router.navigate(['idea', idNode], {relativeTo: this.route});
    this.sidenav.open();
  }

  openNodeContextMenu(node: Node) {
    if (!this.auth.loggedIn) return;
    d3.event.preventDefault();
    this.menuX = d3.event.x - 10;
    this.menuY = d3.event.y - 50;
    this.nodeMenuTrigger.menuData = {node: node};
    this.nodeMenuTrigger.openMenu();
  }

  setParentNode(childId: string, parentId: string) {
    this.parentChanged.emit([childId, parentId]);
  }

  filterGroups(groups: Node[], node: Node): Node[] {
    return groups.filter(g => g.id !== node.id);
  }

  deleteNode(node: Node) {
    this.nodeDeleted.emit(node.id);
  }

  changeNameNode(node: Node) {
    this.nodeChangedName.emit(node.id);
  }

  changeIdeaNode(node: Node) {
    this.nodeChangedIdea.emit(node.id);
  }


  /************ Helper functions ************/

  // BFS
  getNodeHeight(node: Node): number {
    let height = 0;

    let queue = new Queue<Node>();
    queue.add(node);
    let current: Node;

    while (!queue.isEmpty()) {
      current = queue.pop();

      if (current.children) {
        height +=1 ;
        current.children.forEach(child => queue.add(child));
      }
    }

    return height;
  }

  getGradientColor(height: number, maxHeight: number, from: string, to: string): string {
    let start = this.convertToRGB(from);    
    let end = this.convertToRGB(to);
    let diff = [0, 0, 0];
    diff[0] = end[0] - start[0];
    diff[1] = end[1] - start[1];
    diff[2] = end[2] - start[2];

    if (maxHeight === 0) return from;

    let color = [0, 0, 0];
    color[0] = diff[0] * (height / maxHeight) + start[0];
    color[1] = diff[1] * (height / maxHeight) + start[1];
    color[2] = diff[2] * (height / maxHeight) + start[2];

    return '#' + this.convertToHex(color);
  } 

  getDarkerColor(color: string): string {
    let colorRGB = this.convertToRGB(color);  

    colorRGB[0] -= 55;
    colorRGB[1] -= 55;
    colorRGB[2] -= 55;

    return '#' + this.convertToHex(colorRGB);
  }

  getGradientRadius(height: number, maxHeight: number, from: number, to: number): number {
    if (maxHeight === 0) return from;
    
    const diff = to - from;
    return diff * (height / maxHeight) + from;
  }

  hex(c): string {
    var s = "0123456789abcdef";
    var i = parseInt(c);
    if (i == 0 || isNaN(c))
      return "00";
    i = Math.round(Math.min(Math.max(0, i), 255));

    return s.charAt((i - i % 16) / 16) + s.charAt (i % 16);
  }
  
  /* Convert an RGB triplet to a hex string */
  convertToHex(rgb: number[]): string {
    return this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]);
  }
  
  /* Remove '#' in color hex string */
  trim(s): string { return (s.charAt(0) == '#') ? s.substring(1, 7) : s }
  
  /* Convert a hex string to an RGB triplet */
  convertToRGB(hex): number[] {
    var color = [];
    color[0] = parseInt((this.trim(hex)).substring(0, 2), 16);
    color[1] = parseInt((this.trim(hex)).substring(2, 4), 16);
    color[2] = parseInt((this.trim(hex)).substring(4, 6), 16);
    return color;
  }

}
