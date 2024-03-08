import { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useNavigation } from "@remix-run/react";
import styles from "../styles/render.css"
import RenderSteps from "~/components/RenderSteps/RenderSteps";
import { RedirectToLoginIfUserInvalid } from "~/utils/userUtils";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles }
 ];

 export async function loader({request}: LoaderFunctionArgs) {
    
    await RedirectToLoginIfUserInvalid(request.headers);

    return {};
}

export default function Render() {

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