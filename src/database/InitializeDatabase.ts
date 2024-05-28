export default function InitializeDatabase(formValues:{userId:string, salt:string, username:string, email:string,type:string}){
    const request = indexedDB.open("UserDatabase", 2);

    request.onupgradeneeded = () => {
        const db = request.result;
        const store = db.createObjectStore("userData", {keyPath: "id"});
        store.createIndex("user", ['userIdInit', 'saltInit', 'usernameInit', 'emailInit', 'typeInit'], {unique:true});
        // store.createIndex("salt", `${salt}`, {unique:true});
        // store.createIndex("username", `${username}`,{unique:true});
        // store.createIndex("email", `${email}`, {unique:true});
        // store.createIndex("type", `${type}`, {unique:true});
    }
    request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction("userData", "readwrite");

        const store = transaction.objectStore("userData");

        store.put({
            id:1,
            userIdInit:formValues.userId,
            saltInit:formValues.salt,
            usernameInit:formValues.username,
            emailInit:formValues.email,
            typeInit:formValues.type
        })
    }
}
export function GetDatabase(){
    const request = indexedDB.open("UserDatabase", 1);
    const db = request.result;

    const transaction = db.transaction("userData","readwrite");
    const store = transaction.objectStore("userData");

    const allValues = store.getAll();
    console.log(allValues);
    // Got Confused with id part,
    // Don't know if data should be separate indexes
}