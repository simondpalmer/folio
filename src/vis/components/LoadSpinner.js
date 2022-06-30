import React, { useRef, useEffect, useState } from "react";
import '../css/spinner.css';

const LoadSpinner = () => {
    const [loading, setLoading] = useState(true);

    if(!loading) {
        return null};
        return (
    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
)};

export default LoadSpinner;