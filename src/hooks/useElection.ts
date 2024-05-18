import { useEffect, useState } from "react";
import { ElectionStatus } from "../type.ts";
const url:string = import.meta.env.VITE_API_URL;

export default function UseElection(){
    const [election, setElection] = useState<ElectionStatus>();
    useEffect(()=>{
        async function fetchData(){
            try{
                const data = await fetch(url);
                const res:ElectionStatus = await data.json();
                setElection(res);
            }catch(error){
                console.error(error)
            }
        }
        fetchData();
    },[election]
    )
    return election
}