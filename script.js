// module aliases
const {
  Engine,
  Runner,
  World,
  Bodies,
  Composite,
  Render,
  Constraint,
  Mouse,
  MouseConstraint,
  Common,
  Vertices,
} = Matter;

let engine;
let canvas;
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const halfScreenWidth = window.innerWidth / 2;
const halfScreenHeight = window.innerHeight / 2;

const canvasOptions = {
  height: screenHeight,
  width: screenWidth,
  wireframes: false,
};

const headCategory = 0x0001;

const cicleOptions = {
  frictionAir: 0.5,
  restitution: 0.5,
};

// Make an array of circle radia depending on how many circles can fit the screen width
const distanceBetween = 35;
const circleAmountPerScreen = screenWidth / distanceBetween - 2; // minus 2 circles so there's a little space left
const radiaArray = Array.from(
  { length: circleAmountPerScreen <= 31 ? circleAmountPerScreen : 31 },
  () => distanceBetween
);
// const radiaArray = Array.from(
//   { length: circleAmountPerScreen <= 31 ? circleAmountPerScreen : 31 },
//   () => Math.round(Math.random() * distanceBetween)
// );

const circlesArray = [];

// Render circles and add to world
function drawCircle() {
  radiaArray.forEach((radius, index) => {
    let circle;
    let prevCircle = circlesArray[index - 1];
    let bitValue = Math.pow(2, index);

    if (index === 0) {
      circle = Bodies.circle(
        halfScreenWidth -
          (distanceBetween / 2) * (radiaArray.length - (index + 1)),
        halfScreenHeight,
        radius,
        {
          ...cicleOptions,
          collisionFilter: {
            category: bitValue,
          },
        }
      );
    } else {
      circle = Bodies.circle(
        prevCircle.position.x + distanceBetween,
        halfScreenHeight,
        radius,
        {
          ...cicleOptions,
          slop: 1,
          collisionFilter: {
            category: bitValue,
            mask:
              index === 1
                ? Math.pow(2, index + 2) | Math.pow(2, index - 2)
                : Math.pow(2, index + 2) |
                  Math.pow(2, index - 2) |
                  headCategory,
          },
        }
      );
    }

    circlesArray.push(circle);
    World.add(engine.world, circle);

    if (index !== 0) {
      const circleConstraint = Constraint.create({
        bodyA: prevCircle,
        bodyB: circle,
        length: distanceBetween,
        stiffness: 1,
        render: {
          anchors: false,
          lineWidth: 0,
          type: "line",
        },
      });
      World.add(engine.world, circleConstraint);
    }
  });
}

function setup() {
  console.log("first");
  canvas = createCanvas(screenWidth, screenHeight);
  // background("#14151f");

  engine = Engine.create({
    gravity: {
      x: 0,
      y: 0,
    },
  });

  const mouse = Mouse.create(canvas.elt),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });
  World.add(engine.world, mouseConstraint);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  mouseConstraint.collisionFilter.mask = headCategory;

  drawCircle();
  circlesArray.reverse();
}

function draw() {
  background("#14151f");
  Engine.update(engine);

  stroke(255);
  strokeWeight(4);
  fill("#14151f");
  circlesArray.forEach((circle, i) => {
    let pos = circle.position;
    let r = circle.circleRadius;
    let angle = Math.atan(pos.y / pos.x) * 4;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    ellipse(0, 0, r * 2);

    if (i === circlesArray.length - 1) {
      stroke("#fff");
      strokeWeight(10);
      point(-r / 2, -r + 20);
      strokeWeight(10);
      point(-r / 2, r - 20);
    }

    pop();
  });
}

function getParametricCoordinates(radius, angle) {
  let x = radius * Math.round(Math.cos(angle));
  let y = radius * Math.sin(angle);
  return { x, y };
}
