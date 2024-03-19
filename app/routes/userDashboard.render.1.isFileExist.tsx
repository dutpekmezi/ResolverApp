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

        let isModelNameExistResponse = await IsModelNameExist({
            userId: userId,
            modelName: fileName ?? ""
        });
        
        return json({
            success: isModelNameExistResponse.success,
            message: isModelNameExistResponse.message,
            actionType: "nameCheck",
            isNameTaken: isModelNameExistResponse.isNameTaken
        });
    }
    
    return json({
        success: false,
        message: "File not found",
        actionType: "nameCheck"
    })
}

export default function IsFileExist()
{
    return (<></>)
}