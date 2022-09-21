import React, { Component, useRef,useState } from 'react'
import cards from './Acciones'

import SwiperCore, { Virtual, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import "./stylo.css"

SwiperCore.use([Virtual, Navigation, Pagination]);

export default function Carrusel() {
  const [swiperRef, setSwiperRef] = useState(null);
  const appendNumber = useRef(500);
  const prependNumber = useRef(1);
  // Create array with 500 slides
  const [slides, setSlides] = useState(
    Array.from({ length: 500 }).map((_, index) => `Slide ${index + 1}`)
  );

  const prepend = () => {
    setSlides([
      `Slide ${prependNumber.current - 2}`,
      `Slide ${prependNumber.current - 1}`,
      ...slides,
    ]);
    prependNumber.current = prependNumber.current - 2;
    swiperRef.slideTo(swiperRef.activeIndex + 2, 0);
  };

  const append = () => {
    setSlides([...slides, 'Slide ' + ++appendNumber.current]);
  };

  const slideTo = (index) => {
    swiperRef.slideTo(index - 1, 0);
  };

  return (
    <>
      <div className="container">
        <div className="row">

            {cards.map((e,index)=>(
              <div key={index} className="col-4 col-sm-3 col-md-2 ">
                <button className='btn border' onClick={() => slideTo(e.id)} key={`boton_${index}`}>{e.titulo} </button>
              </div>
            ))}

        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col">
            <Swiper 
              onSwiper={setSwiperRef}
              slidesPerView={1}
              centeredSlides={true}
              modules={[Navigation,Pagination]}
              pagination={{
                type: 'fraction',
              }}
              navigation={true}
              virtual>

                {cards.map((e, index) => (
                  <SwiperSlide key={`slide${index}`}>
                    <img src={e.imagen} key={`img${index}`} />
                  </SwiperSlide>
                ))}          


            </Swiper>            
          </div>
        </div>
      </div>
    </>
  );
}
