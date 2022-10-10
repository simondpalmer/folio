import React, { useEffect, useState, } from "react";
import '../css/grid.css';
import 'react-image-gallery/styles/css/image-gallery.css';
//import 'react-image-gallery/styles/scss/image-gallery.scss';
import 'jquery/dist/jquery.js';
import Isotope from 'isotope-layout/dist/isotope.pkgd.min.js';
import ImageGallery from 'react-image-gallery';
import projectsData from '../../data/projectsData';
import Project from './Projects';


const GridApp = (props) => {
  const [projects] = useState(() => (projectsData.map((project) => <Project id={project.id} project={project} projectClick={() => {setFilterProject(project)}}/>)));
  const [isotope, setIsotope] = useState(null);
  const [filterKey, setFilterKey] = useState("*");
  const [filterproject, setFilterProject] = useState(false);


  useEffect(() => {
    const elem = document.querySelector('#gridContainer')  
      setIsotope(new Isotope( elem, {
          itemSelector: '.gridItem',
          layoutMode: 'masonry',
          masonry: {
            columnWidth: 140,
            fitWidth: true,
            transition: 0.8
          },
          getSortData: {
            year: '.start parseFloat',
            kind: '.kind'
          }
        })
      )
    },[]);
  
  useEffect(
    () => {
      if (isotope) {
        filterKey === "*"
          ? isotope.arrange({ filter: `*` })
          : isotope.arrange({ filter: `.${filterKey}` }); 
          isotope.arrange({ sortBy : 'year', sortAscending : false });
      }
    },
    [isotope, filterKey])

    

  console.log(filterproject)

    return (
      <body>
        <div id="interface">
          <button className="buttons" onClick={() => {setFilterKey("*"); setFilterProject(false)}} value="*">all</button>
          <button className="buttons" onClick={() => {setFilterKey("firm"); setFilterProject(false)}}value="firm projects">firm projects</button>
          <button className="buttons" onClick={() => {setFilterKey("soft"); setFilterProject(false)}} value="soft projects">soft projects</button>
          <button className="buttons" onClick={() => {setFilterKey("conference"); setFilterProject(false)}} value="conferences">conferences</button>
          <button className="buttons" onClick={() => {setFilterKey("installation"); setFilterProject(false)}} value="installations">installations</button>
        </div>
        <div id='sepLine'>
        <div id="visHolder">
           <div id="gridContainer" style={{position: "relative", width: "840px", height: "1823px"}} >
             {projects}
           </div>           
         </div>
       </div>
       <div id='description'>
       <div className="descriptionText" style={{display: (filterproject===false) ? 'none' : ''}}>
            <h2 className="descrHead">{filterproject.subtitle}</h2>
            <h4>{filterproject.title}</h4>
            <h4>{filterproject.start} | {filterproject.kind}</h4>
            <div>
            {filterproject!==false ? <div className="gallery"> <ImageGallery items={filterproject.image} showPlayButton={false} showNav={false}/></div> : <div className="lds-ellipsis" ><div></div><div></div><div></div><div></div></div>}
            </div>
            <div className="collaborationText" style={{display: filterproject.collaboratorname === "" ? 'none' : ''}} >
              <a href={filterproject.collaboratorlink} target="_blank">
                <h4 id='introText'>Collaborator {filterproject.collaboratorname}</h4>
              </a>
            </div>
            {filterproject.description}
        </div>
      <div id='introText' style={{display: (filterproject!=false) ? 'none' : ''}}>
        <h2 className="descrHead">Simon Palmer</h2>
        <h4 className="Occupation">Architect | Technologist | Entrepreneur </h4>
        <p> Simon Palmer is passionate about combining art and science to innovate society in the built and virtual environments. As a technologist with a background as an architect of the built environment, and as a certified blockchain developer, his creativity explores the intersection of the arts, culture and science in the physical environment and on the web.</p>
        <p>Above is a meta-visualization of selected architectural projects (firm), software and virtual projects (soft), installations, conferences and others. Explorable as a grid and as a timeline, it offers a chance to reflect on connections Simon has made, which guide and influence his current makings.</p>
        <p>Simon is Australian and lives currently in the US. He holds a BA and MA in Architecture and is a registered architect. He also has various accreditations including as a Blockchain developer by the Consensys Academy and the NEAR protocol. As a technologist, entrepreneur and architect, Simon explores the boundaries of spatial knowledge and interaction in the post-digital age.</p>
      </div>
      </div>
      <div id='footer'>
      <footer>
          <div class='footer'>
            <a href="mailto:palmer.simond@gmail.com"> Email</a>,
            <a href="https://www.linkedin.com/in/simon-palmer-profile/"> LinkedIn</a>,
            <a href="https://twitter.com/sim_palmer"> Twitter</a>,
            <a href="https://t.me/simondpalmer"> Telegram</a> or 
            <a href="https://github.com/simondpalmer"> GitHub</a>
            &nbsp; || &nbsp; &copy; Simon Palmer
          </div>
        </footer>
      </div>
      </body>
    );
}

export default GridApp;
