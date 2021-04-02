import { Node } from './forceGraphTypes';

export interface User {
    id?: string;
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    pictureUrl?: string;
    isGridViewOn?: boolean;
}

export interface Symbiocreation {
    id?: string;
    name: string;
    place?: string;
    dateTime?: Date;
    timeZone?: string;
    hasStartTime?: boolean;

    description?: string;
    infoUrl?: string;
    tags?: string[];
    extraUrls?: string[];
    sdgs?: string[];

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
    isModerator: boolean;
}

export interface Idea {
    title?: string;
    description?: string;
    lastModified?: Date;
    imgPublicIds?: string[];
    externalUrls?: string[];
    comments?: Comment[];
}

export interface Comment {
    u_id: string;
    author?: User;
    content: string;
    lastModified?: Date;
}