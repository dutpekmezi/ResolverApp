import { ActionFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {GetRenderSceneNames, RenderSceneNamesResponse} from "~/services/renderService"
import SceneSelectionCard from "~/components/SceneSelectionCard";
import { commitSession, getSession } from "~/utils/session";

export const meta: MetaFunction = () => {
    return [
      { title: "Resolver Auto Renderer" },
      { name: "description", content: "Auto Renderer" },
    ];
};

export async function loader()
{
    const data = await GetRenderSceneNames();

    return data;
}

export async function action({request}: ActionFunctionArgs)
{
    try {
        const formData = await request.formData();
    
        const session = await getSession(
            request.headers.get("Cookie")
        );
        
        session.set("scene", formData.get("scene") as string);
        
        return redirect("/render/1", {
            headers: {
            "Set-Cookie": await commitSession(session),
            },
        });
    } catch (error) {
       return error;
    }
        
}

export default function SelectScene() {
    const sceneNames:RenderSceneNamesResponse = useLoaderData<typeof loader>();
    const items = sceneNames.data.map((name) => SceneSelectionCard(name));

    return (
        <div className="wrap">
            {items}
        </div>
    );
  }