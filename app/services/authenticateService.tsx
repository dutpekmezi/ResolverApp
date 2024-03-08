import constants from "constants.json"
import BaseResponse from "../Contracts/Responses/BaseResponse"

export interface LoginResponse extends BaseResponse
{
    accessToken:string,
    userId:string
};

export interface RegisterRequestData
{
    email:string,
    fullname:string,
    password:string,
};

export interface RegisterResponse extends BaseResponse
{
};

export async function Login(email:string, password:string) : Promise<LoginResponse>
{
    try 
    {
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "0";

        const response = await fetch(constants.authenticateUrl + "/login", {
          method: 'POST',
          body:`{
            "email": "${email}",
            "password": "${password}"
          }`,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });
    
        if (!response.ok) 
        {
            let result = {} as LoginResponse;
            result.statusCode = response.status;
            result.message = "Status Error";
            result.success = false;

            return result;
        }

        const result: LoginResponse = await response.json();
        
        console.log('result is: ', JSON.stringify(result, null, 4));
    
        return result;
    } 
    catch (error) 
    {
        let result = {} as LoginResponse;
        result.success = false;
        
        if (error instanceof Error) 
        {
          console.log('error message: ', error.message);
          result.message = error.message;
        } 
        else 
        {
          console.log('unexpected error: ', error);
          result.message = 'unexpected error: ' + error;
        }

        return result;
    }
}

export async function Register(registerRequest:RegisterRequestData) : Promise<RegisterResponse>
{
    try 
    {
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "0";

        const response = await fetch(constants.authenticateUrl + "/register", {
          method: 'POST',
          body: JSON.stringify(registerRequest),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });
    
        if (!response.ok) 
        {
            let result = {} as RegisterResponse;
            result.statusCode = response.status;
            result.message = "Status Error";
            result.success = false;

            return result;
        }

        const result: RegisterResponse = await response.json();
        
        console.log('result is: ', JSON.stringify(result, null, 4));
    
        return result;
    } 
    catch (error) 
    {
        let result = {} as RegisterResponse;
        result.success = false;
        
        if (error instanceof Error) 
        {
          console.log('error message: ', error.message);
          result.message = error.message;
        } 
        else 
        {
          console.log('unexpected error: ', error);
          result.message = 'unexpected error: ' + error;
        }

        return result;
    }
}