const mainContainer = document.querySelector(".main-container");
const section1 = document.querySelector(".section1");
const section2 = document.querySelector(".section2");
const section3 = document.querySelector(".section3");
const canvas1 = document.querySelector("#canvas1");
const canvas2 = document.querySelector("#canvas2");
const canvas3 = document.querySelector("#canvas3");
const scrollBtn = document.querySelector(".scroll-btn");
const scrollBtn2 = document.querySelector(".scroll-btn2");

let buttonClicked = 1;
scrollBtn.addEventListener("click", () => {
  mainContainer.scrollTo({
    top: section1.offsetHeight * buttonClicked,
    left: 0,
    behavior: "smooth",
  });
  if (buttonClicked === 3) {
    scrollBtn.classList.add("fade-out");
    scrollBtn2.classList.add("fade-in");
    return;
  }
  buttonClicked++;
});

scrollBtn2.addEventListener("click", () => {
  mainContainer.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
  scrollBtn.classList.remove("fade-out");
  scrollBtn2.classList.remove("fade-in");
  buttonClicked = 1;
});

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

let engine1;
let engine2;
let engine3;
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const halfScreenWidth = screenWidth / 2;
const halfScreenHeight = screenHeight / 2;
const canvasHeight = canvas1.offsetHeight;
const halfCanvasHeight = canvasHeight / 2;
const canvasWidth = canvas1.offsetWidth;
const halfCanvasWidth = canvasWidth / 2;
const mouseDragCategory = 0x0001;
const mouseDragCategory2 = Math.pow(2, 15);

//////////////  First canvas  ////////////////

let firstCanvas = function (p) {
  let circles = [];
  p.setup = function () {
    engine1 = Engine.create({
      gravity: {
        x: 0,
        y: 0,
      },
    });

    createCustomCanvas(p, engine1, {
      canvasElement: canvas1,
      bgColor: "#14151f",
    });

    const cicleOptions = {
      collisionFilter: {
        group: -1,
        mask: mouseDragCategory | mouseDragCategory2,
      },
      restitution: 0.5,
      frictionAir: 0.5,
    };

    const circle1 = Bodies.circle(
      halfCanvasWidth,
      halfCanvasHeight,
      50,
      cicleOptions
    );

    const circle2 = Bodies.circle(
      halfCanvasWidth + 50,
      halfCanvasHeight,
      10,
      cicleOptions
    );

    const circleConstraint1 = Constraint.create({
      bodyA: circle1,
      bodyB: circle2,
      length: 50,
      stiffness: 1,
      render: {
        lineWidth: 0,
      },
    });
    circles = [circle1, circle2];
    World.add(engine1.world, circles);
    World.add(engine1.world, circleConstraint1);
  };
  p.draw = function () {
    p.background("#14151f");
    Engine.update(engine1);

    p.stroke(255);
    p.strokeWeight(2);
    p.fill("#14151f");
    circles.forEach((circle, i) => {
      let pos = circle.position;
      let r = circle.circleRadius;
      let angle = circle.angle;
      p.push();
      p.translate(pos.x, pos.y);
      p.rotate(angle);
      p.ellipse(0, 0, r * 2);
      p.stroke("#fff");
      p.strokeWeight(4);
      p.point(0, 0);
      p.pop();
    });
  };
};

////////////  Second canvas  ////////////

// Make an array of circle radia depending on how many circles can fit the screen width
const distanceBetween = Math.round(canvasWidth * 0.06); //
const circleAmountPerScreen = canvasWidth / distanceBetween - 2; // minus 2 circles so there's a little space left
const radiaArray = Array.from(
  { length: circleAmountPerScreen <= 14 ? circleAmountPerScreen : 14 },
  () => distanceBetween
);

