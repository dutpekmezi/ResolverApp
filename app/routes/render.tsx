import { LinksFunction } from "@remix-run/node";
import { Outlet, useNavigation } from "@remix-run/react";
import styles from "../styles/render.css"
import RenderSteps from "~/components/RenderSteps/RenderSteps";
import Spinner from "~/components/Spinner";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles }
 ];
/*
 export async function loader({request}: LoaderFunctionArgs) {
    const url = request.url;
    console.log(`URL: ${url}`);
    return json(url);
}*/
/*
export async function action({request}: ActionFunctionArgs)
{
    const session = await getSession(
        request.headers.get("Cookie")
    );
    
    //session.set("renderStep", 0);
}*/

export default function Render() {

    //const fetcher = useFetcher({ key: "render-steps" });

    const titles = [
        "Select Scene",
        "Upload Object",
        "Set Transform",
        "Other Objects",
        "Render Configs",
        "Confirm"
    ]

    const renderSteps = RenderSteps({titles});

    return(
        <div>
            {renderSteps}

            <Outlet/>
        </div>
    );
}