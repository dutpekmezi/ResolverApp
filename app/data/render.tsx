import constants from "constants.json"
import BaseResponse from "./BaseResponse"

export interface RenderSceneNames extends BaseResponse {
    data: string[];
}

export async function GetRenderSceneNames() : Promise<RenderSceneNames>
{
    try 
    {
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "0";

        // 👇️ const response: Response
        const response = await fetch(constants.url + "render/getrenderscenenames", {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });
    
        if (!response.ok) 
        {
            let result = {} as RenderSceneNames;
            result.statusCode = response.status;
            result.error = "Status Error";

            return result;
        }

        const result: RenderSceneNames = {
            data: await response.json(),
            error: "",
            message: "",
            statusCode: response.status
        };
        
        console.log('result is: ', JSON.stringify(result, null, 4));
    
        return result;
    } 
    catch (error) 
    {
        let result = {} as RenderSceneNames;
        
        if (error instanceof Error) 
        {
          console.log('error message: ', error.message);
          result.error = error.message;
        } 
        else 
        {
          console.log('unexpected error: ', error);
          result.error = 'unexpected error: ' + error;
        }

        return result;
    }
}