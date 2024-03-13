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
import {googleCloudUploadHandler} from "../services/googleCloudService"
import { RedirectToLoginIfUserInvalid, userId } from "~/utils/userUtils";
import DragDropFileUpload from "~/components/DragDropFile";
import { Outlet, useFetcher, useSubmit } from "@remix-run/react";
import { useCallback } from "react";
import { StartUploadModel } from "~/services/userService";

type LoaderData = {
	scene:string;
	userId:string;
  };

export async function loader({ request }: LoaderFunctionArgs) 
{	
    const session = await getSession(
      request.headers.get("Cookie")
    );
  
    const scene = session.get("scene");
  
    if (scene == null)
	{
		throw redirect("/userDashboard/render");
	}
  
    return {scene, userId};
}

type ActionData = {
	success:Boolean;
	message:String;
  };

export async function action ({ request }: ActionFunctionArgs) : Promise<ActionData>
{
	await RedirectToLoginIfUserInvalid(request.headers);

	const uploadHandler: UploadHandler = composeUploadHandlers(
		googleCloudUploadHandler,
		createFileUploadHandler(),
	);

	const formData = await parseMultipartFormData(request, uploadHandler);

	const uploadResult = formData.get("file-upload");

	if (!uploadResult) {
		return {
			success: false,
			message: "Couldn't upload file."
		};
	}

	return JSON.parse(uploadResult.toString())
};

export default function UploadObject()
{
	const fetcherKey = "mainModelUpload";

	const fetcher = useFetcher<ActionData>({key: fetcherKey});

	var uploadState = null;

	if (fetcher.state != "idle")
	{
		uploadState = <h4 className="text">Uploading File..</h4>;
	}
	else if (fetcher.data)
	{
		uploadState = <h4 className="text">{fetcher.data.message}</h4>
	}

	const submit = useSubmit()

    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
          	event.preventDefault();
			
			const startUploadModelResponse = await StartUploadModel({
				userId: userId,
				modelName: event.currentTarget.fileUpload.value,
				overrideIfExist: event.currentTarget.overrideModel.value
			});

			if (!startUploadModelResponse.success) {
				submit({
					success: false,
					message: startUploadModelResponse.message ?? "",
					id: startUploadModelResponse.id,
					fileUpload: event.currentTarget.fileUpload.value
				},
				{
					method: "post",
					encType: "multipart/form-data",
				  });
			}
          

          	submit({
				fileUpload:  event.currentTarget.fileUpload.value
			}, 
			{
				method: "post",
				encType: "multipart/form-data",
          	});
        },
        [submit],
      );

	return (
	  <center>
		<fetcher.Form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
			<DragDropFileUpload />
			<div>
                <label className='text' htmlFor="overrideModel">Override Existing Model</label>
                <input id="overrideModel" name="overrideModel" type="checkbox"/>
            </div>
		</fetcher.Form>
		{uploadState}
		<Outlet/>
	  </center>
	);
}