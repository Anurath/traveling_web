// console.log(res.locals.location);
// const apiKey = "e238b24c3f1b4d8897ee4bb62eea0b82";
// const address = `${res.locals.location}, ${res.locals.country}`;
// fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`).then(response => response.json()).then(data => {
//             if (data.results.length > 0) {
//                 const location = data.results[0].geometry;
//                 const map = L.map('map').setView([location.lat, location.lng], 13);
//                 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//                     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 }).addTo(map);
//                 L.marker([location.lat, location.lng]).addTo(map)
//                     .bindPopup(`<b>${data.results[0].formatted}</b>`)
//                     .openPopup();
//             } else {
//                 alert("No results found for the address.");
//             }
//         }).catch(error => console.error("Error fetching data from OpenCage API:", error));