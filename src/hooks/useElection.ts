import { useEffect, useState } from "react";
import { EditElection, Election, ElectionStatus, ElectionsStatus } from "../type.ts";
import CacheFetch from "./useCacheFetch.ts";
import { useQuery } from "@tanstack/react-query";
import IRVElections from "../algo/IRV-Elections.ts";
import { convertBallots } from "../utils/utils.ts";
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
export default async function getAllElections() {
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
    console.log(AllElections);
    const filteredElections = AllElections.filter(election => election.owned === true);
    return filteredElections;
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
export function useEditElection(election_id: string, formValues: EditElection) {
    const optionsEditElection = {
        method: "PATCH",
        headers: {
            "Authorization": APIKey,
            "content-type": "application/json"
        },
        body: JSON.stringify(formValues)
    };
    useQuery({
        queryKey: ["editElection"],
        queryFn: async () => await fetch(`${url}elections/${election_id}`, optionsEditElection),
    });
};

export async function getElectionWinner(election: Election) {
    const ballot = await CacheFetch(`${url}elections/${election.election_id}/ballots`, options)
    const convertedBallots = convertBallots(ballot.ballots)
    const winner = (election.type === "irv") ? IRVElections(convertedBallots) : CPLElections(convertedBallots, election.options).CPL
    console.log(winner)
    return winner
}
