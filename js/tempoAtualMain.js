'use strict'

async function getForecast(local) {
    const url = `http://api.weatherapi.com/v1/current.json?key=d20989d431954814a32225707232209&q=${local}&aqi=yes`
    const response = await fetch(url)
    const data = await response.json()
    return data
}

export {
    getForecast
}