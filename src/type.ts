export interface ElectionStatus{
    success:boolean,
    upcomingElections:number,
    openElection:number,
    closedElections:number
}
export interface User{
    user_id:string,
    salt:string,
    username:string,
    email:string,
    blogname?:string,
    type:'voter' | 'administrator' | 'blogger' | 'moderator' | 'super'
}
export interface UserApi{
    succes:boolean,
    users:User[]
}