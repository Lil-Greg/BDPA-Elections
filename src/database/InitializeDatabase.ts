import { useState } from "react";
import { User } from "../type";

export default function InitializeDatabase(formValues:{userId:string, salt:string, username:string, email:string,type:string}){
    const request = indexedDB.open("UserDatabase", 2);
    const [userValues, setUserValues] = useState<User>({
        userId:'',
        salt:'',
        username:'',
        email:'',
        type:''
    });

    request.onupgradeneeded = () => {
        const db = request.result;
        const store = db.createObjectStore("userData", {keyPath: "id"});
        store.createIndex("userId", "userId" ,{unique:true});
        store.createIndex("salt", `salt`, {unique:true});
        store.createIndex("username", `username`,{unique:true});
        store.createIndex("email", `email`, {unique:true});
        store.createIndex("type", `type`, {unique:true});
    }
    request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction("userData", "readwrite");

        const store = transaction.objectStore("userData");
        // const userIndex = store.index("userId");
        // const saltIndex = store.index("salt");
        // const usernameIndex = store.index("username");
        // const emailIndex = store.index("email");
        // const typeIndex = store.index("type");

        store.put({id:0, userId:formValues.userId});
        store.put({id:1, salt:formValues.salt});
        store.put({id:2, username:formValues.username});
        store.put({id:3, email:formValues.email});
        store.put({id:4, type:formValues.type});

        const userIdQuery = store.get(0);
        const saltQuery = store.get(1);
        const usernameQuery = store.get(2);
        const emailQuery = store.get(3);
        const typeQuery = store.get(4);

        console.log("store", store);

        setTimeout(() => {
            console.log("userData", userIdQuery.result);
            console.log("salt", saltQuery.result);
            console.log("username", usernameQuery.result);
            console.log("email", emailQuery.result);
            console.log("type", typeQuery.result);
        }, 500)

        const userId:string = userIdQuery.result.userId;
        const salt:string = saltQuery.result.salt;
        const username:string = usernameQuery.result.username;
        const email:string = emailQuery.result.email;
        const type:string = typeQuery.result.type;

        setUserValues({
            userId: userId,
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