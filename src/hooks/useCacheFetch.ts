export default function CacheFetch(url: string, options: RequestInit){
    const cacheKey = `${url}_${JSON.stringify(options)}`

    const cached = localStorage.getItem(cacheKey)
    if(cached){
        return(cached)
    }
    try{
        const results = await fetch(url, options);
        const data = await results.json()
        localStorage.setItem(cacheKey, data)
        return (data)
    }
    catch(error){
        throw error
    }
}