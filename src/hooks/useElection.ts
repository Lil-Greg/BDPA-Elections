import { useEffect, useState } from "react";
import { Election, ElectionStatus, ElectionsStatus, GetBallotsResponse, GetSingleBallotType } from "../type.ts";
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
export async function getAllElections(): Promise<Election[]>{
    const data: ElectionsStatus = await CacheFetch(url + `elections`, options, 'getAllElections');
    console.log("Checking data in the getAllElections function", data);
    // const elections = data.elections.filter(electionD => 
    //     electionD.owned === true &&
    //     electionD.closesAt > Date.now() &&
    //     electionD.deleted === false
    // );
    // return elections;
    return data.elections;
};
export default function UseElection(){ // useEffect on elections data
    const {data, isLoading, isError, error} = useQuery({
        queryKey: ['allElections'],
        queryFn: getAllElections,
    });
    return {elections: data, isLoading, isErroring:isError, electionsError: error};
};
export function UseSingleElection(id:string){
    const [election, setElection] = useState<Election | undefined>(undefined);

    useEffect(()=>{
        async function fetchData(){
            try{
                const data:ElectionStatus = await CacheFetch(url + `elections/${id}`, options, id);
                setElection(data.election);
            }catch(error){
                console.warn(error);
            };
        };
        fetchData();
    },[id]);
    return election;
};
export async function GetBallots(election_id:string):Promise<GetBallotsResponse | undefined>{
    try{
        return await fetch(`${url}elections/${election_id}/ballots`, options).then(res => res.json());
    } catch(error){
        console.error("Error With GetBallots ",error);
    };
};
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
};
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
    };
};