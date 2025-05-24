// Упрощённая симуляция диффузии атомов по границам зёрен (шестигранная сетка)
let cols = 12, rows = 8, cellSize = 30, grid = [], atoms = [], hexPoints = [], heat = 0;
let hexH, hexW, hStep, vStep;
let buttons = [];
let stageLabel;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  hexH = sqrt(3) * cellSize;
  hexW = 2 * cellSize;
  hStep = 0.75 * hexW;
  vStep = hexH;

  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      grid[y][x] = 160;
      let cx = x * hStep + 30;
      let cy = y * vStep + (x % 2 ? 50 + vStep / 2 : 50);
      let pts = [];
      for (let a = 0; a < TWO_PI; a += TWO_PI / 6)
        pts.push(createVector(cx + cos(a) * cellSize, cy + sin(a) * cellSize));
      hexPoints.push(pts);
      let i = floor(random(6));
      atoms.push(new Atom(pts[i], pts[(i + 1) % 6]));
    }
  }

  // Заголовок стадии (над кнопками)
  stageLabel = createP("Выберите температурную стадию");
  stageLabel.style("font-size", "14px");
  stageLabel.style("text-align", "center");
  stageLabel.position(width / 2 - 100, height - 130);

  // Кнопки стадий
  buttons.push(createButton("Комнатная\nтемпература").mousePressed(() => heat = 1));
  buttons.push(createButton("Отжиг").mousePressed(() => heat = 2));
  buttons.push(createButton("Ползучесть").mousePressed(() => heat = 3));

  let spacing = 160;
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style("white-space", "pre");
    buttons[i].position(width / 2 - spacing + i * spacing, height - 90);
  }
}

function draw() {
  background(255);
  hexPoints.forEach((pts, i) => {
    let r = heat === 2 ? 80 : heat === 3 ? 160 : 0;
    let g = grid[floor(i / cols)][i % cols];
    fill(g + r / 5, g - r / 10, g - r / 10);
    beginShape();
    pts.forEach(p => vertex(p.x, p.y));
    endShape(CLOSE);
  });
  atoms.forEach(a => (a.update(heat), a.show()));

  fill(0);
  textSize(14);
  textAlign(CENTER);
  let t = heat === 1 ? "Стадия: комнатная температура (~25°C)" :
          heat === 2 ? "Стадия: отжиг (~300–600°C)" :
          heat === 3 ? "Стадия: ползучесть (>700°C)" :
          "Нет диффузии";
  text(t, width / 2, height - 140);
}

class Atom {
  constructor(start, end) {
    this.start = start.copy();
    this.end = end.copy();
    this.t = random();
    this.dir = random() < 0.5 ? 1 : -1;
    this.v = 0.005 + random(0.005);
  }
  update(lvl) {
    let s = this.v * lvl;
    this.t += this.dir * s;
    if (this.t > 1 || this.t < 0) {
      this.dir *= -1;
      this.t = constrain(this.t, 0, 1);
    }
  }
  show() {
    let p = p5.Vector.lerp(this.start, this.end, this.t);
    push(); fill(30); ellipse(p.x, p.y, 5); pop();
  }
}
