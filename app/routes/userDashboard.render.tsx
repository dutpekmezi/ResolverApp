import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import RenderSteps from "~/components/RenderSteps/RenderSteps";
import { RedirectToLoginIfUserInvalid } from "~/utils/userUtils";


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