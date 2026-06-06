import {OrbitControls} from './OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Set background color
scene.background = new THREE.Color(0x1a1a2e);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 20, -20);
scene.add(directionalLight);

// Enable shadows
renderer.shadowMap.enabled = true;
directionalLight.castShadow = true;

const LANE_DIMENSIONS = {
  laneWidth: 3.5,
  laneLength: 60,
  laneHeight: 0.2,
  approachLength: 15,
  gutterWidth: 0.4,
  gutterDrop: 0.06,
  markingLift: 0.002
};

const MATERIALS = {
  laneWood: new THREE.MeshPhongMaterial({
    color: 0xDEB887,
    shininess: 80
  }),
  approachWood: new THREE.MeshPhongMaterial({
    color: 0xC89B6D,
    shininess: 55
  }),
  marking: new THREE.MeshPhongMaterial({
    color: 0xF8F8F2,
    shininess: 20
  }),
  gutter: new THREE.MeshPhongMaterial({
    color: 0x4A5568,
    shininess: 25
  })
};

function getLaneTopY() {
  return LANE_DIMENSIONS.laneHeight / 2;
}

function getMarkingY() {
  return getLaneTopY() + LANE_DIMENSIONS.markingLift;
}

function getRaisedCenterY(thickness) {
  return getLaneTopY() + (thickness / 2) + LANE_DIMENSIONS.markingLift;
}

function setStaticShadow(mesh, {castShadow = false, receiveShadow = false} = {}) {
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;
  return mesh;
}

function createLaneSurface() {
  const laneGeometry = new THREE.BoxGeometry(
    LANE_DIMENSIONS.laneWidth,
    LANE_DIMENSIONS.laneHeight,
    LANE_DIMENSIONS.laneLength
  );
  const lane = new THREE.Mesh(laneGeometry, MATERIALS.laneWood);
  lane.position.set(0, 0, -LANE_DIMENSIONS.laneLength / 2);

  return setStaticShadow(lane, {receiveShadow: true});
}

function createApproachSurface() {
  const approachGeometry = new THREE.BoxGeometry(
    LANE_DIMENSIONS.laneWidth,
    LANE_DIMENSIONS.laneHeight,
    LANE_DIMENSIONS.approachLength
  );
  const approach = new THREE.Mesh(approachGeometry, MATERIALS.approachWood);
  approach.position.set(0, 0, LANE_DIMENSIONS.approachLength / 2);

  return setStaticShadow(approach, {receiveShadow: true});
}

function createGutters() {
  const gutterGroup = new THREE.Group();
  const gutterGeometry = new THREE.BoxGeometry(
    LANE_DIMENSIONS.gutterWidth,
    LANE_DIMENSIONS.laneHeight,
    LANE_DIMENSIONS.laneLength
  );
  const gutterX = (LANE_DIMENSIONS.laneWidth / 2) + (LANE_DIMENSIONS.gutterWidth / 2);
  const gutterY = -LANE_DIMENSIONS.gutterDrop;

  [-1, 1].forEach((direction) => {
    const gutter = new THREE.Mesh(gutterGeometry, MATERIALS.gutter);
    gutter.position.set(direction * gutterX, gutterY, -LANE_DIMENSIONS.laneLength / 2);
    setStaticShadow(gutter, {castShadow: true, receiveShadow: true});
    gutterGroup.add(gutter);
  });

  return gutterGroup;
}

function createFoulLine() {
  const foulLineThickness = 0.01;
  const foulLineGeometry = new THREE.BoxGeometry(
    LANE_DIMENSIONS.laneWidth,
    foulLineThickness,
    0.18
  );
  const foulLine = new THREE.Mesh(foulLineGeometry, MATERIALS.marking);
  foulLine.position.set(0, getRaisedCenterY(foulLineThickness), 0);

  return setStaticShadow(foulLine, {receiveShadow: true});
}

function createApproachDots() {
  const dotsGroup = new THREE.Group();
  const dotThickness = 0.02;
  const dotGeometry = new THREE.CylinderGeometry(0.05, 0.05, dotThickness, 24);
  const rowZPositions = [11.2, 7.8];
  const dotXPositions = [-1.35, -0.9, -0.45, 0, 0.45, 0.9, 1.35];

  rowZPositions.forEach((rowZ) => {
    dotXPositions.forEach((dotX) => {
      const dot = new THREE.Mesh(dotGeometry, MATERIALS.marking);
      dot.position.set(dotX, getRaisedCenterY(dotThickness), rowZ);
      setStaticShadow(dot, {receiveShadow: true});
      dotsGroup.add(dot);
    });
  });

  return dotsGroup;
}

function createArrowShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.28);
  shape.lineTo(-0.13, -0.04);
  shape.lineTo(-0.05, -0.04);
  shape.lineTo(-0.05, -0.34);
  shape.lineTo(0.05, -0.34);
  shape.lineTo(0.05, -0.04);
  shape.lineTo(0.13, -0.04);
  shape.lineTo(0, 0.28);
  return shape;
}

function createLaneArrows() {
  const arrowGroup = new THREE.Group();
  const arrowGeometry = new THREE.ShapeGeometry(createArrowShape());
  const arrowXPositions = [-1.25, -0.82, -0.4, 0, 0.4, 0.82, 1.25];

  arrowXPositions.forEach((arrowX) => {
    const arrow = new THREE.Mesh(arrowGeometry, MATERIALS.marking);
    arrow.rotation.x = -Math.PI / 2;
    arrow.position.set(arrowX, getMarkingY(), -15);
    setStaticShadow(arrow, {receiveShadow: true});
    arrowGroup.add(arrow);
  });

  return arrowGroup;
}

// Create bowling lane
function createBowlingLane() {
  const laneGroup = new THREE.Group();
  laneGroup.add(createLaneSurface());
  laneGroup.add(createApproachSurface());
  laneGroup.add(createGutters());
  laneGroup.add(createFoulLine());
  laneGroup.add(createApproachDots());
  laneGroup.add(createLaneArrows());
  scene.add(laneGroup);
}

// Create all elements
createBowlingLane();

// Set camera position for bowler's perspective
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0, 5, 12);
camera.applyMatrix4(cameraTranslate);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;

// Instructions display
const instructionsElement = document.createElement('div');
instructionsElement.style.position = 'absolute';
instructionsElement.style.bottom = '20px';
instructionsElement.style.left = '20px';
instructionsElement.style.color = 'white';
instructionsElement.style.fontSize = '16px';
instructionsElement.style.fontFamily = 'Arial, sans-serif';
instructionsElement.style.textAlign = 'left';
instructionsElement.innerHTML = `
  <h3>Bowling Alley Controls:</h3>
  <p>O - Toggle orbit camera</p>
`;
document.body.appendChild(instructionsElement);

// Handle key events
function handleKeyDown(e) {
  if (e.key === "o") {
    isOrbitEnabled = !isOrbitEnabled;
  }
}

document.addEventListener('keydown', handleKeyDown);

// Animation function
function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.enabled = isOrbitEnabled;
  controls.update();

  renderer.render(scene, camera);
}

animate();
