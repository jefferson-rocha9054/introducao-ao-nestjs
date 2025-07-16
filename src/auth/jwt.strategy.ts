
import { Extractjwt, strategy } from "passport-jwt";
import { PassportStrategy} from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import passport from "passport";
 @Injectable()
export class jwtStrategy extends  PassportStrategy(strategy){
     
    constructor(){
        jwtFromRequest: extends PassportStrategy(strategy){
            constructor(){
               super({
                jwtFromRequest: Extractjwt.FromAuth
               }) 
            }
        }
    }
}