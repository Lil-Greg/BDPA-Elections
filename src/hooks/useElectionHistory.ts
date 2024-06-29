import { useContext, useEffect, useState } from "react";
import { Election, ElectionsStatus } from "../type";
import UserContext from "../context/UserContext";
const url = import.meta.env.VITE_API_URL;
const APIKey = import.meta.env.VITE_API_KEY;

export default function useElectionHistory(){
    const {user} = useContext(UserContext);
    const getDate = new Date();
    const dateToString = `${getDate.getMonth()} ${getDate.getFullYear()} ${getDate.getDay()}`;
    const setMilliseconds = new Date().setMilliseconds(parseInt(dateToString));
    const [elections, setElections] = useState<Election[]>();
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
                const res = await fetch(`${url}elections`, options);
                const data = await res.json() as ElectionsStatus;
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
    return { elections, isLoading, isErroring };
}