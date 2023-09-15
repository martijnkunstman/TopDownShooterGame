const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const squareSize = 100;
const gridSpacing = squareSize; // Gap between squares is now equal to squareSize
const gridSize = 11;

let offsetX = 0;
let offsetY = 0;

let offsetXX = 0;
let offsetYY = 0;

let animateX = 0;
let animateY = 0;

const depths = [
  { scale: 0.7, alpha: 0.1 },
  { scale: 0.8, alpha: 0.2 },
  { scale: 0.9, alpha: 0.4 },
  { scale: 1, alpha: 0.8 },
];

function drawGrid() {
  let offsetXOld = offsetXX;
  let offsetYOld = offsetYY;
  //damping
  offsetXX += (offsetX - offsetXOld) * 0.01;
  offsetYY += (offsetY - offsetYOld) * 0.01;

  let animateXOld = animateX;
  let animateYOld = animateY;
  //damping
  animateX += (animateX + offsetXX / 100 - animateXOld) * 0.01;
  animateY += (animateY + offsetYY / 100 - animateYOld) * 0.01;

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      let previousCorner = null;

      depths.forEach((depth) => {
        const adjustedSize = squareSize * depth.scale;
        const totalSizeWithSpacing = adjustedSize + gridSpacing;
        let x =
          col * totalSizeWithSpacing +
          (canvas.width - (gridSize * totalSizeWithSpacing - gridSpacing)) / 2 +
          offsetXX -
          (offsetXX - offsetX) * depth.scale;
        let y =
          row * totalSizeWithSpacing +
          (canvas.height - (gridSize * totalSizeWithSpacing - gridSpacing)) /
            2 +
          offsetYY -
          (offsetYY - offsetY) * depth.scale;

        // Add animation
        x += animateX * 5 * depth.scale;
        x = x + animateX * 5;

        y += animateY * 5 * depth.scale;
        y = y + animateY * 5;

        //console.log(animateX);

        if (animateX > 20) {
          animateX = 0;
        }
        if (animateY > 20) {
          animateY = 0;
        }
        if (animateX < -20) {
          animateX = 0;
        }
        if (animateY < -20) {
          animateY = 0;
        }

        // if (x < 0+depth.scale*squareSize/2) {  // If the square is off the left side of the canvas, move it to the right side
        //     x += canvas.width;
        // }
        // if (x > canvas.width-depth.scale*squareSize/2) {  // If the square is off the right side of the canvas, move it to the left side
        //     x -= canvas.width;
        // }
        // if (y < 0+depth.scale*squareSize/2) {  // If the square is off the top of the canvas, move it to the bottom
        //     y += canvas.height;
        // }
        // if (y > canvas.height-depth.scale*squareSize/2) {  // If the square is off the bottom of the canvas, move it to the top
        //     y -= canvas.height;
        // }

        ctx.fillStyle = `rgba(0, 0, 0, ${depth.alpha})`; // Set the alpha transparency based on depth
        ctx.fillRect(x, y, adjustedSize, adjustedSize);

        const currentCorners = [
          { x, y },
          { x: x + adjustedSize, y },
          { x, y: y + adjustedSize },
          { x: x + adjustedSize, y: y + adjustedSize },
        ];

        // Draw lines connecting corners between layers, if a previous layer exists
        if (previousCorner) {
          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(previousCorner[i].x, previousCorner[i].y);
            ctx.lineTo(currentCorners[i].x, currentCorners[i].y);
            ctx.stroke();
          }
        }

        // Set the current layer's corners as the previous corners for the next layer
        previousCorner = currentCorners;
      });
    }
  }

  requestAnimationFrame(drawGrid);
}

canvas.addEventListener("mousemove", (event) => {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  offsetX = event.clientX - canvas.getBoundingClientRect().left - centerX;
  offsetY = event.clientY - canvas.getBoundingClientRect().top - centerY;
});

requestAnimationFrame(drawGrid);
