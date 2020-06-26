import { Node } from './forceGraphTypes';

export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface Symbiocreation {
    id?: string;
    name: string;
    lastModified?: Date;
    enabled?: boolean;
    visibility?: string;
    participants?: Participant[];
    graph?: Node[];
    nparticipants?: number;
}

export interface Participant {
    u_id: string;
    user?: User;
    role: string;
    idea?: Idea;
    //groupName?: string;
}

export interface Idea {
    title?: string;
    description?: string;
    lastModified?: Date;
    //photoURL?: string;
    imgPublicId?: string;
}