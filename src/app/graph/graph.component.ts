import { Component, OnInit, Input, ViewChild, ElementRef, AfterContentInit, OnChanges, SimpleChanges, HostListener, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { SidenavService } from '../services/sidenav.service';
import { MatSidenav } from '@angular/material/sidenav';
import * as d3 from "d3"
import { DimensionsType } from '../utils/types';
import { Node, Link } from '../models/forceGraphTypes';
import { MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from '../services/auth.service';
import { SymbiocreationService } from '../services/symbiocreation.service';

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
  nodeSelected: Node;

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

    // draw links
    this.linkElements = this.linkGroup
      .selectAll('line')
      .data(this.links);
    
    this.linkElements.exit().remove();

    const linkEnter = this.linkElements
      .enter()
      .append("line");

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
        .attr("fill", d => d.children ? "#fff" : "#FF4081")
        .attr("stroke", d => d.children ? "#C51162" : "#fff")
        .attr("stroke-width", 1.5)
        .attr('r', d => d.children ? 10 : 8)
        .on('click', d => this.openIdeaDetailSidenav(d.id))
        .on('contextmenu', d => this.openNodeContextMenu(d));

    nodeEnter.append("text")
        .text(d => d.name)
        .attr('x', -9)
        .attr('y', -11);

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

    function recurse(node: Node) {
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
    //console.log(childId, parentId);
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

}
