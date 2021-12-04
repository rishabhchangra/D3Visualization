document.addEventListener("DOMContentLoaded", function() {
//read the data from data.json file 
const data=d3.json('data.json').then((data)=>{                          

// disabled restart button till the year reaches 2020

document.getElementById("button").disabled = true; 

//made an array for all the programming languages

lang= Object.keys(data[0]).slice(1,data[0].length)                      

// array for year and programming languages in sorted order
keyframes=[];                                                             

//adding elements in keyframes array
data.forEach(x=> {keyframes.push([x.Year, rank(x)])}) 

len=keyframes.length; 
first_year=keyframes[0][0];                     

//maximum possible value for the questions count
let maxCount=d3.max(keyframes.map(x=> x[1].map(c=>c.value)).map(m=>Math.max(...m)))                     


//function to return the corresponding color from the diverging color scheme of  RdYlGn, where Rd is red, Yl is yellow and Gn is green.
//from d3player.html. 100% used
//used this for bars getting updated on the screen
let color = d3.scaleSequential()                                                        
    .domain([0,maxCount+20])                                                           
    .interpolator(d3.interpolateRdYlGn)                                                 
    

// function to return the corresponding color from the diverging color scheme of blues
// from d3player.html. 100% used
// used this function only for bars entering the screen 

let color_blue = d3.scaleSequential()                                                       
    .domain([0,maxCount])
    .interpolator(d3.interpolateBlues)

//creating margins
 const margin = {                                                                        
        top: 50,
        right: 20,
        bottom: 30,
        left: 50
    }

//const width and height which will be used for d3 svg
const width = 600 - margin.left - margin.right;                                                 
const height = 500 - margin.top - margin.bottom;


//scaling the x axis as per the width 
let x = d3.scaleLinear()                                                                        
    .range([0, width])
    .domain([0, 200])

//creating the x axis and scaling it as per x
let xaxis =  d3.axisTop().scale(x)                                                              

// creating d3 svg element // from  d3Easy3.html. 50% used. made changes to translate function, width, height as per my program
 const svg = d3.select("#letter")                                                               
    .attr("width", width+300)
    .attr("height", 500)
    .append("g")                                                                                //appending x axis to the svg 
    .attr("transform", `translate( ${150}, ${100})`)
      .call(xaxis)
 


// appending text to svg element
 svg.append('text')                                                                                 
    .attr("text-anchor","end")
    .attr("vertical-align","central")
    .text('Based on the number of questions per language on Stackoverflow')
    .attr('x', 550)
    .attr('y', -50)
    .style('font-size', 20)
    .style('letter-spacing', '0.8')
    .style('fill', 'black')
    .attr('stroke',"black")
    .style('font-family',  'Trebuchet MS');





//creating event on button using d3.select to call toggle function
d3.select("#button").on("click", toggle);                                                           

//number of languages to be displayed    
n=10;
//initialising index=0 for the first year                                                                                                                                       
index=0;                                                                                                        


//calling update function to display bar chart,values for first year
update(keyframes[index])                                                                            

// creating interval using d3.interval to update function every 3 seconds and stop the interval once the index has the reached the last element
// from https://stackoverflow.com/questions/46690926/clear-the-interval-in-d3-js/46691090
// changed the if elsse condition as per my program

var interval=d3.interval(()=>{                                                                      
if (index<len) update(keyframes[index])                                                                                                                                                          
else {                                                                                              
        interval.stop();
        if (index==len)
        document.getElementById("button").disabled = false;                                         //enabling restart button to call toggle function
        }
    },4000);




//function used to create an array of objects with language name and value and then sort the languages in descending order for every year as per the value 

function rank(data){
const x = Array.from(lang, name => ({name, value: data[name]}));
x.sort((a, b) =>b.value-a.value);


return x;

}



/*function to start the interval again and call update function to display for every year*/
   
function toggle() {                                     
   index=0; 
   document.getElementById("button").disabled = true;       
   
   update(keyframes[index]);
  
     var interval=d3.interval(()=>{
    if (index<len) update(keyframes[index])
    else {
        interval.stop();
        if (index==len)
        document.getElementById("button").disabled = false;
        }
    },4000)
   

}



/*function to call enter,update, exit functions to display bar chart and values for every year and every language*/

//from d3Easy3.html 
//40% used. made changes to the y, it will be be scaled for top 10 languages for every year, as only 10 languages are displayed on the screen
//changed enter,update and exit transitions as per my data. added count and year text 

function update(data) {

  y = d3.scaleBand()
    .range([0, height])
    .domain(data[1].map((d, i) => d.name))


//adding horizontal bar for every language(top n) 
  
   svg.selectAll('rect')
    .data(data[1].slice(0,n), d => d.name)
    .join(
        enter => {                                      //enter function for bars entering the screen
            enter.append('rect')
            .attr('x', x(0))
            .attr('y', d => y(d.name))
            .attr('stroke', () => {
              if(data[0] == first_year)                     //for first year the stroke would be black, otherwise whenever a new bar enters, the stroke is blue 
                return 'black'
              else 
                return 'blue'
            })
            .attr('fill',(d)=>{
              if(data[0] == first_year)                     //for first year the bar fill would be RdYlGn, otherwise whenever a new bar enters, the fill will be diverging color scheme of blues 
                return(color(d.value))
              else 
                return (color_blue(d.value))
        })
            .style('opacity', 1)
            .attr('height', y.bandwidth())
            .attr('width', d=> Math.ceil(x(d.value)))
            
        },

        //update function for updating the bars which stayed on the screen
        update =>                                       
            {
            update
            .transition().duration(1000)
            .attr('stroke', 'black')
            .attr('width', d=> Math.ceil(x(d.value)))
            .attr('fill',d=> `${color(d.value)}`)
            .attr('height',y.bandwidth())
            .attr('y', d=> y(d.name))
        },

        //rectsToRemove function for removing the bars from the screen
        rectsToRemove => 
            rectsToRemove
            .attr('stroke', () => {
              if(data[0] == first_year) 
                return 'black'
              else 
                return 'red'
            })
            .style('opacity',()=> {
            if(data[0] == first_year) 
                return 0
              else 
                return 1
            })
            .attr('fill','red')
            .transition().duration(1000)
                .attr('transform', d=>` translate(${x(0)},${y(d.name)+500})`) 
                .remove()
            

       

    )


//adding label for every language(top n) 

    svg.selectAll('.label')
    .data(data[1].slice(0,n), d => d.name)
    .join(
        enter => 
            enter.append('text')
            .attr("class","label")
            .attr('height', y.bandwidth())
            .attr("text-anchor","end")
            .attr("vertical-align","central")
            .style('font-size', 12)
            .style('fill', 'black')
            .style('font-family',  'Trebuchet MS')
            .attr('transform',d=>`translate(${x(0)-10}, ${y(d.name)+ y.bandwidth()*3/4}) scale(${y.bandwidth()/20})`)
            .text(d=>d.name)
            .attr('stroke', () => {
              if(data[0] == first_year) 
                return 'black'
              else 
                return 'blue'
            }),
        update => 
            update.transition().duration(1000)
            .attr('transform',d=>`translate(${x(0)-10},${y(d.name)+y.bandwidth()*3/4}) scale(${y.bandwidth()/20})`)
            .attr('stroke',"black"),
        labelsToRemove => 
            labelsToRemove
            .attr('stroke',"red")
            .style('opacity',()=> {
            if(data[0] == first_year) 
                return 0
              else 
                return 1
            })
            .transition().duration(1000)
                .attr('transform',d=> `translate(${x(0)-10},${y(d.name)+500})`)
                .remove()
            ) 



//adding count for every language(top n) 

    svg.selectAll('.count')       
    .data(data[1].slice(0,n), d => d.value)
    .join(
        enter => 
            enter.append('text')
            .style('opacity', 1)  
            .attr("class","count")
            .attr("text-anchor","end")
            .attr("vertical-align","central")
            .style('font-family',  'Trebuchet MS')
            .attr('transform',(d)=>{
                if (d.value<5)
                    return `translate(${Math.ceil(x(d.value))+10}, ${y(d.name)+ y.bandwidth()*3/4}) scale(${y.bandwidth()/20})`
                else 
                    return `translate(${Math.ceil(x(d.value))-5}, ${y(d.name)+ y.bandwidth()*3/4}) scale(${y.bandwidth()/20})`
        })
            .text(d=>Math.ceil(d.value))
            .attr('stroke',"black"),
        update => 
            update.transition().duration(1000)
            .attr('transform',d=>`translate(${Math.ceil(x(d.value))-5},${y(d.name)+y.bandwidth()*3/4}) scale(${y.bandwidth()/20})`)
            .attr('stroke',"black"),
        remove => 
                remove
                .transition().duration(500)
                .style('opacity', 0)  
                .remove()
            
                
            ) 


//adding year 

    svg.selectAll('.year')       
    .data(data[0])
    .join(
        enter => 
            enter.append('text')
            .attr("class","year")
            .attr("vertical-align","central")
            .text(data[0])
            .attr('x', 400)
            .attr('y', 300)
            .style('font-size', 40)
            .style('fill', 'black')
            .style('background','white')
            .attr('stroke',"black")
            .style('font-family', 'Trebuchet MS'),
        update => 
            update
            .transition().duration(()=>{
                if(data[0] == first_year) 
                return 0
                else 
                return 1000

            })
            .text( data[0])
            .attr('stroke',"black"),
        remove => 

                remove
                .transition().duration(200)
                .style('opacity', 0)  
                .remove()
            
                
            )


//incrementing the index for next year iteration
    index=index+1;  



        }




    })

})


