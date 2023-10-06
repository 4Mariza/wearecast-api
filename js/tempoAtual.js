import { getForecast } from "./tempoAtualMain";

const input = document.getElementById('search-bar')

async function pegarPrevisao (){
    const info = await getForecast(input.value)

    console.log(info.location);
    
    return info
}

pegarPrevisao()
input.addEventListener('focusout', pegarPrevisao)
