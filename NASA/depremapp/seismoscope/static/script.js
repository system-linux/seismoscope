var map = L.map('map').setView([38.9637, 35.2433], 5); // Set coordinates to the middle of Turkey and an appropriate zoom level

const mapThings = [];

var lastDeprem = 80;
var lastDepremId = "";
var firstTime = true;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, // Increase maxZoom for better detail
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map); // Add the tile layer to the map

function addToLast(anchorText){
    var div1 = document.createElement("div");
    div1.className='panel2';
    var h21 = document.createElement("h2");
    h21.innerHTML = anchorText;
    div1.appendChild(h21);
    document.getElementById("lastEarthquakes").appendChild(div1);
}
  
function fetchDataAndProcess() {
    const apiUrl = `https://api.orhanaydogdu.com.tr/deprem/kandilli/live?limit=${lastDeprem}`;
  
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
            if (firstTime) { 
                lastDepremId=data["result"]["0"]["earthquake_id"];
                firstTime=(!firstTime);
                data["result"].forEach(function (earthquake) {
                        addToLast(`<b>${earthquake["title"]}</b> | ${earthquake["mag"]}`)
                        mapThings.push(L.circle([earthquake["geojson"]["coordinates"]["1"], earthquake["geojson"]["coordinates"]["0"]], {
                            color: (earthquake["mag"] / earthquake["depth"] >= 0 && earthquake["mag"] / earthquake["depth"] <= 0,3) ? 'green' : (earthquake["mag"] / earthquake["depth"] >= 0,4 && earthquake["mag"] / earthquake["depth"] <= 0,6 ) ? 'yellow' : 'red',
                            fillColor: (earthquake["mag"] / earthquake["depth"] >= 0 && earthquake["mag"] / earthquake["depth"] <= 0,3) ? '#0f3' : (earthquake["mag"] / earthquake["depth"] >= 0,4 && earthquake["mag"] / earthquake["depth"] <= 0,6 ) ? '#ff0' : '#f03',
                            fillOpacity: 0.5,
                            radius: earthquake["mag"]*earthquake["depth"]*70
                        }).addTo(map).bindPopup(`<b>${earthquake["title"]}</b><br>Şiddet: ${earthquake["mag"]}ml<br>Derinlik: ${earthquake["depth"]}km<br><br>Kaynak: <b>${earthquake["provider"].toUpperCase()}</b>`));
                });
            } else {
                if (!(data["result"]["0"]["earthquake_id"] === lastDepremId)) {
                    mapThings.forEach(function (thing) {
                        map.removeLayer(thing) 
                    });
                    lastDepremId=data["result"]["0"]["earthquake_id"];
                    data["result"].forEach(function (earthquake) {
                        mapThings.push(L.circle([earthquake["geojson"]["coordinates"]["1"], earthquake["geojson"]["coordinates"]["0"]], {
                            color: (earthquake["mag"] / earthquake["depth"] >= 0 && earthquake["mag"] / earthquake["depth"] <= 0,3) ? 'green' : (earthquake["mag"] / earthquake["depth"] >= 0,4 && earthquake["mag"] / earthquake["depth"] <= 0,6 ) ? 'yellow' : 'red',
                            fillColor: (earthquake["mag"] / earthquake["depth"] >= 0 && earthquake["mag"] / earthquake["depth"] <= 0,3) ? '#0f3' : (earthquake["mag"] / earthquake["depth"] >= 0,4 && earthquake["mag"] / earthquake["depth"] <= 0,6 ) ? '#ff0' : '#f03',
                            fillOpacity: 0.5,
                            radius: earthquake["mag"]*earthquake["depth"]*70
                        }).addTo(map).bindPopup(`<b>${earthquake["title"]}</b><br>Şiddet: ${earthquake["mag"]}ml<br>Derinlik: ${earthquake["depth"]}km<br><br>Kaynak: <b>${earthquake["provider"].toUpperCase()}</b>`));
                        addToLast(`<b>${earthquake["title"]}</b> | ${earthquake["mag"]}`)
                    });
                }
            }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
    }
  // Call the function immediately to fetch data
fetchDataAndProcess();
  
  // Set up an interval to fetch data every 1 minute (60,000 milliseconds)
setInterval(fetchDataAndProcess, 60000);

function refreshMap() {
    const apiUrl = `https://api.orhanaydogdu.com.tr/deprem/kandilli/live?limit=${lastDeprem}`;
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        mapThings.forEach(function (thing) {
            map.removeLayer(thing) 
        });
        lastDepremId=data["result"]["0"]["earthquake_id"];
        data["result"].forEach(function (earthquake) {
            mapThings.push(L.circle([earthquake["geojson"]["coordinates"]["1"], earthquake["geojson"]["coordinates"]["0"]], {
                color: (earthquake["mag"] / earthquake["depth"] >= 0 && earthquake["mag"] / earthquake["depth"] <= 0,3) ? 'green' : (earthquake["mag"] / earthquake["depth"] >= 0,4 && earthquake["mag"] / earthquake["depth"] <= 0,6 ) ? 'yellow' : 'red',
                fillColor: (earthquake["mag"] / earthquake["depth"] >= 0 && earthquake["mag"] / earthquake["depth"] <= 0,3) ? '#0f3' : (earthquake["mag"] / earthquake["depth"] >= 0,4 && earthquake["mag"] / earthquake["depth"] <= 0,6 ) ? '#ff0' : '#f03',
                fillOpacity: 0.5,
                radius: earthquake["mag"]*earthquake["depth"]*70
            }).addTo(map).bindPopup(`<b>${earthquake["title"]}</b><br>Şiddet: ${earthquake["mag"]}ml<br>Derinlik: ${earthquake["depth"]}km<br><br>Kaynak: <b>${earthquake["provider"].toUpperCase()}</b>`));
        });
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
}

document.getElementById("refresh-button").onclick=function(){
    refreshMap();
}

document.getElementById("sondeprembutton").onclick=function(){
    lastDeprem = document.getElementById("inputSonDeprem").value;
    refreshMap();
}
var secimElementi = document.getElementById("mapSelect");
secimElementi.addEventListener("change", function() {
  var secilenDeger = secimElementi.value;
  if (secilenDeger === "map1") {
    document.getElementById("inputSonDeprem").style.display="block";
    document.getElementById("sondeprembutton").style.display="block";
    document.getElementById("input-label").style.display="block";
  } else {
    document.getElementById("inputSonDeprem").style.display="none";
    document.getElementById("sondeprembutton").style.display="none";
    document.getElementById("input-label").style.display="none";
  }
});