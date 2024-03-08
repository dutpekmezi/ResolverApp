import { ActionFunctionArgs,
	LoaderFunctionArgs,
	unstable_composeUploadHandlers as composeUploadHandlers,
	unstable_parseMultipartFormData as parseMultipartFormData,
	unstable_createFileUploadHandler as createFileUploadHandler,
	json,
	UploadHandler,
	redirect
	} from "@remix-run/node";
import { getSession } from "~/utils/session";
import {googleCloudUploadHandler} from "../services/gooleCloudService"
import { RedirectToLoginIfUserInvalid } from "~/utils/userUtils";
import DragDropFileUpload from "~/components/DragDropFile";
import { useFetcher } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) 
{
	await RedirectToLoginIfUserInvalid(request.headers);
	
    const session = await getSession(
      request.headers.get("Cookie")
    );
  
    const scene = session.get("scene");
  
    if (scene == null)
	{
		throw redirect("/render");
	}
  
    return json(scene);
}

type ActionData = {
	errorMsg?: string;
	imgSrc?: string;
  };

export async function action ({ request }: ActionFunctionArgs) 
{
	const uploadHandler: UploadHandler = composeUploadHandlers(
		googleCloudUploadHandler,
		createFileUploadHandler(),
	);
	const formData = await parseMultipartFormData(request, uploadHandler);
	const imgSrc = formData.get("file-upload");

	if (!imgSrc) {
		return json({
		  	errorMsg: "Something went wrong while uploading",
		});
	}
	return json({
		imgSrc,
	});
};

export default function UploadObject()
{
	const fetcher = useFetcher<ActionData>();

	return (
	  <center>
		{fetcher.data != null ? <div> <p>{fetcher.data.imgSrc}</p></div> : null}

		<DragDropFileUpload id="file-upload" />
	  </center>
	);
}