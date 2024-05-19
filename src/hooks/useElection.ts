import { useEffect, useState } from "react";
import { ElectionStatus, Elections } from "../type.ts";
const url:string = import.meta.env.VITE_API_URL;

export default function UseElection(){
    const [elections, setElections] = useState<Elections>();
    useEffect(()=>{
        async function fetchData(){
            try{
                const res = await fetch(url + `/election`);
                const data:Elections = await res.json();
                setElections(data);
            } catch(error){
                console.error(error);
            }
        }
        fetchData();
    },[elections]);
    return elections;
}

export function UseSingleElection(id:number){
    const [election, setElection] = useState<ElectionStatus>();
    useEffect(()=>{
        async function fetchData(){
            try{
                const data = await fetch(url + `/election/${id}`);
                const res:ElectionStatus = await data.json();
                setElection(res);
            }catch(error){
                console.error(error);
            }
        }
        fetchData();
    },[election, id]);
    return election;
}