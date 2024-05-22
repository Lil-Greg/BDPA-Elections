export interface ElectionInfo{
    success:boolean,
    info:{
        upcomingElections:number,
        openElection:number,
        closedElections:number
    }
}
export interface ElectionsStatus{
    success: true,
    elections: Election[]
}
export interface ElectionStatus{
    success: true,
    election: Election
}
export interface Election{
    election_id: string,
    title: string,
    description: string,
    options: string[],
    createdAt: number,
    opensAt: number,
    closesAt: number,
    owned: boolean,
    deleted: boolean
}
export interface User{
    user_id:string,
    salt:string,
    username:string,
    email:string,
    blogname?:string,
    type:'voter' | 'administrator' | 'reporter' | 'moderator' | 'super'
}
export interface UserApi{
    success:boolean,
    users:User[]
}
export interface UserAuth{
    success:boolean
}
export interface UserContextType {
    // isAuthenticated: boolean,
    user: User | null,
    setUser: React.Dispatch<React.SetStateAction<User | null>> | null,
    isAuthenticated: boolean
}