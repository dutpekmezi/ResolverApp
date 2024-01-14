import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { commitSession, getSession } from "~/session";

export async function loader({
    request,
  }: LoaderFunctionArgs) {
    const session = await getSession(
      request.headers.get("Cookie")
    );
  
    const scene = session.get("scene");
  
    const data = { "scene": scene };
  
    return json(data);
  }

export default function UploadObject()
{
    const loaderData = useLoaderData<typeof loader>();

    return (
        <p>{loaderData.scene}</p>
    );
}