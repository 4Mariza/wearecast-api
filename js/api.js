'use strict'

import { API_KEY } from "./constants.js"

export const getForecastToday = async (local) => {
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${local}&days=1&aqi=yes&alerts=yes`
    const response = await fetch(url)
    const data = await response.json()
    return data
}

export const getForecastWeekly = async (local) => {
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${local}&days=7&aqi=yes&alerts=yes`
    const response = await fetch(url)
    const data = await response.json()
    return data
}