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

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

let canvasOptions = {
  height: screenHeight,
  width: screenWidth,
};

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: canvasOptions,
});

var ground = Bodies.rectangle(
  0 + screenWidth / 2,
  screenHeight - 30,
  screenWidth,
  60,
  {
    isStatic: true,
  }
);

// add all of the bodies to the world
Composite.add(engine.world, ground);

const box = () =>
  Bodies.rectangle(
    e.clientX,
    e.clientY,
    Math.random() * 50,
    Math.random() * 50
  );

let cicleOptions = {
  collisionFilter: {
    group: -1,
  },
  restitution: 0.5,
};

const circle1 = Bodies.circle(
  screenWidth / 2,
  screenHeight / 2,
  50,
  cicleOptions
);

const circle2 = Bodies.circle(
  screenWidth / 2,
  screenHeight / 2,
  10,
  cicleOptions
);

const testConstraint = Constraint.create({
  bodyA: circle1,
  bodyB: circle2,
  length: 50,
  stiffness: 1,
});

Composite.add(engine.world, circle1);
Composite.add(engine.world, circle2);
Composite.add(engine.world, testConstraint);

// window.addEventListener("mousedown", (e) => {
//   Composite.add(engine.world, box(e));
// });

// window.addEventListener("touchstart", (e) => {
//   Composite.add(engine.world, box(e));
// });

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

Composite.add(engine.world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
// Render.lookAt(render, {
//   min: { x: 0, y: 0 },
//   max: { x: 800, y: 600 },
// });

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

// var gyroPresent = false;
// window.addEventListener("devicemotion", function(event){
//     if(event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma)
//         gyroPresent = true;
// });

// let gyroscope = new Gyroscope({ frequency: 60 });

// gyroscope.addEventListener("reading", (e) => {
//   console.log(`Angular velocity along the X-axis ${gyroscope.x}`);
//   console.log(`Angular velocity along the Y-axis ${gyroscope.y}`);
//   console.log(`Angular velocity along the Z-axis ${gyroscope.z}`);
// });
// gyroscope.start();
