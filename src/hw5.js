import {OrbitControls} from './OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Set background color
scene.background = new THREE.Color(0x1a1a2e);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.34);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.48);
directionalLight.position.set(10, 30, 8);
directionalLight.target.position.set(0, 0, -28);
scene.add(directionalLight);
scene.add(directionalLight.target);

// Enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.left = -26;
directionalLight.shadow.camera.right = 26;
directionalLight.shadow.camera.top = 24;
directionalLight.shadow.camera.bottom = -18;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 180;
directionalLight.shadow.bias = -0.00005;
directionalLight.shadow.normalBias = 0.0006;
directionalLight.shadow.radius = 5;
directionalLight.shadow.camera.updateProjectionMatrix();

function createShadowSpotlight({
  color = 0xffffff,
  intensity,
  position,
  target,
  angle,
  penumbra,
  decay = 1.3,
  distance = 160,
  mapSize = 2048
}) {
  const spotlight = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
  spotlight.position.set(position.x, position.y, position.z);
  spotlight.target.position.set(target.x, target.y, target.z);
  spotlight.castShadow = true;
  spotlight.shadow.mapSize.width = mapSize;
  spotlight.shadow.mapSize.height = mapSize;
  spotlight.shadow.camera.near = 1;
  spotlight.shadow.camera.far = distance;
  spotlight.shadow.bias = -0.00008;
  spotlight.shadow.normalBias = 0.0012;
  spotlight.shadow.radius = 8;
  scene.add(spotlight);
  scene.add(spotlight.target);
  return spotlight;
}

createShadowSpotlight({
  color: 0xfff2d9,
  intensity: 0.72,
  position: {x: -4.5, y: 15, z: 18},
  target: {x: 0, y: 0.6, z: 2},
  angle: THREE.MathUtils.degToRad(28),
  penumbra: 0.65
});

createShadowSpotlight({
  color: 0xfff0dc,
  intensity: 0.62,
  position: {x: -6.5, y: 12, z: -50},
  target: {x: -0.6, y: 0.9, z: -58},
  angle: THREE.MathUtils.degToRad(22),
  penumbra: 0.7
});

createShadowSpotlight({
  color: 0xfff0dc,
  intensity: 0.62,
  position: {x: 6.5, y: 12, z: -50},
  target: {x: 0.6, y: 0.9, z: -58},
  angle: THREE.MathUtils.degToRad(22),
  penumbra: 0.7
});

const LANE_DIMENSIONS = {
  laneWidth: 3.5,
  laneLength: 60,
  laneHeight: 0.2,
  approachLength: 15,
  gutterWidth: 0.4,
  gutterDrop: 0.06,
  markingLift: 0.002,
  pinHeight: 1.25,
  pinBaseRadius: 0.199,
  pinNeckRadius: 0.075,
  pinStripeHeight: 0.075,
  pinStripeTopRadius: 0.089,
  pinStripeBottomRadius: 0.084,
  pinStripeCenterY: 0.315,
  ballRadius: 0.45,
  ballCenterZ: 7.5,
  ballHoleRadius: 0.052,
  ballHoleDepth: 0.15,
  ballHoleSurfaceInset: 0.002,
  pinDeckLength: 6,
  pinDeckZCenter: -62.5
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
  }),
  pinBody: new THREE.MeshPhongMaterial({
    color: 0xFAFAFA,
    shininess: 90
  }),
  pinStripe: new THREE.MeshPhongMaterial({
    color: 0xB22222,
    shininess: 55
  }),
  pinDeck: new THREE.MeshPhongMaterial({
    color: 0xD7B17C,
    shininess: 70
  }),
  bowlingBall: new THREE.MeshPhongMaterial({
    color: 0x1f3a5f,
    shininess: 140,
    specular: new THREE.Color(0x9bb8ff)
  }),
  ballHole: new THREE.MeshPhongMaterial({
    color: 0x141414,
    shininess: 10,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2
  })
};

const PIN_POSITIONS = [
  {x: 0.0, z: -57.000},
  {x: -0.5, z: -57.866},
  {x: 0.5, z: -57.866},
  {x: -1.0, z: -58.732},
  {x: 0.0, z: -58.732},
  {x: 1.0, z: -58.732},
  {x: -1.5, z: -59.598},
  {x: -0.5, z: -59.598},
  {x: 0.5, z: -59.598},
  {x: 1.5, z: -59.598}
];

