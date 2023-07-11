let plot = (data) => {
    const ctx = document.getElementById("plotGuillermo");
    const dataset = {
        labels: data.hourly.time, /* ETIQUETA DE DATOS */
        datasets: [{
          label: 'Temperatura semanal', /* ETIQUETA DEL GRÁFICO */
          data: data.hourly.temperature_2m, /* ARREGLO DE DATOS */
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
    };
    const config = {
        type: 'line',
        data: dataset,
    };
    const myChart = new Chart(ctx, config);

}

let load = (data) => {
    let timeZone = data["timezone"]
    const timeZoneHTML = document.getElementById("timeZone")
    timeZoneHTML.textContent = timeZone
    plot(data);
    loadInocar();

    console.log(data);

}

let loadInocar = () => {
    let URL_PROXY = 'http://cors-anywhere.herokuapp.com/'
    let URL = URL_PROXY+'https://www.inocar.mil.ec/mareas/consultan.php';

    fetch(URL)
    .then(response => response.text())
    .then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data,"text/xml");
        let contenedorMareas = xml.getElementsByClassName('container-fluid')[0];

        let contenedorHTML = document.getElementById('table-container');
        contenedorHTML.innerHTML = contenedorMareas.innerHTML;
        console.log("Esto quiero imprimir",contenedorMareas);
    })
    .catch(console.error);
}

(
    function(){
        let meteo = localStorage.getItem("meteo");
        if(meteo == null){
            let URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m,precipitation_probability,rain,weathercode,windspeed_10m,winddirection_10m,temperature_80m&daily=weathercode,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto';
            fetch( URL )
            .then(response => response.json())
            .then(data => {
                load(data)
                loadInocar();
                /*Guarda DATA en la memoria*/
                localStorage.setItem("meteo", JSON.stringify(data))

            })
            .catch(console.error);
        }else{
            load(JSON.parse(meteo))
        }

        
    }
)();