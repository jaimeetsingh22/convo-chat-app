import { isValidUsername } from "6pp"

export const usernameValidor = (username)=>{
    if(!isValidUsername(username)){
        return {isValid:false, errorMessage:'username is invalid'};
    }
}