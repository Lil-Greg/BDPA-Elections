import { useEffect, useState } from "react";
import { ElectionInfo } from "../type";
import { useQuery } from "@tanstack/react-query";
import CacheFetch from "./useCacheFetch";
const url:string = import.meta.env.VITE_API_URL;
const APIKey:string = import.meta.env.VITE_API_KEY;
const options = {
    headers:{
        'Authorization': APIKey,
        'content-type':'application/json'
    }
}

export default function useInfoApi(){
    const [info, setInfo] = useState<ElectionInfo>();

    async function InfoCall(){
        const infoCall: ElectionInfo = await CacheFetch(url+`info`, options, 'electionInfo');
        return infoCall;
    };
    const {data} = useQuery({
        queryKey: ['electionInfo'],
        queryFn: InfoCall,
    });
    useEffect(() => {
        setInfo(data);
    }, [data]);

    return info;
}
