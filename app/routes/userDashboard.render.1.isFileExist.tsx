import { ActionFunctionArgs, json } from "@remix-run/node";
import { IsModelNameExist } from "~/services/userService";
import { userId } from "~/utils/userUtils";


export async function action ({ request }: ActionFunctionArgs) 
{
    const formData = await request.formData();
    const file = formData.get("fileUpload") as File; 

    if (file)
    {
        const fileName = file.name;

        const isModelNameExistResponse = await IsModelNameExist({
            userId: userId,
            modelName: fileName ?? ""
        });
        
        return isModelNameExistResponse;
    }
    
    return json({
        success: false,
        message: "File not found"
    })
}

export default function IsFileExist()
{
    return (<></>)
}