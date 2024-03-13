import constants from "constants.json"
import BaseResponse from "../Contracts/Responses/BaseResponse"
import { accessToken } from "~/utils/userUtils";
import Fetch from "~/utils/fetchUtils";

export interface RenderSceneNamesResponse extends BaseResponse {
    data: string[];
}

export async function GetRenderSceneNames() : Promise<RenderSceneNamesResponse>
{
    try 
    {
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "0";

        // 👇️ const response: Response
        const response = await Fetch(constants.url + "render/getrenderscenenames", {
          method: 'GET',
          headers: {
            Authorization: "Bearer " + accessToken,
            Accept: 'application/json',
          },
        });
    
        if (!response.ok) 
        {
            let result = {} as RenderSceneNamesResponse;
            result.statusCode = response.status;
            result.message = "Status Error";
            result.success = false;

            return result;
        }

        const result: RenderSceneNamesResponse = {
            data: await response.json(),
            message: "",
            success: true,
            statusCode: response.status
        };
        
        console.log('result is: ', JSON.stringify(result, null, 4));
    
        return result;
    } 
    catch (error) 
    {
        let result = {} as RenderSceneNamesResponse;
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