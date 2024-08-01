import { useEffect, useState } from "react";
import { EditElection, Election, ElectionStatus, ElectionsStatus } from "../type.ts";
import CacheFetch from "./useCacheFetch.ts";
import { convertBallots } from "../utils/utils.ts";
import IRVElections from "../algo/IRV-Elections.ts";
import CPLElections from "../algo/CPL-Elections.ts";
const url: string = import.meta.env.VITE_API_URL;
const APIKey: string = import.meta.env.VITE_API_KEY;
const options = {
    method: "GET",
    headers: {
        'Authorization': APIKey,
        'content-type': 'application/json'
    }
};
export default async function getAllElections(notFiltered = false): Promise<Election[]> {
    // const timeout = (fn, time) => {
    //     new Promise(resolve => setTimeout(resolve, time));
    // };

    let AllElections: Election[] = [];
    let hasMoreElections = true;
    let after = '';
    while (hasMoreElections) {
        const data: ElectionsStatus = await CacheFetch(url + `elections?after=${after}`, options);
        const elections = data.elections;
        hasMoreElections = elections?.length == 100;
        AllElections = [...AllElections, ...elections];
        after = elections[elections.length - 1].election_id;
    }
    const filteredElections = AllElections.filter(election => election.owned === true);
    return notFiltered ? AllElections : filteredElections;
};
export function UseSingleElection(id: string) {
    // console.warn("Error With UseSingleElection: ", error);
    const [election, setElection] = useState<Election | undefined>(undefined);

    useEffect(() => {
        async function fetchData() {
            const singleElection: ElectionStatus = await CacheFetch(url + `elections/${id}`, options);
            setElection(singleElection.election);
        }
        fetchData();
    }, [id]);
    return election;
};
export async function useEditElection(election_id: string, formValues: EditElection) {
    const optionsEditElection = {
        method: "PATCH",
        headers: {
            "Authorization": APIKey,
            "content-type": "application/json"
        },
        body: JSON.stringify(formValues)
    };
    return await fetch(`${url}elections/${election_id}`, optionsEditElection);
};
export async function useDeleteElection(election_id: string): Promise<{ success: boolean }> {
    const deleteOptions = {
        method: "DELETE",
        headers: {
            "Authorization": APIKey,
            "content-type": "application/json"
        }
    }
    return await fetch(`${url}elections/${election_id}`, deleteOptions).then(res => res.json());
}
export async function getElectionWinner(election: Election) {
    const ballot = await CacheFetch(`${url}elections/${election.election_id}/ballots`, options)
    const convertedBallots = convertBallots(ballot.ballots)
    const winner = (election.type === "irv") ? IRVElections(convertedBallots) : CPLElections(convertedBallots, election.options).CPL
    console.log(winner)
    return winner
}