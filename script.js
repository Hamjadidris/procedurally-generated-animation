// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

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

const box = (e) =>
  Bodies.rectangle(
    e.clientX,
    e.clientY,
    Math.random() * 50,
    Math.random() * 50
  );

window.addEventListener("mousedown", (e) => {
  Composite.add(engine.world, box(e));
});

window.addEventListener("touchstart", (e) => {
  Composite.add(engine.world, box(e));
});

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
