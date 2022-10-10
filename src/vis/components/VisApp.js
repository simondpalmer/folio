import React, { useRef, useEffect, useState } from "react";
import '../css/vis.css';
import 'jquery/dist/jquery.js';
import * as d3 from "d3";
import rawData from '../../data/projectsData';
import Gallery from './Gallery'
import ImageGallery from 'react-image-gallery';

const VisApp = (props) => {
  const visref = useRef()
  const [isLoading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [filterproject, setFilterProject] = useState(false);
  const [dimensions, setDimensions] = useState({
      documentWidth: window.innerWidth > 400? window.innerWidth:400,
      documentHeight: (window.innerHeight - 500) > 400? window.innerHeight - 500:400
    })

    useEffect(() => {

      var margin = {top: 50, right: 50, bottom: dimensions.documentHeight/6, left: 50}
      var width = dimensions.documentWidth - margin.left - margin.right
      var height = dimensions.documentHeight - margin.top - margin.bottom;

      //map data
      const projdata = (data) => 
        data.map((d) => {
          const title = d.title
          const subtitle = d.subtitle
          const startDate = new Date(d.start)
          const endDate = new Date(d.end)
          const kind = d.kind
          const program = d.program
          const collaboratorname = d.collaboratorname
          const collaboratorlink = d.collaboratorlink
          const description = d.description
          const image = d.image
          const link = d.link
          return {
            title,
            subtitle,
            startDate,
            endDate,
            kind,
            program,
            collaboratorname,
            description,
            image,
            link,
            collaboratorlink
          }
        })
      
      const projectdata = projdata(rawData)

      //get programs
      const programsData = [...d3.rollup(
        projectdata,
        v => v.length,
        d => d.program
      )].map(d => {
        return {
          title: d[0],
          image: [],
          startDate: projectdata
            .filter(x => x.program === d[0])
            .reduce((date,x) => {
              if (date === null || x.startDate < date) return x.startDate;
              return date;
            }, null)
            ,
          endDate: projectdata
            .filter(x => x.program === d[0])
            .reduce((date,x) => {
              if (date === null || x.endDate > date) return x.endDate;
              return date;
            }, null),
            kind: "program"
        }
      })

      const data = projectdata.concat(programsData)

      const iterate = ((item, index) => {
        item.id = index + 1
      })

      data.forEach(iterate)

      //get min and max Date
      const startDates = []
      const endDates = []

      for (var i = 0; i < projectdata.length; i++) {
        startDates.push(new Date(projectdata[i].startDate))
        endDates.push(new Date(projectdata[i].endDate))
      }
      const minDate = new Date(Math.min.apply(null,startDates))
      const maxDate = new Date(Math.max.apply(null,endDates))

      setProjects(data)

      const linesMouseover = d => {
        var str = ('#' + d.target.id)
        d3.selectAll(str)
        .style('font-weight', '900');
      }

      const linesMouseout = d => {
        var str = ('#' + d.target.id)
        d3.selectAll(str)
        .style('font-weight', '300');
      }

      //set clicked project for Description

      const linesClick = d => { 
        var str = d.target.className.baseVal
        var n = str.search("undefined")
        if(n === -1) {
        let t = d3.transition()
        .duration(500);
        let selection = []
        for (var i = 0; i < data.length; i++) {
          if(d.target.innerHTML === data[i].title) {
            setFilterProject(data[i])
            selection = data[i]
          }
        }
        setLoading(true)


        d3.selectAll('.timelineText')
        .transition(t)
        .style('opacity', d => {
          if(d.program !== selection.program && d.title !== selection.program) { 
            return .4 
          }
          else { 
            return 1 
          }
        })
        d3.selectAll('.timelineBars')
        .transition(t)
        .attr('height', d => {
          if(d.program !== selection.program && d.title !== selection.program) {
            return 1
           }
          else {
             return 6 
          }
        })
      } else {
        let t = d3.transition()
        .duration(500);
        d3.selectAll('.timelineText')
        .transition(t)
        .style('opacity', 1)

        d3.selectAll('.timelineBars')
        .transition(t)
        .attr('height', d => {
          if (d.kind !== "program") {
            return 3;
          } else {
            return 1;
          }
        })
        setFilterProject(false)
      }
    }


      var svg = d3.select(visref.current)
      .append("svg")
      .attr("id", "visSVG")
      .attr("width", width + margin.left+ margin.right )
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

      //scales
      var xScale = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([0, width]);

      var yLineScale = d3.scaleLinear()
      .domain([0, data.length])
      .range([0, height]);

      var levelsNum;

    //setup
    const bgGroup = svg.append("g").attr('id', 'bgGroup');
    const netGroup = svg.append("g").attr('id', 'netGroup');
    const rectGroup = svg.append("g").attr('id', 'rectGroup');
    const pointGroup = svg.append("g").attr('id', 'pointGroup');
    const textGroup = svg.append("g").attr('id', 'textGroup');

      var pointEdgeGradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "pointEdgeGradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");

pointEdgeGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#000")
    .attr("stop-opacity", .6);

pointEdgeGradient.append("stop")
    .attr("offset", "20%")
    .attr("stop-color", "#000")
    .attr("stop-opacity", .05);
 
pointEdgeGradient.append("stop")
    .attr("offset", "80%")
    .attr("stop-color", "#000")
    .attr("stop-opacity", .05);

pointEdgeGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#000")
    .attr("stop-opacity", .6);

var lineEdgeGradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "lineEdgeGradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");

lineEdgeGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#000")
    .attr("stop-opacity", .6);

lineEdgeGradient.append("stop")
    .attr("offset", "20%")
    .attr("stop-color", "#000")
    .attr("stop-opacity", .05);

lineEdgeGradient.append("stop")
    .attr("offset", "90%")
    .attr("stop-color", "#000")
    .attr("stop-opacity", .05);

lineEdgeGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#000")
    .attr("stop-opacity", .6);

var projectGradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "projectGradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

projectGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#fff")
    .attr("stop-opacity", 0);

projectGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#000")
    .attr("stop-opacity", .8);
/*
    var t1 = textures.lines().size(2).strokeWidth(.5), //.orientation("1/8"),
    t2 = textures.lines().size(2.5).strokeWidth(1), //.orientation("2/8"),
    t3 = textures.lines().size(3).strokeWidth(1), //.orientation("3/8"),
    t4 = textures.lines().size(3.5).strokeWidth(1), //.orientation("4/8"),
    t5 = textures.lines().size(4).strokeWidth(1), //.orientation("5/8"),
    t6 = textures.lines().size(4.5).strokeWidth(1), //.orientation("6/8"),
    t7 = textures.lines().size(5).strokeWidth(1); //.orientation("7/8");


var t = [t1, t2, t3, t4, t5, t6, t7];


for (var i = 0; i < t.length; i++) {
    svg.call(t[i]);
*/
      // Create Rect

      rectGroup.selectAll('.timelineBars')
      .data(data)
      .enter()
      .append('rect')
      .attr('id', d => { return d.title })
      .attr('class', d => { return d.subtitle + ' timelineBars ' + d.title })
      .attr('x', d => { return xScale(d.startDate) })
      .attr('y', d => { return yLineScale(d.id) })
      .attr('width', d => { return xScale(d.endDate)-xScale(d.startDate) })
      .attr('height', d => {
        if (d.kind !== "program") {
          return 3;
        } else {
          return 1;
        }
      })
      .attr("fill", d => {
        if (d.kind !== 'program') {
          return "url(#projectGradient)";
        } else {
          return 'rgba(0,0,0,1)' 
        }
      })

      //initial load transition
      .style('opacity', 0)
      .transition()
      .ease(d3.easeLinear)
      .duration(1000)
      .delay( d => { return xScale(d.startDate)*1})
      .style('opacity', 1)
      
      
      textGroup.selectAll('.timelineText')
      .data(data)
      .enter()
      .append('text')
      .attr('id', d => { return d.title.replace(/\s/g,'-') })
      .attr('class', d => { return d.subtitle + ' timelineText ' + d.title + ' ' + d.program; })
      .attr("transform", d => { 
        if (d.kind !== 'program') {
          return "translate("+ (xScale(d.endDate)-3)+","+(yLineScale(d.id)-2)+") rotate(22.5)"
        } else {
          return "translate("+ xScale(d.endDate)+","+(yLineScale(d.id)-4)+") rotate(0)"
        }
      })
      .text( d => { return d.title })
      .on('mouseover', linesMouseover)
      .on('mouseout', linesMouseout)
      .on("click", linesClick)

      //initial load transition
      .style('opacity', 0)
      .transition()
      .ease(d3.easeLinear)
      .duration(1000)
      .delay( d => { return xScale(d.startDate)*1})
      .style('opacity', 1)
      
      var rectHeight = height / levelsNum;
      
      rectGroup.selectAll('.timelineRect')
      .data(data)
      .enter()
      .append('rect')
      .attr('id', function(d) { return d.id })
      .attr('class', 'timelineRect')
      .attr('class', function(d) { return 'timelineRect ' + d.connections; })
      .attr('x', function(d) { return xScale(d.startDateOffset) })
      .attr('y', function(d) {
        if (d.kind == 'program') {
          return yLineScale(d.yPos)-rectHeight;
        } else {
          return  yLineScale(d.yPos)-rectHeight/2;
        }
      })
      .attr('width', function(d) { return xScale(d.endDate)-xScale(d.startDateOffset) })
      .attr('height', function(d) {
        if (d.kind == 'program') {
          return rectHeight;
        } else {
          return  rectHeight/2;
        }
      })
      .attr("fill", d => { return 'rgba(0,0,0,0)'; })
    }, [])

    useEffect(() => {

      const handleResize = () => {
        setDimensions({
          documentWidth: window.innerWidth > 400? window.innerWidth:400,
          documentHeight: (window.innerHeight - 500) > 400? window.innerHeight - 500:400
        })};

        setTimeout(updateVis, 4000)
        window.addEventListener("resize", handleResize);
        //document.body.addEventListener("onresize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
          //document.body.addEventListener("onresize", handleResize);

          }}, [dimensions])

    const updateVis = () => {

      var margin = {top: 50, right: 50, bottom: dimensions.documentHeight/6, left: 50}
      var width = dimensions.documentWidth - margin.left - margin.right
      var height = dimensions.documentHeight - margin.top - margin.bottom;

       //map data
       const projdata = (data) => 
       data.map((d) => {
         const title = d.title
         const subtitle = d.subtitle
         const startDate = new Date(d.start)
         const endDate = new Date(d.end)
         const kind = d.kind
         const program = d.program
         const collaboratorname = d.collaboratorname
         const collaboratorlink = d.collaboratorlink
         const description = d.description
         const image = d.image
         const link = d.link
         return {
           title,
           subtitle,
           startDate,
           endDate,
           kind,
           program,
           collaboratorname,
           description,
           image,
           link,
           collaboratorlink
         }
       })
     
     const projectdata = projdata(rawData)

     //get programs
     const programsData = [...d3.rollup(
       projectdata,
       v => v.length,
       d => d.program
     )].map(d => {
       return {
         title: d[0],
         startDate: projectdata
           .filter(x => x.program == d[0])
           .reduce((date,x) => {
             if (date === null || x.startDate < date) return x.startDate;
             return date;
           }, null)
           ,
         endDate: projectdata
           .filter(x => x.program == d[0])
           .reduce((date,x) => {
             if (date === null || x.endDate > date) return x.endDate;
             return date;
           }, null),
           kind: "program"
       }
     })

     const data = projectdata.concat(programsData)

     const iterate = ((item, index) => {
       item.id = index + 1
     })

     data.forEach(iterate)

     //get min and max Date
     const startDates = []
     const endDates = []

     for (var i = 0; i < projectdata.length; i++) {
       startDates.push(new Date(projectdata[i].startDate))
       endDates.push(new Date(projectdata[i].endDate))
     }
     const minDate = new Date(Math.min.apply(null,startDates))
     const maxDate = new Date(Math.max.apply(null,endDates))

      var xScale = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([0, width]);

      var yLineScale = d3.scaleLinear()
      .domain([0, data.length])
      .range([0, height]);
 
      var levelsNum;
      d3.select('#visSVG')
      .transition()
      .duration(1000)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

      d3.selectAll('.timelineBars')
      .transition()
      .duration(1000)
      .attr('x', d => { return xScale(d.startDate) })
      .attr('y', d => { return yLineScale(d.id) })
      .attr('width', d => { return xScale(d.endDate)-xScale(d.startDate) })
      .attr('height', d => {
        if (d.kind !== "program") {
          return 3;
        } else {
          return 1;
        }
      })
      .attr("fill", d => {
        if (d.kind !== 'program') {
          return "url(#projectGradient)";
        } else {
          return 'rgba(0,0,0,1)' 
        }
      })

      d3.selectAll('.timelineText')
      .transition()
      .duration(1000)
      .attr("transform", d => { 
        if (d.kind !== 'program') {
          return "translate("+ (xScale(d.endDate)-3)+","+(yLineScale(d.id)-2)+") rotate(22.5)"
        } else {
          return "translate("+ xScale(d.endDate)+","+(yLineScale(d.id)-4)+") rotate(0)"
        }
      })

      var rectHeight = height / levelsNum;
      
      d3.selectAll('.timelineRect')
      .transition()
      .duration(1000)
      .attr('x', function(d) { return xScale(d.startDateOffset) })
      .attr('y', function(d) {
        if (d.kind == 'program') {
          return yLineScale(d.yPos)-rectHeight;
        } else {
          return  yLineScale(d.yPos)-rectHeight/2;
        }
      })
      .attr('width', function(d) { return xScale(d.endDate)-xScale(d.startDateOffset) })
      .attr('height', function(d) {
        if (d.kind == 'program') {
          return rectHeight;
        } else {
          return  rectHeight/2;
        }
      })
      .attr("fill", d => { return 'rgba(0,0,0,0)'; })
    };

    const ImageHandler = () => {
      window.addEventListener("load", event => {
        var image = document.querySelector('img');
        var load = image.complete
        console.log(image)
        setLoading(false)
      })  
    }

    return(
        <body>
        <div id="visContainer" ref={visref}>
        </div>
        <div id='description'>
       <div className="descriptionText" style={{display: (filterproject==false) ? 'none' : ''}}>
            <h2 className="descrHead">{filterproject.subtitle}</h2>
            <div>
            <a href={filterproject.link} target="_blank">
                <h4>{filterproject.title} </h4>
            </a>
            </div>
            <h4>{filterproject.start} | {filterproject.kind}</h4>
            <div>
            {filterproject!==false ? <div className="gallery"> <ImageGallery items={filterproject.image} showPlayButton={false} showNav={false}/></div> : <div className="lds-ellipsis" ><div></div><div></div><div></div><div></div></div>}
            </div>
            <div>
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
            <a href="https://www.linkedin.com/in/simon-palmer-profile/" target="_blank"> LinkedIn</a>,
            <a href="https://twitter.com/sim_palmer" target="_blank"> Twitter</a>,
            <a href="https://t.me/simondpalmer" target="_blank"> Telegram</a> or 
            <a href="https://github.com/simondpalmer" target="_blank"> GitHub</a>
            &nbsp; || &nbsp; &copy; Simon Palmer
          </div>
        </footer>
      </div>
        </body>
    )
}

export default VisApp