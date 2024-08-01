import { Id } from "../convex/_generated/dataModel";

export interface User {
    assignedElections?: string[];
    pastLogin?: number[];
    ip?: string[];
    _id: Id<"users">;
    _creationTime: number;
    username: string;
    password: string;
    type: string | 'voter' | 'administrator' | 'reporter' | 'moderator' | 'super';
    salt: string;
    key: string;
    email: string;
    city: string;
    state: string;
    zip: string;
    address: string;
    firstName: string;
    lastName: string;
};

export interface UserToCreate {
    username: string;
    password: string;
    type: string | 'voter' | 'administrator' | 'reporter' | 'moderator' | 'super';
    salt: string;
    key: string;
    email: string;
    city: string;
    state: string;
    zip: string;
    address: string;
    firstName: string;
    lastName: string;
};

export interface UserApi {
    success: boolean,
    users: User[]
};

export interface UserAuth {
    success: boolean
};

export interface UserContextType {
    user: User | null,
    setUser: React.Dispatch<React.SetStateAction<User | null>> | null,
    isAuthenticated: boolean
};

export interface ElectionInfo {
    success: boolean,
    info: {
        upcomingElections: number,
        openElections: number,
        closedElections: number
    }
};

export interface ElectionsStatus {
    success: true,
    elections: Election[]
};

export interface ElectionStatus {
    success: true,
    election: Election
};

export interface Election {
    election_id: string,
    title: string,
    description: string,
    options: string[],
    createdAt: number,
    opensAt: number,
    closesAt: number,
    owned: boolean,
    deleted: boolean,
    type: "irv" | "cpl"
};

export interface CreateElection {
    title: string,
    type: string | 'irv' | 'cpl',
    description: string,
    options: string[],
    opensAt: number,
    closesAt: number
};

export interface OptionRankings {
    name: string,
    rank1Votes: number,
    rank2Votes: number,
    rank3Votes: number
};

export interface Ballots {
    voter_id: string,
    ranking: { rank: number }
};

export interface GetSingleBallotType {
    success: boolean,
    ballot: {
        voter_id: string,
        ranking: { rank: number }
    }
};

export interface GetBallotsResponse {
    success: boolean,
    ballots: Ballots[]
};

export interface EditElection{
    title: string;
    description: string;
    type: string | "irv" | "cpl";
    options: string[];
    opensAt: number;
    closesAt: number;
};

export type Direction = "prev" | "next";

export type History = {
    elections: Election[],
    prev: string | undefined,
    next: string | undefined,
    page: number
};

export type UseElectionHistoryReturn = {
    elections: Election[];
    isLoading: boolean;
    isErroring: boolean;
};
