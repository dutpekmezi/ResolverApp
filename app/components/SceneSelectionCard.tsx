import constants from "constants.json"
import { Form, MetaFunction, useNavigation } from "@remix-run/react";

export const meta: MetaFunction = () => {
    return [
      { title: "Resolver Auto Renderer" },
      { name: "description", content: "Scene Selection" },
    ];
  };

export default function SceneSelectionCard(sceneName:string) 
{
    const navigation = useNavigation();

    const words = sceneName.split("_");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substring(1);
    }

    return (
        <Form method="post" id={"scene-select"}>
            <input type="hidden" name={"scene"} value={sceneName} />
            <button className="box-parent" type="submit">
                <h1>{words.join(" ")}</h1>
                <img className="box" src={constants.imageUrl + (sceneName) + ".jpg"} alt={sceneName}/>
            </button>
        </Form>
    );
}

