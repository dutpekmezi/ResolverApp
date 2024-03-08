import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";

import styles from "./styles/main.css" 
import MainNavigation from "./components/MainNavigation";
import Spinner from "./components/Spinner";
import { HasAccesTokenAndUserId } from "./utils/userUtils";

export const links: LinksFunction = () => [
   { rel: "stylesheet", href: styles }
];

type LoaderData = {
  isLoggedIn:boolean;
};

export async function loader({request}: LoaderFunctionArgs) {

  const userCookies = await HasAccesTokenAndUserId(request.headers);

  const loaderData:LoaderData = {
    isLoggedIn:userCookies.valid
  };

  return json(loaderData);
}

export default function App() {

  const navigation = useNavigation()
  const loaderData = useLoaderData<LoaderData>();

  const isLoading = navigation.state === 'loading';

  const mainNavigation = MainNavigation(loaderData?.isLoggedIn) 
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header> {mainNavigation} </header>
        { isLoading ? <Spinner/> : <Outlet/> }
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
      <footer><center>Resolve Entertainment ©</center></footer>
    </html>
  );
}