const CAMERA_PRESETS = [
  {
    id: 'default',
    label: 'Default View',
    key: '1',
    position: {x: 0, y: 5, z: 12},
    target: {x: 0, y: 0.8, z: -2}
  },
  {
    id: 'bowlerEnd',
    label: 'Bowler End',
    key: '2',
    position: {x: 0, y: 6.5, z: 18},
    target: {x: 0, y: 1.1, z: -28}
  },
  {
    id: 'pinEnd',
    label: 'Pin End',
    key: '3',
    position: {x: 0, y: 3.2, z: -68},
    target: {x: 0, y: 1.0, z: -42}
  }
];

function getLaneTopY() {
  return LANE_DIMENSIONS.laneHeight / 2;
}

function getMarkingY() {
  return getLaneTopY() + LANE_DIMENSIONS.markingLift;
}

function getRaisedCenterY(thickness) {
  return getLaneTopY() + (thickness / 2) + LANE_DIMENSIONS.markingLift;
}

function getPinCenterY() {
  return getLaneTopY() + (LANE_DIMENSIONS.pinHeight / 2);
}

function getBallCenterY() {
  return getLaneTopY() + LANE_DIMENSIONS.ballRadius;
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

function createPinDeck() {
  const pinDeckGeometry = new THREE.BoxGeometry(
    LANE_DIMENSIONS.laneWidth,
    LANE_DIMENSIONS.laneHeight,
    LANE_DIMENSIONS.pinDeckLength
  );
  const pinDeck = new THREE.Mesh(pinDeckGeometry, MATERIALS.pinDeck);
  pinDeck.position.set(0, 0, LANE_DIMENSIONS.pinDeckZCenter);

  return setStaticShadow(pinDeck, {receiveShadow: true});
}

function createPinGeometry() {
  const halfHeight = LANE_DIMENSIONS.pinHeight / 2;
  const inchesToUnits = (inches) => inches / 12;
  const yFromBaseInches = (inchesAboveBase) => inchesToUnits(inchesAboveBase) - halfHeight;
  const radiusFromDiameterInches = (diameterInches) => inchesToUnits(diameterInches / 2);

  // USBC bowling pin measurement stations, scaled from 15 inches to 1.25 scene units.
  const profile = [
    new THREE.Vector2(radiusFromDiameterInches(2.031), yFromBaseInches(0.0)),
    new THREE.Vector2(radiusFromDiameterInches(2.828), yFromBaseInches(0.75)),
    new THREE.Vector2(radiusFromDiameterInches(3.906), yFromBaseInches(2.25)),
    new THREE.Vector2(radiusFromDiameterInches(4.510), yFromBaseInches(3.375)),
    new THREE.Vector2(radiusFromDiameterInches(4.766), yFromBaseInches(4.5)),
    new THREE.Vector2(radiusFromDiameterInches(4.563), yFromBaseInches(5.875)),
    new THREE.Vector2(radiusFromDiameterInches(3.703), yFromBaseInches(7.25)),
    new THREE.Vector2(radiusFromDiameterInches(2.472), yFromBaseInches(8.625)),
    new THREE.Vector2(radiusFromDiameterInches(1.965), yFromBaseInches(9.375)),
    new THREE.Vector2(radiusFromDiameterInches(1.797), yFromBaseInches(10.0)),
    new THREE.Vector2(radiusFromDiameterInches(1.870), yFromBaseInches(10.875)),
    new THREE.Vector2(radiusFromDiameterInches(2.094), yFromBaseInches(11.75)),
    new THREE.Vector2(radiusFromDiameterInches(2.406), yFromBaseInches(12.625)),
    new THREE.Vector2(radiusFromDiameterInches(2.547), yFromBaseInches(13.5)),
    new THREE.Vector2(0.094, yFromBaseInches(13.95)),
    new THREE.Vector2(0.088, yFromBaseInches(14.22)),
    new THREE.Vector2(0.073, yFromBaseInches(14.48)),
    new THREE.Vector2(0.05, yFromBaseInches(14.7)),
    new THREE.Vector2(0.028, yFromBaseInches(14.86)),
    new THREE.Vector2(0.012, yFromBaseInches(14.95)),
    new THREE.Vector2(0.0, yFromBaseInches(15.0))
  ];

  return new THREE.LatheGeometry(profile, 48);
}

function createBowlingPin() {
  const pinGroup = new THREE.Group();
  const pinBody = new THREE.Mesh(createPinGeometry(), MATERIALS.pinBody);
  setStaticShadow(pinBody, {castShadow: true, receiveShadow: true});
  pinGroup.add(pinBody);

  const stripe = new THREE.Mesh(
    new THREE.CylinderGeometry(
      LANE_DIMENSIONS.pinStripeTopRadius,
      LANE_DIMENSIONS.pinStripeBottomRadius,
      LANE_DIMENSIONS.pinStripeHeight,
      32,
      1,
      true
    ),
    MATERIALS.pinStripe
  );
  stripe.position.y = LANE_DIMENSIONS.pinStripeCenterY;
  setStaticShadow(stripe, {castShadow: true, receiveShadow: true});
  pinGroup.add(stripe);

  return pinGroup;
}

function createPinSet() {
  const pinSet = new THREE.Group();
  const pinTemplate = createBowlingPin();
  const pinY = getPinCenterY();

  PIN_POSITIONS.forEach(({x, z}) => {
    const pin = pinTemplate.clone();
    pin.position.set(x, pinY, z);
    pinSet.add(pin);
  });

  return pinSet;
}

function createBallHole(directionVector) {
  const hole = new THREE.Mesh(
    new THREE.CylinderGeometry(
      LANE_DIMENSIONS.ballHoleRadius,
      LANE_DIMENSIONS.ballHoleRadius,
      LANE_DIMENSIONS.ballHoleDepth,
      24,
      1,
      false
    ),
    MATERIALS.ballHole
  );

  const holeDirection = directionVector.clone().normalize();
  const holeCenter = holeDirection.clone().multiplyScalar(
    LANE_DIMENSIONS.ballRadius - (LANE_DIMENSIONS.ballHoleDepth / 2) - LANE_DIMENSIONS.ballHoleSurfaceInset
  );
  const rotation = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    holeDirection
  );

  hole.position.copy(holeCenter);
  hole.setRotationFromQuaternion(rotation);
  hole.renderOrder = 2;

  setStaticShadow(hole, {castShadow: true, receiveShadow: true});
  return hole;
}

