import React, { Component } from 'react'

function Card(props){

  return(
    <div className="container">
          <div className="card">
            <img src={props.imagen}/>
            <div className="card-body ">      
              <h4 className='card-title'><a href={props.enlace}>{props.titulo}</a></h4>
              <p className="card-text text-secondary">{props.texto}</p>
            </div>
          </div>          
        </div>
  )
  
}



export default Card;