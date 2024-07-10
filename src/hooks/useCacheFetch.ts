export default async function CacheFetch(url: string, options: RequestInit){
    const cacheKey = `${url}_${JSON.stringify(options)}`;
    const cached = window.sessionStorage.getItem(cacheKey);
    if(cached){
        return(JSON.parse(cached));
    };
    const data = await fetch(url, options).then(res => res.json());
    if(data.success){ 
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
    };
    return data;
}