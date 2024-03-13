import { ActionFunction, ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
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

export default function userDashboard() {
    const loaderData = useLoaderData<LoaderData>();

    return (
        <div>
            <h4 className="text">User Id: {loaderData?.userId}</h4>
            <Outlet/>
        </div>
    )
}
    