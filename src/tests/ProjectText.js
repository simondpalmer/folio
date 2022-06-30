import React from "react";
import * as d3 from "d3";

function projectDescriptionText(props) {
    return(
        <div className="descriptionText">
            <h2 className="descrHead">{props.project.subtitle}</h2>
            <h4>{props.project.title}</h4>
            <h4>{props.project.start} | {props.project.kind}</h4>
            <div>
                <a href={props.project.link} target="_blank">
                    <img src={props.project.image} alt= {props.project.subtitle} className="descriptionImage"></img>
                    <span className="descriptionLink">enter</span>
                </a>
            </div>
            {props.project.description}
        </div>
    )
}
export default projectDescriptionText