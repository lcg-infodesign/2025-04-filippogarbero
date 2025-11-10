// === sketch.js aggiornato ===
// Mantiene tutto il tuo stile originale, aggiungendo solo la funzione di click

let vulcani;
let minLat, maxLat, minLon, maxLon;

function preload() {
// Carica il dataset CSV
vulcani = loadTable('assets/dataset.csv', 'csv', 'header');
}

function setup() {
createCanvas(windowWidth, windowHeight);
background(240);
noLoop();

// Calcolo limiti geografici per mappare i punti
let latVals = vulcani.getColumn('Latitude').map(Number);
let lonVals = vulcani.getColumn('Longitude').map(Number);

minLat = min(latVals);
maxLat = max(latVals);
minLon = min(lonVals);
maxLon = max(lonVals);

drawVolcanoes();
}

function drawVolcanoes() {
background(240);
fill(255, 100, 50);
noStroke();

// Disegna i vulcani come nel tuo sketch originale
for (let i = 0; i < vulcani.getRowCount(); i++) {
let lat = float(vulcani.getString(i, 'Latitude'));
let lon = float(vulcani.getString(i, 'Longitude'));

let x = map(lon, minLon, maxLon, 50, width - 50);
let y = map(lat, maxLat, minLat, 50, height - 50);

ellipse(x, y, 8, 8);
}
}

function mousePressed() {
// Se il dataset non è caricato, esci
if (!vulcani) return;

// Controlla se il clic è vicino a un punto vulcano
for (let i = 0; i < vulcani.getRowCount(); i++) {
let lat = float(vulcani.getString(i, 'Latitude'));
let lon = float(vulcani.getString(i, 'Longitude'));

let x = map(lon, minLon, maxLon, 50, width - 50);
let y = map(lat, maxLat, minLat, 50, height - 50);

// Se il clic è entro 6px dal centro del punto
if (dist(mouseX, mouseY, x, y) < 6) {
let nome = vulcani.getString(i, 'Volcano Name');
nome = encodeURIComponent(nome);

// Apre volcano.html nella stessa finestra
window.location.href = `volcano.html?id=${nome}`;
break;
}
}
}