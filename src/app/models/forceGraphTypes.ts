import * as d3Force from 'd3-force';
import { User, Idea } from './symbioTypes';
 
export interface Node extends d3Force.SimulationNodeDatum {
    id?: string;
    u_id?: string;
    user?: User;
    role?: string;
    name?: string;
    idea?: Idea;
    
    height?: number;
    r?: number;
    color?: string;

    parent?: Node;
    children?: Node[];

    links?: Link[];
    fx?: number;
    fy?: number;
}

export interface Link extends d3Force.SimulationLinkDatum<Node> {
    //value: number;
    height?: number;
}

export interface Graph {
    nodes: Node[];
    links: Link[];
}