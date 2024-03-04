import arrow_passive from "../../images/stepArrow_passive.png";
import arrow_active from "../../images/stepArrow_active.png";

export default function RenderStepArrow(index:number, isActive:boolean, title: string)
{
    return (
        <div className="render-step-parent">
            <img className="render-step-image" src={isActive ? arrow_active : arrow_passive}/>
            <h4> {isActive ? <b>{title}</b> : title}</h4>
        </div>
    );
}