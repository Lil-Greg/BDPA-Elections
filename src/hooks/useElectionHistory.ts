import { useContext, useEffect, useState } from "react";
import { Election, ElectionsStatus } from "../type";
import UserContext from "../context/UserContext";
import CacheFetch from "./useCacheFetch";
const url = import.meta.env.VITE_API_URL;
const APIKey = import.meta.env.VITE_API_KEY;

export default function useElectionHistory(){
    const {user} = useContext(UserContext);
    const setMilliseconds = Date.now();
    const [electionsH, setElections] = useState<Election[]>();
    const [isLoading, setIsLoading] = useState(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                const data: ElectionsStatus = await CacheFetch(`${url}elections`, options);
                const filteredData = data.elections.filter(election => {
                    if(user?.type === 'administrator' || user?.type === 'super'){
                        return setMilliseconds > election.closesAt && election.deleted === false || election.deleted === true;
                    }
                    return setMilliseconds > election.closesAt && election.deleted === false;
                });
                setElections(filteredData);
            }
            catch(error){
                setIsErorring(true);
            } finally{
                setIsLoading(false);
            }
        }   
        fetchData();
    },[])
    return { electionsH, isLoading, isErroring };
}