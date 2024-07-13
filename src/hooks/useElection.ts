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
export async function UseAllElection(){
    // Each call returns 100 results, our elections are not within that 99.
    // So, I have to get the elections with using a parameter until there are some owned elections.
    let owned = false;
    console.log("1st owned, ", owned);
    let finalId= '';
    let filtered: Election[] = [];
    let x = 0;
    while(owned === false){
        let parameter = finalId.length <= 1 ? '' :`?election_id=${finalId}`;
        console.log("Starting Parameter: ", parameter);
        let electionsCall: ElectionsStatus = await CacheFetch(`${url}elections${parameter}`, options);
        let ownedFilter = electionsCall.elections.filter(election => election.owned === true);
        console.log("Call", electionsCall);
        console.log("Owned Filter: ", ownedFilter);
        owned = ownedFilter.length === 0 ? false : true;
        console.log("Logging Election Id", electionsCall.elections[(electionsCall.elections.length - 1)])
        finalId = electionsCall.elections[(electionsCall.elections.length - 1)].election_id;
        console.log("Final Id: ", finalId);
        filtered = electionsCall.elections.filter(election => election.owned === true);
        console.log("Owned Value", owned);
        if(x > 2){
            break;
        }else{ 
            x++
            console.log("__________Separate_________");
        }
    }
    console.log("While loop finished", owned);
    return filtered;
}
export default function UseElection(){
    const {data, isLoading, isError, error} = useQuery({
        queryKey:["UnfilteredElections"],
        queryFn: UseAllElection
    });
    return {elections:data, isLoading, isErroring: isError, electionsError: error};
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