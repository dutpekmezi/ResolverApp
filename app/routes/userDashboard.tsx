import { ActionFunction, ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { RedirectToLoginIfUserInvalid } from "~/utils/userUtils";

import styles from '~/styles/userDashboard.css';

export function links() {
    return [{ rel: 'stylesheet', href: styles }];
}

type LoaderData = {
    userId:string
};

export async function loader({request}: LoaderFunctionArgs) {

    const userCookies = await RedirectToLoginIfUserInvalid(request.headers);

    const loaderData:LoaderData = {
        userId:userCookies.userId
    };

    return json(loaderData);
}

// Action function to handle form submission
export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {  

    const userCookies = await RedirectToLoginIfUserInvalid(request.headers);

    return {};
};

export default function userDashboard() {
    const loaderData = useLoaderData<LoaderData>();

    const fetcher = useFetcher();

    return (
        <div>
            <h1 className="text">User Dashboard</h1>
            <h3 className="text">User Id: {loaderData?.userId}</h3>
        </div>
    )
}
    