import { useEffect, useState } from "react";
import { Election, ElectionStatus, ElectionsStatus, GetBallotsResponse } from "../type.ts";
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
}

export default function UseElection(){
    const {data} = useQuery({
        queryKey: ['allElections'],
        queryFn: getAllElections
    }) 
    return data;
}
export function getAllElections(){
    let AllElections: Election[] = [];
    let hasMoreElections = true;
    let after = '';
    while(hasMoreElections){
        const elections = CacheFetch(url + `elections?after=${after}`, options)
        hasMoreElections = elections?.length == 100;
        AllElections = [...AllElections, ...elections];
        after = elections[elections.length - 1].election_id;
    }
    return AllElections
}

export function UseSingleElection(id:string){
    const [election, setElection] = useState<Election>();

    useEffect(()=>{
        async function fetchData(){
            try{
                const data = await fetch(url + `elections/${id}`, options);
                const res:ElectionStatus = await data.json();
                setElection(res.election);
            }catch(error){
                console.error(error);
            }
        }
        fetchData();
    },[id]);
    return election;
}

export async function GetBallots(election_id:string):Promise<GetBallotsResponse | undefined>{
    try{
        return await fetch(`${url}elections/${election_id}/ballots`, options).then(res => res.json());
    } catch(error){
        console.error("Error With GetBallots ",error);
    }
}
export async function MakeVote(election_id:string, voter_id:string, ranking:object){
    const optionsMakeVote = {
        method:"PUT",
        headers:{
            "Authorization": APIKey,
            "content-type":"application/json"
        },
        body:JSON.stringify(ranking)
    }
    try{
        return await fetch(`${url}elections/${election_id}/ballots/${voter_id}`, optionsMakeVote);
    }catch(error){
        console.error("Error with making vote", error);
    }
}