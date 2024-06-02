import { deriveKeyFromPassword } from './useAuth';

export default async function UserDerivePassword(password:string){
    // Destructure keyString and saltString from the returned object
    const { keyString, saltString }: { keyString: string; saltString: string } = await deriveKeyFromPassword(password);
    return {keyString, saltString};
}