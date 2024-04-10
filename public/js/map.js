
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style:"mapbox://styles/mapbox/streets-v12",//style url
    center:[77,28], // starting position [lng, lat]
    zoom: 5 // starting zoom
});

// Check if listing and its geometry are defined before accessing coordinates
if (listing && listing.geometry && listing.geometry.coordinates) {
    const coordinates = listing.geometry.coordinates;

    const marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h4>${listing.title}</h4><p>Exact Location provided after booking</p>`)
        )
        .addTo(map);

    // Set the map center to the listing's coordinates
    map.setCenter(coordinates);
} else {
    console.error('Error: Listing or its coordinates are undefined.');
}

//listing.location


// const marker2=new mapboxgl.Marker({color:'red'})
// .setLngLat(listing.geometry.coordinates)
// .setPopup(new mapboxgl.Popup({
//     offset:25,
// })
// .setHTML(`<h4>${listing.location}</h4><p>Exact Location provided after booking</p>`)
// )
// .addTo(map);