const WIDTH = 1280
const HEIGHT = 720

// DOM objects
let ScaleXInput
let ScaleYInput
let EquationInput;
let ErrorOutput

// Scale
let ScaleX = 1
let ScaleY = 1

// Function
let Equation = ""
let F

// Reference frame
let Rf = {}

function setup() {
  createCanvas(WIDTH, HEIGHT)

  // Get DOM objects
  ScaleXInput = document.getElementById("ScaleX")
  ScaleYInput = document.getElementById("ScaleY")
  EquationInput = document.getElementById("equation")
  ErrorOutput = document.getElementById("error")

  // Set reference frame propeties
  Rf.Width = WIDTH/2
  Rf.Height = HEIGHT/2
}

function draw() {
  background(255, 255, 255)

  // Update scale
  ScaleX = ScaleXInput.value
  ScaleY = ScaleYInput.value

  Rf.ScaleX = Rf.Width / ScaleX
  Rf.ScaleY = Rf.Height / ScaleY

  // Recompile f(x) if needed
  if (EquationInput.value !== Equation) {
    Equation = EquationInput.value

    // Compile function
    try {
      ErrorOutput.innerText = ""
      F = new Function('x', `let y; try { y = ${Equation}; } catch (e) {} return -y;`)
    }
    catch (error) {
      console.log(error)
      ErrorOutput.innerText = "Syntax error"
    }
  }

  // Set (0, 0) at the center
  translate(Rf.Width, Rf.Height);

  // Draw cartesian rf
  line(-Rf.Width, 0, Rf.Width, 0) // Horizontal line
  line(0, -Rf.Height, 0, Rf.Height) // Vertical line

  // Draw scale
  {
    let position

    // Scale on horizontal line
    for (let i = -ScaleX; i <= ScaleX; ++i) {
      position = i * WIDTH / (2 * ScaleX)
      line(position, 10, position, -10)
    }

    // Scale on vertical line
    for (let i = -ScaleY; i <= ScaleY; ++i) {
      position = i * HEIGHT / (2 * ScaleY)
      line(10, position, -10, position)
    }
  }

  // Render function graph
  {
    let prev = {
      // Last function point
      x: -Rf.Width,
      y: F(-Rf.Width)
    }

    let p = {}

    // Calculate the points
    for (let x = -Rf.Width; x <= Rf.Width; ++x) {
      // Rf scale
      p.x = x / Rf.ScaleX
      p.y = F(p.x)

      // Px scale
      p.x *= Rf.ScaleX
      p.y *= Rf.ScaleY

      // Draw F(x)
      line(prev.x, prev.y, p.x, p.y)

      prev = {
        x: p.x,
        y: p.y
      }
    }
  }
}