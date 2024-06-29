export default async function CacheFetch(url: string, options: RequestInit){
    const cacheKey = `${url}_${JSON.stringify(options)}`

    const cached = localStorage.getItem(cacheKey)
    if(cached){
        return(JSON.parse(cached));
    }
    try{
        const results = await fetch(url, options);
        const data = await results.json();
        localStorage.setItem(cacheKey, JSON.stringify(data));
        return (data);
    }
    catch(error){
        throw error;
    }
}