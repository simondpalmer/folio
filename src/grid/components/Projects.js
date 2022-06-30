import React, { useRef } from "react";

const Project = (props) => { 
    const {projectClick, project} = props;

        return (
            <div className={`lineDiv gridItem y${project.start}-${project.end} ${project.kind}`} style={{positon: "absolute"}} onClick={projectClick}>
            <h5>{project.title}</h5>
            <br></br>
            <p className="year">
            <span className="yearsstart">{project.start.substring(0,7)}</span> - <span className="yearsend">{project.end.substring(0,7)}</span>
            <br></br>
            <span className="kind">{project.kind}</span>
            </p>
            </div>
        )
    }
export default Project