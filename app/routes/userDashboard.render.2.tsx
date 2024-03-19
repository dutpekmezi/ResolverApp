import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSession } from "~/utils/session";

type LoaderData = {
	modelName:string;
  };

export async function loader({ request }: LoaderFunctionArgs) 
{	
    const session = await getSession(
      request.headers.get("Cookie")
    );
  
    const modelName = session.get("modelName");
  
    if (modelName == null)
	{
		throw redirect("/userDashboard/render");
	}

    return {modelName};
}

export default function SetTransform()
{
	const loader = useLoaderData<LoaderData>();

    return (
        <h3 className="text">{loader.modelName}</h3>
    );
}