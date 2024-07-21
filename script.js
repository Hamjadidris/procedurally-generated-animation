// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;
Constraint = Matter.Constraint;
MouseConstraint = Matter.MouseConstraint;
Mouse = Matter.Mouse;

// create an engine
var engine = Engine.create({
  gravity: {
    x: 0,
    y: 0,
  },
});

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const halfScreenWidth = window.innerWidth / 2;
const halfScreenHeight = window.innerHeight / 2;

let canvasOptions = {
  height: screenHeight,
  width: screenWidth,
  wireframes: false,
};

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: canvasOptions,
});

let headCategory = 0x0001;

const cicleOptions = {
  frictionAir: 0.5,
  render: {
    lineWidth: 2,
    fillStyle: "transparent",
  },
  restitution: 0.5,
};

// Make an array of circle radia depending on how many circles can fit the screen width
const distanceBetween = 50;
const circleAmountPerScreen = screenWidth / distanceBetween - 2; // minus 2 circles so there's a little space left
const radiaArray = Array.from(
  { length: circleAmountPerScreen <= 31 ? circleAmountPerScreen : 31 },
  () => distanceBetween
);

const circlesArray = [];

// Render circles and add to world
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
        render: {
          fillStyle: "#FF0099",
          type: "line",
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
        slop: 5,
        collisionFilter: {
          category: bitValue,
          mask:
            index === 1
              ? Math.pow(2, index + 2) | Math.pow(2, index - 2)
              : Math.pow(2, index + 2) | Math.pow(2, index - 2) | headCategory,
        },
        render: {
          fillStyle: "transparent",
          lineWidth: 2,
          type: "line",
        },
      }
    );
  }
  circlesArray.push(circle);
  Composite.add(engine.world, circle);

  if (index !== 0) {
    const circleConstraint = Constraint.create({
      bodyA: prevCircle,
      bodyB: circle,
      length: distanceBetween,
      stiffness: 1,
      render: {
        lineWidth: 0,
      },
    });
    Composite.add(engine.world, circleConstraint);
  }
});

var mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

// Composite.add(engine.world, ground);
Composite.add(engine.world, mouseConstraint);

render.mouse = mouse;
mouseConstraint.collisionFilter.mask = headCategory;
// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
