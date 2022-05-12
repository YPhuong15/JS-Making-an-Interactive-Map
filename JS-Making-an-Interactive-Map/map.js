
const myMap = {
    coordinates: [],
    businesses: [],
    map: [],
    markers: [],


    buildMap() {
        this.map = L.map('map', {
            center: this.coordinates,
            zoom: 12
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: '15',
        }).addTo(this.map)

        const marker = L.marker(this.coordinates)
        marker.addTo(this.map)
            .bindPopup('<p1><b>You are here</b></p1>')
            .openPopup()

    },

}

async function getCoords() {
    const position = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [position.coords.latitude, position.coords.longitude]
}

async function getBusiness(business) {
    const options = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'fsq3Eur5bFCgJkoWnIUD4l265lCWzzIBtebxpYPA1yTiNJ8='
        }
      }
    let limit = 5
	let lat = myMap.coordinates[0]
	let lon = myMap.coordinates[1]
	let response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses
}

function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}

window.onload = async () => {
	const coords = await getCoords()
	myMap.coordinates = coords
	myMap.buildMap()
}


    document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	let data = await getBusiness(business)
    myMap.businesses = processBusinesses(data)
    myMap.addMarkers()
})