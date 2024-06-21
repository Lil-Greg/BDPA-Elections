import { useEffect, useState } from "react";
import { Election, ElectionStatus, ElectionsStatus, GetBallotsResponse, GetSingleBallotType } from "../type.ts";
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
    const [elections, setElections] = useState<ElectionsStatus>();
    useEffect(()=>{
        async function fetchData(){
            try{
                const res = await fetch(url + `elections`, options);
                const data:ElectionsStatus = await res.json();
                setElections(data);
            } catch(error){
                console.error(error);
            }
        }
        fetchData();
    },[]);
    return elections;
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
export async function GetSingleBallot(election_id:string, user_id:string): Promise<GetSingleBallotType | undefined>{
    try{
        const data: GetSingleBallotType = await fetch(`${url}elections/${election_id}/ballots/${user_id}`, options).then(res => res.json());
        if(data.success === true){
            return data;
        }else{
            throw Error;
        };
    }catch(error){
        console.warn("", error)
    };
}
export async function MakeVote(election_id:string, voter_id:string, ranking:object){
    const puttingRankingInObject = {ranking};
    const optionsMakeVote = {
        method:"PUT",
        headers:{
            "Authorization": APIKey,
            "content-type":"application/json"
        },
        body:JSON.stringify(puttingRankingInObject)
    };
    try{
        return await fetch(`${url}elections/${election_id}/ballots/${voter_id}`, optionsMakeVote);
    }catch(error){
        console.warn("Error with making vote", error);
    }
}