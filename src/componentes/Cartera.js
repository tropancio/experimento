import React, { Component,useState, useRef, useEffect } from 'react'
import * as math from 'mathjs'
import * as d3 from 'd3'

import Rent from './Rentabilidad.json'
import Riesgo from './Riesgo.json'

import Anual from './Anual.json'
import Trimestral from './Trimestal.json'
import Mes from './Mensual.json'
import Semanal from './Semanl.json'
import Diario from './Diario.json'
import { index } from 'd3'



function Grafico(prom){
    d3.selectAll('.grafico').remove()
    const [data] = [
        prom.retorno.map((e,index)=>[e,prom.riesgo[index]])
    ];
    const svgRef = useRef();


    useEffect(()=>{
        const w=document.getElementById("cajaGrafico").clientWidth-50;
        const h=300;

        const svg=d3.select(svgRef.current)
        .attr('width',w)
        .attr('height',h)
        .style('overflow','visible')
        .style('margin-top','100px');

        const xScale=d3.scaleLinear()
            .domain([math.min(prom.retorno),math.max(prom.retorno)])
            .range([0,w]);

        const yScale=d3.scaleLinear()
            .domain([math.min(prom.riesgo),math.max(prom.riesgo)])
            .range([h,0]);
        
        const xAxis=d3.axisBottom(xScale).ticks(10);
        const yAxis=d3.axisLeft(yScale).ticks(10);

        svg.append('g')
            .call(xAxis)
            .attr('transform',`translate(0,${h})`)
            .attr('class',"grafico")

        svg.append('g')
            .attr('class',"grafico")
            .call(yAxis);
        
        svg.append('text')
            .attr('class',"grafico")
            .attr('x',w/2)
            .attr('y',h+50)
            .text('Retorno');
        
        svg.append('text')
            .attr('class',"grafico")
            .attr('y',h/2)
            .attr('x',-50)
            .text('Riesgo')
        
        svg.selectAll()
            .data(data)
            .enter()
            .append('circle')
                .attr('class',"grafico")
                .attr('cx',d=>xScale(d[0]))
                .attr('cy',d=>yScale(d[1]))
                .attr('r',5);



    }, [data]);

    return(
        <div id="graf">
            <svg ref={svgRef}></svg>
        </div>

        
    )
}

export default class Cartera extends Component {    

    constructor(proms){
        super(proms)

        this.state={
            tiempos:Rent["schema"].fields,
            acciones:Rent["data"],
            riesgo:Riesgo["data"],
            rentabilidad:Rent["data"],

            ini_plas:0,
            ini_acc1:0,
            ini_acc2:0,
            portafolios:15,

            tabla_coor:Diario["data"],

            
            port:[1, 0.93, 0.87, 0.8, 0.73, 0.67, 0.6, 0.53, 0.47, 0.4, 0.33, 0.27, 0.2, 0.13, 0],

            port_rent:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            port_ries:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

        }
    }

    RetornoConjunto=(e)=>(math.round(e*this.state.acciones[this.state.ini_acc1][this.state.tiempos[this.state.ini_plas].name]+(1-e)*this.state.acciones[this.state.ini_acc2][this.state.tiempos[this.state.ini_plas].name],3));

    RiesgoConjunto=(e)=>(math.round(
    (math.pow(e,2)*
    math.pow(this.state.riesgo[this.state.ini_acc1][this.state.tiempos[this.state.ini_plas].name],2))+
    (math.pow(1-e,2)*
    math.pow(this.state.riesgo[this.state.ini_acc2][this.state.tiempos[this.state.ini_plas].name],2))+
    (2*e*(1-e)*
    this.state.tabla_coor[this.state.ini_acc1][this.state.acciones[this.state.ini_acc2].index]*
    this.state.riesgo[this.state.ini_acc1][this.state.tiempos[this.state.ini_plas].name]*
    this.state.riesgo[this.state.ini_acc2][this.state.tiempos[this.state.ini_plas].name])
    ,3));

    

    calcularProporcion =(e)=>{
        const matriz=[]
        const re=[]
        const ri=[]
        for (let i = 0; i < e; i++) {
            const rangos= math.round(1-1/e*i,2)
            matriz.push(rangos)
            re.push(this.RetornoConjunto(rangos))
            ri.push(this.RiesgoConjunto(rangos))     
        }
        this.setState({port:matriz})
        this.setState({port_rent:re})
        this.setState({port_ries:ri})
    } 

    change_Acción1=(e)=>{
        this.setState({ini_acc1:e.target.value})
        this.calcularProporcion(this.state.portafolios)

    }

