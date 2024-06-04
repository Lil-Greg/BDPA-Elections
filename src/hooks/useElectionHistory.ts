import { useEffect, useState } from "react";
import { ElectionsStatus } from "../type";
const url = import.meta.env.VITE_API_URL;
const APIKey = import.meta.env.VITE_API_KEY;

export default function useElectionHistory(){
    const [elections, setElections] = useState<ElectionsStatus | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const options = {
        method:'GET',
        headers:{
            "Authorization":APIKey,
            "content-type":"application/json"
        }
    }
    const [isErroring, setIsErorring] = useState(false);

    useEffect (()=>{
        async function fetchData(){
            try{
                setIsLoading(true);
                const res = await fetch(`${url}elections`, options);
                const data = await res.json() as ElectionsStatus;
                setElections(data);
            }
            catch(error){
                setIsErorring(true);
            } finally{
                setIsLoading(false);
            }
        }   
        fetchData();
    },[])
    return { elections, isLoading, isErroring };
}