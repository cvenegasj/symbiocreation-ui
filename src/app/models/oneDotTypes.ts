import { User } from "./symbioTypes";

export interface OneDot {
    id?: string;
    name: string;
    grid: number[][];
    participants: OneDotParticipant[];
    screenshots: number[][][]; 

    createdAt?: Date;
    lastModifiedAt?: Date;
}

export interface OneDotParticipant {
    u_id: string;
    user?: User;
}