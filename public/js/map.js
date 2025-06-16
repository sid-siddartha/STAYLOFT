mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: coordinates,
  zoom: 15,
});




const marker = new mapboxgl.Marker({color : '#212121'})
    .setLngLat(coordinates) //Listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({offset: 40})
    .setHTML("<p>Exact Location provided after booking!</p>")
    .setMaxWidth("300px"))
    .addTo(map);