// ===================== VARIABILI GLOBALI =====================
let vulcani;                 // Oggetto Table per caricare il CSV dei vulcani
let vulcaniData = [];        // Array che conterrà i dati dei vulcani pre-elaborati
let selectedCategory = null; // Categoria selezionata (null = nessuna, mostra tutti)

// Definizione delle categorie con colore e forma
let categories = [
  { name: 'Stratovolcano', color: 'red', shape: 'triangle' },
  { name: 'Cone', color: 'orange', shape: 'triangle' },
  { name: 'Crater System', color: 'yellow', shape: 'ellipse' },
  { name: 'Other / Unknown', color: 'grey', shape: 'ellipse' },
  { name: 'Shield Volcano', color: 'green', shape: 'ellipse' },
  { name: 'Maars / Tuff ring', color: 'purple', shape: 'ellipse' },
  { name: 'Caldera', color: 'blue', shape: 'ellipse' },
  { name: 'Submarine Volcano', color: 'cyan', shape: 'triangle' },
  { name: 'Subglacial', color: 'brown', shape: 'triangle' }
];

// ===================== PRELOAD =====================
function preload() {
  vulcani = loadTable('assets/dataset.csv', 'csv', 'header'); // Carica CSV prima di setup
}

// ===================== SETUP =====================
function setup() {
  createCanvas(windowWidth, windowHeight); // Canvas a tutta finestra
  textAlign(CENTER, CENTER);               // Testo centrato orizzontalmente e verticalmente
  noStroke();                              // Disabilita bordi di default

  // ====== TROVA MIN/MAX LATITUDINE E LONGITUDINE ======
  let latMin = Number.MAX_VALUE;
  let latMax = -Number.MAX_VALUE;
  let lonMin = Number.MAX_VALUE;
  let lonMax = -Number.MAX_VALUE;

  for (let i = 0; i < vulcani.getRowCount(); i++) {
    let lat = float(vulcani.getString(i, "Latitude"));
    let lon = float(vulcani.getString(i, "Longitude"));
    if (lat < latMin) latMin = lat;
    if (lat > latMax) latMax = lat;
    if (lon < lonMin) lonMin = lon;
    if (lon > lonMax) lonMax = lon;
  }

  // ====== PRE-ELABORAZIONE DEI DATI DEI VULCANI ======
  for (let i = 0; i < vulcani.getRowCount(); i++) {
    let nome = vulcani.getString(i, "Volcano Name");
    let lat = float(vulcani.getString(i, "Latitude"));
    let lon = float(vulcani.getString(i, "Longitude"));
    let categoria = vulcani.getString(i, "TypeCategory");
    let altezza = float(vulcani.getString(i, "Elevation (m)")) || 0;

    let x = map(lon, lonMin, lonMax, 50, width - 50);
    let y = map(lat, latMax, latMin, 100, height - 50);
    let size = map(altezza, 0, 6000, 10, 50);

    vulcaniData.push({ x, y, size, categoria, nome, altezza });
  }
}

// ===================== DRAW =====================
function draw() {
  background(255);   
  drawHeader();

  // ====== DISEGNA VULCANI FILTRATI ======
  for (let v of vulcaniData) {
    if (!selectedCategory || v.categoria === selectedCategory) {
      drawVulcano(v.x, v.y, v.categoria, v.size);
    }
  }

  // ====== TOOLTIP ======
  for (let v of vulcaniData) {
    if ((!selectedCategory || v.categoria === selectedCategory) &&
        dist(mouseX, mouseY, v.x, v.y) < v.size / 2) {
      fill(255, 255, 200);
      stroke(0);
      strokeWeight(1);
      rect(mouseX + 10, mouseY - 20, 180, 50, 5);
      noStroke();
      fill(0);
      textSize(12);
      text(`${v.nome}\nCategoria: ${v.categoria}\nAltezza: ${v.altezza} m`,
           mouseX + 100, mouseY + 5);
      break; // Mostra solo un tooltip alla volta
    }
  }
}

// ===================== FUNZIONE CLICK =====================
function mousePressed() {
  // Controlla se cliccato su un vulcano
  for (let v of vulcaniData) {
    if ((!selectedCategory || v.categoria === selectedCategory) &&
        dist(mouseX, mouseY, v.x, v.y) < v.size / 2) {
      // Usa nome come ID nella pagina dettagli
      let vulcanoId = encodeURIComponent(v.nome);
      window.location.href = `vulcano.html?id=${vulcanoId}`;
      break;
    }
  }

  // Controllo click sulle categorie nella legenda (per filtro)
  let headerHeight = 100;
  if (mouseY < headerHeight) {
    let spacing = width / (categories.length + 1);
    for (let i = 0; i < categories.length; i++) {
      let cat = categories[i];
      let xPos = spacing * (i + 1);
      let yPos = 60;
      if (dist(mouseX, mouseY, xPos, yPos) < 15) { // Click sulla forma
        if (selectedCategory === cat.name) {
          selectedCategory = null; // Deseleziona
        } else {
          selectedCategory = cat.name;
        }
        break;
      }
    }
  }
}

// ===================== FUNZIONE PER DISEGNARE UN VULCANO =====================
function drawVulcano(x, y, categoria, size) {
  push();
  translate(x, y);

  switch (categoria.toLowerCase()) {
    case 'stratovolcano':
      fill('red'); 
      triangle(0, -size / 2, -size / 2, size / 2, size / 2, size / 2);
      break;
    case 'cone':
      fill('orange'); 
      triangle(0, -size / 3, -size / 3, size / 3, size / 3, size / 3);
      break;
    case 'crater system':
      fill('yellow'); 
      ellipse(0, 0, size * 0.8, size * 0.8);
      break;
    case 'other / unknown':
      fill('grey'); 
      ellipse(0, 0, size / 2, size / 2);
      break;
    case 'shield volcano':
      fill('green'); 
      ellipse(0, 0, size, size / 2);
      break;
    case 'maars / tuff ring':
      fill('purple'); 
      stroke(0); strokeWeight(1);
      ellipse(0, 0, size, size);
      noStroke();
      break;
    case 'caldera':
      fill('blue'); 
      ellipse(0, 0, size * 1.2, size * 1.2);
      break;
    case 'submarine volcano':
      fill('cyan'); 
      triangle(-size / 2, size / 2, size / 2, size / 2, 0, -size / 3);
      break;
    case 'subglacial':
      fill('brown'); 
      triangle(-size / 2, -size / 2, size / 2, -size / 2, 0, size / 2);
      break;
    default:
      fill('black'); 
      ellipse(0, 0, size / 2, size / 2);
  }

  pop();
}

// ===================== HEADER / LEGENDA =====================
function drawHeader() {
  let headerHeight = 100;
  fill(255);
  noStroke();
  rect(0, 0, width, headerHeight);

  textAlign(CENTER, CENTER);
  fill(0);
  textSize(20);
  text("Type Category Vulcani (clicca per filtrare)", width / 2, 25);

  let spacing = width / (categories.length + 1);

  for (let i = 0; i < categories.length; i++) {
    let cat = categories[i];
    let xPos = spacing * (i + 1);
    let yPos = 60;

    fill(cat.color);
    noStroke();
    if (cat.shape === 'triangle') {
      triangle(xPos, yPos - 7, xPos - 7, yPos + 7, xPos + 7, yPos + 7);
    } else if (cat.shape === 'ellipse') {
      ellipse(xPos, yPos, 15, 15);
    }

    fill(0);
    textSize(12);
    text(cat.name, xPos, yPos + 20);
  }
}
