import { CreateElection } from "../type";

const url = import.meta.env.VITE_API_URL;
const APIKey = import.meta.env.VITE_API_KEY;

export default async function AdminCreateElection(formValues:CreateElection){
    const stringOfData = JSON.stringify(formValues);
    const options = {
        method: 'POST',
        headers:{
            'Authorization':APIKey,
            'content-type':'application/json'
        },
        body:stringOfData
    }
    return await fetch(url + 'elections', options).then(res => res.json());
}