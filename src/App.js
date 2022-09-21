import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import * as d3 from "d3";

import './App.css'
import Carrusel from './componentes/carrusel';
import Cartera from './componentes/Cartera'


export default class App extends Component {



  render() {

    return (
      <div className='App'>
        <div className="container">
          <div className="col">
            <div className="row">
              <h2 className='title'>Grafico de tendencia</h2>
            </div>
            <div className="row">
              <Carrusel/>
            </div>
            <div className="row">
              <h2 className='title'>Cartera de Acciones</h2>
            </div>
            <div className="row">
              <Cartera/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

