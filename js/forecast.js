'use strict'

import { getForecastToday, getForecastWeekly } from "./api.js"

const localidade = document.getElementById('local')
const chuva = document.getElementById('chuva')
const temperatura = document.getElementById('temperatura')
const icon = document.getElementById('icon')
const sensacao = document.getElementById('sensacao')
const uv = document.getElementById('uv')
const vento = document.getElementById('vento')
const umidade = document.getElementById('umidade')
const hora = document.getElementById('previsoes_hora')
const input = document.getElementById('search-bar')
const alerta = document.getElementById('alerta')
const btnAlert = document.getElementById('alert-button')
const favoriteStar = document.getElementById('favorite_star')
const semanal = document.getElementById('clima-semanal')
const tipo_previsao = document.getElementById('tipo_previsao')
const hoje = document.getElementById('clima-hora')

let lng = 0
let lat = 0
const date = new Date() 
let yellowStar = "./img/yelowStar.png"

const createHora = async (item) => {
    let hourNumber = Number(item.time.split(" ")[1].split(":")[0])
    if(date.getHours() <=  hourNumber && hourNumber < date.getHours() + 6 ) {
        const div = document.createElement('div')
        div.classList.add('horas')
        div.innerHTML = `
            <span >${item.time.split(" ")[1]}</span>
            <img src=${item.condition.icon} alt="" id="tempo_icon" width="95px">
            <span id="temp_hora">${item.temp_c}°</span>
        `
        tipo_previsao.textContent = "Previsão por hora"
        hora.appendChild(div)
    }
}

let semana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
const createDiaSemana = async (item) => {
    let dayNumber = Number(item.date.split("-")[2])
    console.log(item.date);
    if(date.getDate() <= dayNumber && dayNumber < date.getDate() + 6){
        const div = document.createElement('div')
        div.classList.add('dias')
        div.innerHTML = `
            <span>${semana[new Date(item.date).getDay()+1]}</span>
            <img src=${item.day.condition.icon} alt="" width="95px">
            <span> ${item.day.maxtemp_c}° / ${item.day.mintemp_c}°</span>
        `
        tipo_previsao.textContent = "Semanal"
        hora.appendChild(div)
    }
}

const getDataWeek = async () =>{
    hora.replaceChildren("")

    let data
    if (input.value !== "")
        data = await getForecastWeekly(input.value)
    else 
        data = await getForecastWeekly(lat + "," + lng)

    data.forecast.forecastday.map(createDiaSemana);
    semanal.style.opacity = '100%'
    semanal.style.color = 'whitesmoke'
    hoje.style.opacity = '70%'
    hoje.style.color = '#2B235A'
}


const getData = async () => {
    hora.replaceChildren("")

    let data
    if (input.value !== "")
        data = await getForecastToday(input.value)
    else 
        data = await getForecastToday(lat + "," + lng)

    localidade.textContent = `${data.location.name}, ${data.location.region}`
    chuva.textContent = `chance de chuva: ${data.forecast.forecastday[0].day.daily_chance_of_rain}%`
    temperatura.textContent = data.current.temp_c + "°"
    icon.src = data.current.condition.icon
    sensacao.textContent = data.current.feelslike_c + "°"
    uv.textContent = data.current.uv
    vento.textContent =`${data.current.wind_kph} km/h`
    umidade.textContent = `${data.current.humidity}%`
    
    if (data.alerts.alert == "")
        alerta.textContent = "Não há alertas."
    else
        alerta.textContent = data.alerts.alert[0]

    data.forecast.forecastday[0].hour.map(createHora)   

    semanal.style.opacity = '70%'
    semanal.style.color = '#2B235A'
    hoje.style.opacity = '100%'
    hoje.style.color= 'whitesmoke'
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

const showAlerts = () => {
    var alertaDiv = document.getElementById('alertaDiv');
    if (window.getComputedStyle(alertaDiv).display === "none") {
      alertaDiv.style.display = "block"
    }
}

const favoritar = () => {
    favoriteStar.src = yellowStar
}

input.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        getData()
    }
})
btnAlert.addEventListener('click', showAlerts)
semanal.addEventListener('click', getDataWeek)
hoje.addEventListener('click', getData)