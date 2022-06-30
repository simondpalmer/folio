import React, { useRef, useEffect, useState } from "react";
import ImageGallery from 'react-image-gallery';
import '../css/spinner.css';

const Gallery = (props) => { 
    const {images} = props;
    const [loading, setLoading] = useState(true);

    if (loading) {
        return <ImageGallery items={images} onImageLoad={() => setLoading(false)}/>
    }
        return (
        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>)
}
export default Gallery