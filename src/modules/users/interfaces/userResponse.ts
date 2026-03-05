import { sexeUsers } from "src/core/enums/user.enum"

export interface UserDataResponse<>{
profilImage:string
name:string
firstName:string,
LastName:string
sexe:sexeUsers
email:string
password:string
telephone:string
}