    change_Acción2=(e)=>{
        this.setState({ini_acc2:e.target.value})
        this.calcularProporcion(this.state.portafolios)
        
    }

    PlazoF =(e)=>{

        this.setState({plas:e.target.value})
        if (this.state.tiempos[e.target.value].name === "Diario") {
            this.setState({tabla_coor:Diario["data"]})
            this.setState({ini_plas:0})
        }
        else{
            if(this.state.tiempos[e.target.value].name === "Semanl"){
                this.setState({tabla_coor:Semanal["data"]})
                this.setState({ini_plas:1})
            }
            else{
                if (this.state.tiempos[e.target.value].name === "Mensual"){
                    this.setState({tabla_coor:Mes["data"]}) 
                    this.setState({ini_plas:2})
                }
                else{
                    if (this.state.tiempos[e.target.value].name === "Trimestal"){
                        this.setState({tabla_coor:Trimestral["data"]}) 
                        this.setState({ini_plas:3})
                    }
                    else{
                        if (this.state.tiempos[e.target.value].name === "Anual") {
                            this.setState({tabla_coor:Anual["data"]}) 
                            this.setState({ini_plas:4})  
                        }
                        else{
                            alert("Error")
                        }
                    }
                }
            }
        }
        this.calcularProporcion(this.state.portafolios)
    }

    render() { 

    return (
        <div>
            <div className="conteiner">
                <div className="row m-4">
                    <div className="col">
                        <div className="row">
                            <div className="col">
                                <table className='table border '>
                                    <thead>
                                        <tr>
                                            <th>
                                                <select name="Plazos" id="Plazos" onChange={this.PlazoF}>
                                                    {this.state.tiempos.map((e,index)=><option value={index} key={e.name}>{e.name}</option>)}
                                                </select>
                                            </th>
                                            <th>Rentabilidad</th>
                                            <th>Riesgo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <select name="Accion1" id="Accion1" onChange={this.change_Acción1}>
                                                    {this.state.acciones.map((e,index)=><option value={index} key={e.index}>{e.index}</option>)}
                                                </select>                            
                                            </td>
                                            <td>
                                                {this.state.acciones[this.state.ini_acc1][this.state.tiempos[this.state.ini_plas].name]}
                                            </td>
                                            <td>
                                                {this.state.riesgo[this.state.ini_acc1][this.state.tiempos[this.state.ini_plas].name]}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <select name="Accion2" id="Accion2"  onChange={this.change_Acción2}>
                                                    {this.state.acciones.map((e,index)=><option value={index} key={e.index}>{e.index}</option>)}
                                                </select>                            
                                            </td>
                                            <td>
                                                {this.state.acciones[this.state.ini_acc2][this.state.tiempos[this.state.ini_plas].name]} 
                                            </td>
                                            <td>
                                                {this.state.riesgo[this.state.ini_acc2][this.state.tiempos[this.state.ini_plas].name]}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>                                  
                            </div>
                        </div>
                        <div className="row m-2" id='cajaGrafico'>
                            <div className="col border p-4 ">
                                <div className="border d-flex justify-content-around">
                                    <input id='carteras' name='carteras' type="range" min="15" max="100" step={5} value={this.state.portafolios}  onChange={e =>{
                                            this.setState({portafolios:e.target.value})
                                            this.calcularProporcion(e.target.value)
                                        } }/> Correlación :                                    
                                    {this.state.tabla_coor[this.state.ini_acc1][this.state.acciones[this.state.ini_acc2].index]}
                               
                                </div>

                                <Grafico  riesgo={this.state.port_ries} retorno={this.state.port_rent}/>                               
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <table className='table table-striped table-hover overflow-auto border' id='tabla'>
                            <thead>
                                <tr>
                                    <th>N° {this.state.portafolios}</th>
                                    <th>{this.state.acciones[this.state.ini_acc1].index}</th>
                                    <th>{this.state.acciones[this.state.ini_acc2].index}</th>
                                    <th>Rentabilidad</th>
                                    <th>Riesgo</th>
                                </tr>
                            </thead>
                            <tbody className='overflow-auto'>
                                {this.state.port.map((e,index)=>
                                    <tr key={`port${index}`}>
                                        <td>{index}</td>
                                        <td>{math.round(e,3)}</td>
                                        <td>{math.round(1-e,3)}</td>
                                        <td>{this.state.port_rent[index]}</td>
                                        <td>{this.state.port_ries[index]}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>                     
                    </div>
                </div>
            </div>
        </div>

    )
  }
}
