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
const semanal = document.getElementById('clima-semanal')
const tipo_previsao = document.getElementById('tipo_previsao')
const hoje = document.getElementById('clima-hora')
const container = document.getElementById('container')
const logoNome = document.getElementById('nome')
const clima_atual_div = document.getElementById('clima_atual')
const condicao_ar_div = document.getElementById('condicao-ar')

let lng = 0
let lat = 0
const date = new Date() 

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
    hoje.style.opacity = '100%'
    hoje.style.color = '#8fdfff75'
}


const getData = async () => {
    hora.replaceChildren("")

    let indiceUV = ''
    let data
    if (input.value !== "")
    data = await getForecastToday(input.value)
else 
data = await getForecastToday(lat + "," + lng)

localidade.textContent = `${data.location.name}, ${data.location.region}`
chuva.textContent = `chance de chuva: ${data.forecast.forecastday[0].day.daily_chance_of_rain}%`
temperatura.textContent = data.current.temp_c + "°"
if(data.current.condition.icon == '//cdn.weatherapi.com/weather/64x64/night/113.png')
icon.setAttribute('src', './img/night-moon-svgrepo-com.png')
else
icon.src = data.current.condition.icon
sensacao.textContent = data.current.feelslike_c + "°"
if(data.current.uv < 3)
indiceUV = 'Baixo'
else if (data.current.uv < 6)
indiceUV = 'Moderado'
else if (data.current.uv < 8)
indiceUV = 'Alto'
else if (data.current.uv < 11)
indiceUV = 'Muito alto'
else
indiceUV = 'Extremo'
uv.textContent = `${data.current.uv} (${indiceUV})`
vento.textContent =`${data.current.wind_kph} km/h`
umidade.textContent = `${data.current.humidity}%`

if (data.alerts.alert == ""){
    alerta.textContent = "Não há alertas."
    alerta.style.textAlign= 'center'
}
else
alerta.textContent = data.alerts.alert[0].desc

data.forecast.forecastday[0].hour.map(createHora)   

semanal.style.opacity = '100%'
semanal.style.color = '#8fdfff75'
hoje.style.opacity = '100%'
hoje.style.color= 'whitesmoke'

/* responsivo - samsung s20 */
if (width <= 412){
    const barra = document.getElementById('barra')
    const divClima = document.createElement('div')
    const divCondicaoAr = document.createElement('div')

    logoNome. textContent= " "
    hoje.textContent = " "
    semanal.textContent = ""
    barra.textContent = " "
    
    divClima.classList.add('clima_atual_mobile')
    divClima.innerHTML = `
        <div class="localidade">
            <h1 id="local" >${data.location.name}, ${data.location.region}</h1>
        </div>
        <img src=" ${data.current.condition.icon}" alt="" id="icon" width="150px">
        <div class="info_clima_atual">
            <span id="temperatura">${data.current.temp_c}°</span>
        <h1 id="chuva">chance de chuva: ${data.forecast.forecastday[0].day.daily_chance_of_rain}%</h1>
        </div>
    `
    
    clima_atual_div.style.background= "none"
    clima_atual_div.replaceChildren(divClima)


    const condicoes_ar = document.getElementById("condicoes_do_ar")
    condicoes_ar.remove()

    divCondicaoAr.classList.add("condicao_ar_mobile")
    divCondicaoAr.innerHTML = `
        <div class="aspectos" id="aspectos">
            <div class="aspecto2">
                <img src="./img/uv.png" alt="" width="32px" height="32px">
                <h1 id="uv">${data.current.uv}</h1>
                <h2 >UV</h2>
            </div>
            <div class="aspecto3">
                <img src="./img/wind.png" alt="" width="32px" height="32px">
                <h1 id="vento">${data.current.wind_kph} km/h</h1>
                <h2>Vento</h2>
            </div>
            <div class="aspecto4">
                <img src="./img/humidity.png" alt="" width="32px" height="32px">
                <h1 id="umidade">${data.current.humidity}%</h1>
                <h2>Umidade</h2>
            </div>
        </div>
    `
    condicao_ar_div.replaceChildren(divCondicaoAr)

    const previsao = document.getElementById('previsao')
    const footer = document.getElementById('footer')
    
    previsao.remove()
    btnAlert.remove()
    footer.appendChild(previsao)
    tipo_previsao.textContent = ""
    semanal.textContent = "Semanal"
    footer.appendChild(semanal)
    hoje.textContent = "Por hora"
    footer.appendChild(hoje)
    }
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

const alertaDiv = document.getElementById('alertaDiv');
const showAlerts = () => {
    if (window.getComputedStyle(alertaDiv).display === "none") {
        alertaDiv.style.display = "block"
    } else 
        alertaDiv.style.display = "none"
}


/* responsivo - ipad Mini*/
let width = screen.availWidth

const showAlertsIpad = () =>{
    if(width <= 768 && width > 412 && hora.style.opacity !== "0%"){
        // hora.style.opacity = "0%"
        
        container.appendChild(alertaDiv)
        container.style.justifyItems = "center"
        
    } else {
        hora.style.opacity = "100%"
    }
    
}

btnAlert.addEventListener('click', showAlertsIpad)
btnAlert.addEventListener('click', showAlerts)
semanal.addEventListener('click', getDataWeek)
hoje.addEventListener('click', getData)
input.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        getData()
    }
})