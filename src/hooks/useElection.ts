import { useEffect, useState } from "react";
import { EditElection, Election, ElectionStatus, ElectionsStatus } from "../type.ts";
import CacheFetch from "./useCacheFetch.ts";
import { useQuery } from "@tanstack/react-query";
const url:string = import.meta.env.VITE_API_URL;
const APIKey:string = import.meta.env.VITE_API_KEY;
const options = {
    method:"GET",
    headers:{
        'Authorization': APIKey,
        'content-type':'application/json'
    }
};
async function getAllElections(): Promise<Election[]>{
    const data: ElectionsStatus = await CacheFetch(url + `elections`, options);
    const elections = data.elections.filter(electionD => 
        electionD.owned === true &&
        electionD.closesAt > Date.now() &&
        electionD.deleted === false
    );
    return elections;
};
export default function UseElection(){ // useEffect on elections data
    const {data, isLoading, isError, error} = useQuery({
        queryKey: ['allElections'],
        queryFn: getAllElections,
    });
    return {elections: data, isLoading, isErroring:isError, electionsError: error};
};
export function UseUnfilteredElection(){
    const {data, isLoading} = useQuery({
        queryKey:["UnfilteredElections"],
        queryFn:async () => {
            const nigger: ElectionsStatus = await CacheFetch(`${url}elections`, options);
            const owned = nigger.elections.filter(election => election.owned === true);
            return owned;
        }
    });
    return {elections:data, isLoading};
}
export function UseSingleElection(id:string){
    // console.warn("Error With UseSingleElection: ", error);
    const [election, setElection] = useState<Election | undefined>(undefined);

    useEffect(() => {
        async function fetchData(){
            const singleElection:ElectionStatus = await CacheFetch(url + `elections/${id}`, options);
            setElection(singleElection.election);
        }
        fetchData();
    }, [id]);
    return election;
};
export function useEditElection(election_id:string, formValues: EditElection){
    const optionsEditElection = {
        method: "PATCH",
        headers:{
            "Authorization":APIKey,
            "content-type":"application/json"
        },
        body:JSON.stringify(formValues)
    };
    useQuery({
        queryKey:["editElection"],
        queryFn:async () => await fetch(`${url}elections/${election_id}`, optionsEditElection),
    });
}