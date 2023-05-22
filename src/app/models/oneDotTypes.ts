import { User } from "./symbioTypes";

export interface OneDot {
    id?: string;
    name: string;
    grid: number[][];
    participants: OneDotParticipant[];
    screenshots: number[][][]; 
}

export interface OneDotParticipant {
    u_id: string;
    user?: User;
}