let secondCanvas = function (p) {
  let circles = [];
  p.setup = function () {
    engine2 = Engine.create({
      gravity: {
        x: 0,
        y: 0,
      },
    });
    createCustomCanvas(p, engine2, {
      canvasElement: canvas2,
      bgColor: "#14151f",
    });

    const cicleOptions = {
      frictionAir: 0.5,
      restitution: 0.5,
    };

    // Render circles and add to world
    radiaArray.forEach((radius, index) => {
      let circle;
      let prevCircle = circles[index - 1];
      let bitValue = Math.pow(2, index + 15);

      if (index === 0) {
        circle = Bodies.circle(
          halfCanvasWidth -
            (distanceBetween / 2) * (radiaArray.length - (index + 1)),
          halfCanvasHeight,
          radius,
          {
            ...cicleOptions,
            collisionFilter: {
              category: bitValue,
              group: -1,
            },
          }
        );
      } else {
        circle = Bodies.circle(
          prevCircle.position.x + distanceBetween,
          halfCanvasHeight,
          radius,
          {
            ...cicleOptions,
            collisionFilter: {
              category: bitValue,
              mask: mouseDragCategory | mouseDragCategory,
              group: -1,
            },
          }
        );
      }

      circles.push(circle);
      World.add(engine2.world, circle);

      if (index !== 0) {
        const circleConstraint2 = Constraint.create({
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
        World.add(engine2.world, circleConstraint2);
      }
    });
    circles.reverse();
  };
  p.draw = function () {
    p.background("#14151f");
    Engine.update(engine2);

    p.stroke(255);
    p.strokeWeight(2);
    p.fill("#14151f");
    circles.forEach((circle, i) => {
      if (i === circles.length - 1) p.fill("#fff");
      let pos = circle.position;
      let r = circle.circleRadius;
      let angle = circle.angle;
      p.push();
      p.translate(pos.x, pos.y);
      p.rotate(angle);
      p.ellipse(0, 0, r * 2);
      p.pop();
    });
  };
};

////////////  Third canvas  ////////////

let thirdCanvas = function (p) {
  let circles = [];

  p.setup = function () {
    engine3 = Engine.create({
      gravity: {
        x: 0,
        y: 0,
      },
    });
    createCustomCanvas(p, engine3, {
      canvasElement: canvas3,
      bgColor: "#14151f",
    });

    const cicleOptions = {
      frictionAir: 0.5,
      restitution: 0.5,
    };

    radiaArray.forEach((radius, index) => {
      let circle;
      let prevCircle = circles[index - 1];
      let bitValue = Math.pow(2, index);

      if (index === 0) {
        circle = Bodies.circle(
          halfCanvasWidth -
            (distanceBetween / 2) * (radiaArray.length - (index + 1)),
          halfCanvasHeight,
          radius,
          {
            ...cicleOptions,
            collisionFilter: {
              category: bitValue,
              group: -1,
            },
          }
        );
      } else {
        circle = Bodies.circle(
          prevCircle.position.x + distanceBetween,
          halfCanvasHeight,
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
                    mouseDragCategory,
            },
          }
        );
      }

      circles.push(circle);
      World.add(engine3.world, circle);

      if (index !== 0) {
        const circleConstraint3 = Constraint.create({
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
        World.add(engine3.world, circleConstraint3);
      }
    });
    circles.reverse();
  };

  p.draw = function () {
    p.background("#14151f");
    Engine.update(engine3);
    p.stroke(255);
    p.strokeWeight(4);
    p.fill("#fff");
    circles.forEach((circle, i) => {
      let pos = circle.position;
      let r = circle.circleRadius;

      let angle = Math.atan(pos.y / pos.x) * 4;
      p.push();
      p.translate(pos.x, pos.y);
      p.rotate(angle);
      p.ellipse(0, 0, r * 2);
      if (i === circles.length - 1) {
        p.stroke("#14151f");
        p.strokeWeight(6);
        p.point(-r / 2, -r + r / 2);
        p.strokeWeight(6);
        p.point(-r / 2, r - r / 2);
      }
      p.pop();
    });
  };
};

function setup() {
  new p5(firstCanvas);
  new p5(secondCanvas);
  new p5(thirdCanvas);
}

function createCustomCanvas(p5, engine, { canvasElement, bgColor }) {
  const canvas = p5.createCanvas(canvasWidth, canvasHeight, canvasElement);
  p5.background(bgColor);

  const mouse = Mouse.create(canvas.elt);
  const mouseConstraint = MouseConstraint.create(engine, {
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
  mouseConstraint.collisionFilter.mask = mouseDragCategory | mouseDragCategory2;
}
