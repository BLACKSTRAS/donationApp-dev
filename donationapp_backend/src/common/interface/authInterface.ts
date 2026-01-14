import { Request } from "express";

export interface AuthInterface  {
    username:string,
    email:string,
    password:string
}

export interface UserInfoInterface {
    id?:number,
    firstName:string,
    lastName:string,
    username:string,
    email:string,
    role:string
}

export interface steamerDetail {
    streamerId: number,
    userId:number,
    userName:string,
    email:string,
    phoneNumber?:string,
    title?:string,
    firstName?:string,
    lastName?:string,
    idCard?:string,
    birthDay?:string,
    address?:string,
    distric?:string,
    province?:string,
    zipcode?:string,
    promtPayType?:number,
    promtPayNumber?:string,
    promtPayNo?:string,
    bankType?:number,
    bankNo?:string,
    bankUsername?:string,
    minDonation?:number,
    role?:string,
    creatDate?:string,
    totalDonate?:string,
    subDistrict?:string,
    imageUser?:string,
    words?:string[],
    wordDonate?:string
    wordFilterSystem?:string[]
}



export interface CookieInfo extends Request {
    cookies: {
        token: string
    },
    user?: {
        id: number,
        role:string
    }
}

export interface AccountInfo extends Request {
  user?: {
      id: number
  };
}

export interface ManagerInfo extends Request {
  user?: {
      id: number
  };
}

export interface UserInfo extends Request {
  user?: {
      id: number
  };
}