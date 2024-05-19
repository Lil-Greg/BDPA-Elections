export interface ElectionInfo{
    success:boolean,
    upcomingElections:number,
    openElection:number,
    closedElections:number
}
export interface ElectionStatus{
    success: true,
    election: {
        election_id: string,
        title: string,
        description: string,
        options: [string],
        createdAt: number,
        opensAt: number,
        closesAt: number,
        owned: boolean,
        deleted: boolean
    }
}
export interface Elections{
    success:boolean,
    elections:[ElectionStatus]
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