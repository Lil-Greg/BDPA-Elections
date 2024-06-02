import { useState } from "react";
import { User } from "../type";

export default function InitializeDatabase(formValues:{user_id:string, salt:string, username:string, email:string,type:string}){
    const request = indexedDB.open("UserDatabase", 2);
    const [userValues, setUserValues] = useState<User>({
        user_id:'',
        salt:'',
        key:'',
        username:'',
        email:'',
        type:'',
        city:'',
        state:'',
        zip:'',
        address:''
    });

    request.onupgradeneeded = () => {
        const db = request.result;
        const store = db.createObjectStore("userData", {keyPath: "id"});
        store.createIndex("user_id", "user_id" ,{unique:true});
        store.createIndex("salt", `salt`, {unique:true});
        store.createIndex("username", `username`,{unique:true});
        store.createIndex("email", `email`, {unique:true});
        store.createIndex("type", `type`, {unique:true});
    }
    request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction("userData", "readwrite");

        const store = transaction.objectStore("userData");
        // const userIndex = store.index("user_id");
        // const saltIndex = store.index("salt");
        // const usernameIndex = store.index("username");
        // const emailIndex = store.index("email");
        // const typeIndex = store.index("type");

        store.put({id:0, user_id:formValues.user_id});
        store.put({id:1, salt:formValues.salt});
        store.put({id:2, username:formValues.username});
        store.put({id:3, email:formValues.email});
        store.put({id:4, type:formValues.type});

        const user_idQuery = store.get(0);
        const saltQuery = store.get(1);
        const usernameQuery = store.get(2);
        const emailQuery = store.get(3);
        const typeQuery = store.get(4);

        console.log("store", store);

        setTimeout(() => {
            console.log("userData", user_idQuery.result);
            console.log("salt", saltQuery.result);
            console.log("username", usernameQuery.result);
            console.log("email", emailQuery.result);
            console.log("type", typeQuery.result);
        }, 500)

        const user_id:string = user_idQuery.result.user_id;
        const salt:string = saltQuery.result.salt;
        const username:string = usernameQuery.result.username;
        const email:string = emailQuery.result.email;
        const type:string = typeQuery.result.type;

        setUserValues({
            user_id: user_id,
            salt:salt,
            username:username,
            email:email,
            type:type
        });
    }
    request.onerror = (error) => {
        console.error(error);
    }
    return userValues;
}
export function GetDatabase(){
    const request = indexedDB.open("UserDatabase", 3);
    const db = request.result;

    const transaction = db.transaction("userData","readwrite");
    const store = transaction.objectStore("userData");

    const allValues = store.getAll();
    console.log(allValues);
    // Make the different indexes
}