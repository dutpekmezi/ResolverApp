import { ActionFunctionArgs,
	LoaderFunctionArgs,
	unstable_composeUploadHandlers as composeUploadHandlers,
	unstable_parseMultipartFormData as parseMultipartFormData,
	unstable_createFileUploadHandler as createFileUploadHandler,
	json,
	UploadHandler,
	redirect
	} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { getSession } from "~/session";
import {googleCloudUploadHandler} from "../services/gooleCloudService"

export async function loader({ request }: LoaderFunctionArgs) {
	
    const session = await getSession(
      request.headers.get("Cookie")
    );
  
    const scene = session.get("scene");
  
    if (scene == null)
	{
		throw redirect("/render");
	}

	await new Promise(res => setTimeout(res, 3000));
  
    return json(scene);
}

type ActionData = {
	errorMsg?: string;
	imgSrc?: string;
	imgDesc?: string;
  };

export async function action ({ request }: ActionFunctionArgs) 
{
	const uploadHandler: UploadHandler = composeUploadHandlers(
		googleCloudUploadHandler,
		createFileUploadHandler(),
	);
	const formData = await parseMultipartFormData(request, uploadHandler);
	const imgSrc = formData.get("img");
	const imgDesc = formData.get("desc");
	console.log(imgDesc);
	if (!imgSrc) {
		return json({
		  	errorMsg: "Something went wrong while uploading",
		});
	}
	return json({
		imgSrc,
		imgDesc,
	});
};

export default function UploadObject()
{
	const fetcher = useFetcher<ActionData>();
	
	return (
	  <>
		<fetcher.Form method="post" encType="multipart/form-data">
		  <label htmlFor="img-field">Image to upload</label>
		  <input id="img-field" type="file" name="img" accept="image/*" />
		  <label htmlFor="img-desc">Image description</label>
		  <input id="img-desc" type="text" name="desc" />
		  <button type="submit">Upload to S3</button>
		</fetcher.Form>

		{(fetcher.state === "idle" && fetcher.data != null) ? (
		  fetcher.data.errorMsg ? (
			<h2>{fetcher.data.errorMsg}</h2>
		  ) : (
			<>
			  <div>
				File has been uploaded to S3 and is available under the following
				URL (if the bucket has public access enabled):
			  </div>
			  <div>{fetcher.data.imgSrc}</div>
			  <img
				src={fetcher.data.imgSrc}
				alt={fetcher.data.imgDesc || "Uploaded image from S3"}
			  />
			</>
		  )
		) : null}
	  </>
	);
}