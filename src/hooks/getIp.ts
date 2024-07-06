import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type IpRes = {
    ip: string
};
export default function GetIp(){
    const [userIp, setUserIp] = useState<IpRes>();

    const {data} = useQuery<IpRes>({
    queryKey: ['userIp'],
    queryFn: () => fetch('https://api.ipify.org?format=json').then(res => res.json())
    });
    useEffect(() => {
        setUserIp(data);
    }, [data]);

    return {userIp: userIp?.ip};
}