function createBowlingBall() {
  const ballGroup = new THREE.Group();
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(LANE_DIMENSIONS.ballRadius, 48, 36),
    MATERIALS.bowlingBall
  );
  setStaticShadow(ball, {castShadow: true, receiveShadow: true});
  ballGroup.add(ball);

  ballGroup.add(createBallHole(new THREE.Vector3(-0.16, 0.985, 0.02)));
  ballGroup.add(createBallHole(new THREE.Vector3(0.16, 0.985, 0.02)));
  ballGroup.add(createBallHole(new THREE.Vector3(0.03, 0.9, 0.28)));

  ballGroup.position.set(0, getBallCenterY(), LANE_DIMENSIONS.ballCenterZ);

  return ballGroup;
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
scene.add(createPinDeck());
scene.add(createPinSet());
scene.add(createBowlingBall());

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;
let activeCameraPresetId = null;
const cameraPresetButtons = new Map();
const cameraPresetButtonsContainer = document.getElementById('camera-preset-buttons');
const cameraStatusElement = document.getElementById('camera-status');

function setActiveCameraPreset(presetId) {
  activeCameraPresetId = presetId;
  const activePreset = CAMERA_PRESETS.find((preset) => preset.id === presetId);

  cameraPresetButtons.forEach((button, buttonPresetId) => {
    const isActive = buttonPresetId === presetId;
    button.style.backgroundColor = isActive ? '#f59e0b' : 'rgba(36, 59, 85, 0.92)';
    button.style.color = isActive ? '#111827' : '#f8fafc';
    button.style.borderColor = isActive ? '#fcd34d' : '#4b6584';
  });

  if (cameraStatusElement && activePreset) {
    cameraStatusElement.textContent = `Active view: ${activePreset.label}`;
  }
}

function applyCameraPreset(presetId) {
  const preset = CAMERA_PRESETS.find((entry) => entry.id === presetId);
  if (!preset) {
    return;
  }

  camera.position.set(preset.position.x, preset.position.y, preset.position.z);
  controls.target.set(preset.target.x, preset.target.y, preset.target.z);
  controls.update();
  setActiveCameraPreset(preset.id);
}

function getCameraPresetByKey(key) {
  return CAMERA_PRESETS.find((preset) => preset.key === key) || null;
}

function createCameraPresetUI() {
  if (!cameraPresetButtonsContainer) {
    return;
  }

  CAMERA_PRESETS.forEach((preset) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'camera-preset-button';
    button.textContent = `${preset.key}. ${preset.label}`;
    button.addEventListener('click', () => applyCameraPreset(preset.id));
    cameraPresetButtons.set(preset.id, button);
    cameraPresetButtonsContainer.appendChild(button);
  });
}
createCameraPresetUI();
applyCameraPreset('default');

// Handle key events
function handleKeyDown(e) {
  const normalizedKey = e.key.toLowerCase();

  if (normalizedKey === "o") {
    isOrbitEnabled = !isOrbitEnabled;
    return;
  }

  const preset = getCameraPresetByKey(e.key);
  if (preset) {
    applyCameraPreset(preset.id);
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
