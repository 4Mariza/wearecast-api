'use strict'

import { getForecastToday } from "./api.js"

const localidade = document.getElementById('local')
const chuva = document.getElementById('chuva')
const temperatura = document.getElementById('temperatura')
const icon = document.getElementById('icon')
const sensacao = document.getElementById('sensacao')
const uv = document.getElementById('uv')
const vento = document.getElementById('vento')
const umidade = document.getElementById('umidade')
const hora = document.getElementById('previsoes_hora')

let lat = 0
let lng = 0

let local = ""
const date = new Date()

const createHora = async (item) => {
    let hourNumber = Number(item.time.split(" ")[1].split(":")[0])
    if(date.getHours() <=  hourNumber && hourNumber < date.getHours() + 5) {
        const div = document.createElement('div')
        div.classList.add('horas')
        div.innerHTML = `
            <span >${item.time.split(" ")[1]}</span>
            <img src=${item.condition.icon} alt="" id="tempo_icon" width="95px">
            <span id="temp_hora">${item.temp_c}°</span>
        `
        hora.appendChild(div)
    }
    
}

const getData = async () => {
    let data
    if(local != ""){
        data  = await getForecastToday(local)
    } else {
        data = await getForecastToday(lat + "," + lng)
    }

    data.forecast.forecastday[0].hour.map(createHora)
    
    console.log(lat + "," + lng)
    console.log(data)

    localidade.textContent = data.location.name
    chuva.textContent = `chance de chuva: ${data.forecast.forecastday[0].day.daily_chance_of_rain}%`
    temperatura.textContent = data.current.temp_c + "°"
    icon = data.current.condition.icon
    sensacao.textContent = data.current.feelslike_c + "°"
    uv.textContent = data.current.uv
    vento.textContent = data.current.wind_kph
    
}
    

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      lat = position.coords.latitude
      lng = position.coords.longitude
      console.log(`Latitude: ${lat}, Longitude: ${lng}`)
      getData()
    })
  } else {
    console.log("Geolocation is not supported by this browser.")
}


