import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { commitSession, getSession } from "~/utils/session";

export async function action ({ request }: ActionFunctionArgs) 
{
    const formData = await request.formData();
    const modelId = formData.get("modelId") as string;
    const modelName = formData.get("modelName") as string;

    const session = await getSession(
        request.headers.get("Cookie")
    );
    
    session.set("modelId", modelId);
    session.set("modelName", modelName);
    
    return redirect("/userDashboard/render/2", {
    headers: {
        "Set-Cookie": await commitSession(session),
    }
    });
}

export default function IsFileExist()
{
    return (<></>)
}