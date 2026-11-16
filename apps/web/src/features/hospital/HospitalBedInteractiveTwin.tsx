import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BedCategoryType, BED_CATEGORIES } from './HospitalBed3DMatrix';
import {
  Activity,
  Heart,
  Droplet,
  Wind,
  Compass,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface HospitalBedInteractiveTwinProps {
  selectedCategory: BedCategoryType;
  onSelectCategory?: (cat: BedCategoryType) => void;
}

export const HospitalBedInteractiveTwin: React.FC<HospitalBedInteractiveTwinProps> = ({
  selectedCategory,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const ecgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const threeAnimFrameRef = useRef<number | null>(null);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const catMeta = BED_CATEGORIES[selectedCategory] || BED_CATEGORIES['GENERAL_AC'];

  // Helper to generate dynamic canvas textures for medical screen decals
  const createBedsideMonitorTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Deep medical black background
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, 512, 384);

    // Grid lines
    ctx.strokeStyle = '#0e2238';
    ctx.lineWidth = 1;
    for (let x = 0; x < 512; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 384);
      ctx.stroke();
    }
    for (let y = 0; y < 384; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // Header bar
    ctx.fillStyle = '#0a192f';
    ctx.fillRect(0, 0, 512, 40);
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#10b981';
    ctx.fillText('● BED 01 • ADULT ICU LEAD II', 16, 26);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('NIBP AUTO 15m', 360, 26);

    // Dynamic ECG Green Wave
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 100);
    for (let x = 0; x < 512; x += 4) {
      const cyc = x % 130;
      let y = 100;
      if (cyc > 30 && cyc < 40) y = 92;
      else if (cyc >= 45 && cyc < 50) y = 108;
      else if (cyc >= 50 && cyc < 58) y = 42;
      else if (cyc >= 58 && cyc < 64) y = 118;
      else if (cyc >= 78 && cyc < 96) y = 88;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // SpO2 Cyan Wave
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 180);
    for (let x = 0; x < 512; x += 4) {
      const cyc = (x + 20) % 90;
      const y = 180 - Math.sin((cyc / 90) * Math.PI) * 22;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Vitals numeric tiles
    // HR
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('72', 390, 108);
    ctx.font = '14px monospace';
    ctx.fillText('HR BPM', 450, 102);

    // SpO2
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('99%', 380, 188);
    ctx.font = '14px monospace';
    ctx.fillText('SpO2', 460, 182);

    // NIBP
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('120/80', 20, 290);
    ctx.font = '14px monospace';
    ctx.fillText('NIBP (93)', 190, 280);

    // RESP
    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('16', 320, 290);
    ctx.font = '14px monospace';
    ctx.fillText('RESP /min', 380, 280);

    // Bottom banner
    ctx.fillStyle = '#0f2942';
    ctx.fillRect(0, 335, 512, 49);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '14px monospace';
    ctx.fillText('SYSTEM OK • CONTINUOUS TELEMETRY SYNC', 16, 365);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  const createFootboardScreenTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 256, 128);

    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, 248, 120);

    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('NURSE TELEMETRY HUD', 14, 24);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('SCALE: 68.4 kg', 14, 52);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('ANGLE: 32° CLINICAL', 14, 78);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText('BRAKE: LOCKED • LOCKOUT: ON', 14, 106);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  // THREE.JS SCENE SETUP
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 420;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060d1b);
    scene.fog = new THREE.FogExp2(0x060d1b, 0.015);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 150);
    camera.position.set(16, 13, 20);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ORBIT CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 45;
    controls.maxPolarAngle = Math.PI / 2 - 0.03; // Never clip under floor
    controls.minPolarAngle = 0.1;
    controls.target.set(0, 3.8, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controlsRef.current = controls;

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Main Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(16, 24, 16);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 60;
    keyLight.shadow.camera.left = -16;
    keyLight.shadow.camera.right = 16;
    keyLight.shadow.camera.top = 16;
    keyLight.shadow.camera.bottom = -16;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    // Cool Cyan Clinical Rim Light
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    rimLight.position.set(-18, 14, -14);
    scene.add(rimLight);

    // Soft Warm Fill Light
    const fillLight = new THREE.DirectionalLight(0xf8fafc, 0.8);
    fillLight.position.set(-8, 12, 18);
    scene.add(fillLight);

    // Under-bed ground wash point light
    const underBedLight = new THREE.PointLight(0x38bdf8, 1.2, 14);
    underBedLight.position.set(0, 0.6, 0);
    scene.add(underBedLight);

    // MATERIALS
    const darkChassisMat = new THREE.MeshStandardMaterial({
      color: 0x1e2638,
      roughness: 0.35,
      metalness: 0.8,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.15,
      metalness: 0.95,
    });

    const medicalAbsMat = new THREE.MeshStandardMaterial({
      color: 0x1b283d,
      roughness: 0.4,
      metalness: 0.25,
    });

    const cyanTrimMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.3,
      metalness: 0.4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.25,
    });

    const mattressMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Hospital medical blue
      roughness: 0.55,
      metalness: 0.1,
    });

    const pillowMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.75,
      metalness: 0.05,
    });

    const wheelTireMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.85,
      metalness: 0.1,
    });

    const wheelBrakeMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      roughness: 0.4,
      metalness: 0.2,
    });

    const ivBagMat = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      transparent: true,
      opacity: 0.8,
      ior: 1.33,
    });

    // 1. FLOOR STAGE & CALIBRATION RINGS
    const floorGroup = new THREE.Group();

    // Stage Disk
    const floorGeo = new THREE.CylinderGeometry(18, 18, 0.2, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0a1120,
      roughness: 0.8,
      metalness: 0.2,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.1;
    floorMesh.receiveShadow = true;
    floorGroup.add(floorMesh);

    // Distance Calibration Rings
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x1e3a5f, side: THREE.DoubleSide });
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x0ea5e9, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });

    const ring1 = new THREE.Mesh(new THREE.RingGeometry(11, 11.08, 64), ringMat1);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = 0.01;
    floorGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.RingGeometry(16, 16.1, 64), ringMat2);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.01;
    floorGroup.add(ring2);

    // Ward Crosshairs Grid Lines
    const gridHelper = new THREE.GridHelper(30, 20, 0x1e293b, 0x0f172a);
    gridHelper.position.y = 0.02;
    floorGroup.add(gridHelper);

    scene.add(floorGroup);

    // 2. MAIN HOSPITAL BED ASSEMBLY
    const bedGroup = new THREE.Group();

    // A. 4 CASTER WHEELS WITH RED FOOT BRAKES
    const wheelPositions = [
      { x: -7.6, z: -3.2 },
      { x: 7.6, z: -3.2 },
      { x: -7.6, z: 3.2 },
      { x: 7.6, z: 3.2 },
    ];

    wheelPositions.forEach((pos) => {
      const casterGroup = new THREE.Group();
      casterGroup.position.set(pos.x, 0, pos.z);

      // Swivel post
      const postGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.9, 16);
      const post = new THREE.Mesh(postGeo, chromeMat);
      post.position.y = 0.85;
      post.castShadow = true;
      casterGroup.add(post);

      // Wheel Fork Housing
      const forkGeo = new THREE.BoxGeometry(0.7, 0.45, 0.6);
      const fork = new THREE.Mesh(forkGeo, darkChassisMat);
      fork.position.y = 0.65;
      fork.castShadow = true;
      casterGroup.add(fork);

      // Twin Polyurethane Wheel
      const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.26, 24);
      wheelGeo.rotateZ(Math.PI / 2);

      const leftWheel = new THREE.Mesh(wheelGeo, wheelTireMat);
      leftWheel.position.set(-0.2, 0.55, 0);
      leftWheel.castShadow = true;
      casterGroup.add(leftWheel);

      const rightWheel = new THREE.Mesh(wheelGeo, wheelTireMat);
      rightWheel.position.set(0.2, 0.55, 0);
      rightWheel.castShadow = true;
      casterGroup.add(rightWheel);

      // Chrome central hubcap
      const hubGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.72, 16);
      hubGeo.rotateZ(Math.PI / 2);
      const hub = new THREE.Mesh(hubGeo, chromeMat);
      hub.position.y = 0.55;
      casterGroup.add(hub);

      // Safety Red Brake Pedal
      const brakeGeo = new THREE.BoxGeometry(0.22, 0.1, 0.45);
      const brake = new THREE.Mesh(brakeGeo, wheelBrakeMat);
      brake.position.set(0, 0.6, pos.z > 0 ? 0.45 : -0.45);
      brake.rotation.x = pos.z > 0 ? 0.35 : -0.35;
      casterGroup.add(brake);

      bedGroup.add(casterGroup);
    });

    // B. LOWER CHASSIS & HYDRAULIC LIFTS
    // Longitudinal side beams
    const sideBeamGeo = new THREE.BoxGeometry(16.2, 0.4, 0.4);
    const leftSideBeam = new THREE.Mesh(sideBeamGeo, darkChassisMat);
    leftSideBeam.position.set(0, 1.25, -3.2);
    leftSideBeam.castShadow = true;
    bedGroup.add(leftSideBeam);

    const rightSideBeam = new THREE.Mesh(sideBeamGeo, darkChassisMat);
    rightSideBeam.position.set(0, 1.25, 3.2);
    rightSideBeam.castShadow = true;
    bedGroup.add(rightSideBeam);

    // Cross members
    const crossBeamGeo = new THREE.BoxGeometry(0.4, 0.4, 6.4);
    [-7.6, -2.5, 2.5, 7.6].forEach((xPos) => {
      const crossBeam = new THREE.Mesh(crossBeamGeo, darkChassisMat);
      crossBeam.position.set(xPos, 1.25, 0);
      crossBeam.castShadow = true;
      bedGroup.add(crossBeam);
    });

    // Central Battery & Power Actuator Enclosure
    const batteryBoxGeo = new THREE.BoxGeometry(4.8, 0.75, 4.2);
    const batteryBox = new THREE.Mesh(batteryBoxGeo, medicalAbsMat);
    batteryBox.position.set(0, 1.25, 0);
    batteryBox.castShadow = true;
    bedGroup.add(batteryBox);

    // Dual Twin Hydraulic Telescoping Lift Cylinders
    [-3.8, 3.8].forEach((xPos) => {
      // Outer sleeve
      const outerColGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.6, 20);
      const outerCol = new THREE.Mesh(outerColGeo, darkChassisMat);
      outerCol.position.set(xPos, 2.1, 0);
      outerCol.castShadow = true;
      bedGroup.add(outerCol);

      // Inner chrome piston
      const innerPistonGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.8, 20);
      const innerPiston = new THREE.Mesh(innerPistonGeo, chromeMat);
      innerPiston.position.set(xPos, 2.8, 0);
      innerPiston.castShadow = true;
      bedGroup.add(innerPiston);

      // Diagonal cross-brace stabilizing link
      const braceGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.6, 12);
      braceGeo.rotateZ(xPos < 0 ? 0.6 : -0.6);
      const brace = new THREE.Mesh(braceGeo, chromeMat);
      brace.position.set(xPos < 0 ? -2.6 : 2.6, 2.3, 0);
      bedGroup.add(brace);
    });

    // C. UPPER DECK CHASSIS
    const upperDeckGeo = new THREE.BoxGeometry(19.2, 0.35, 8.4);
    const upperDeck = new THREE.Mesh(upperDeckGeo, darkChassisMat);
    upperDeck.position.set(0, 3.45, 0);
    upperDeck.castShadow = true;
    upperDeck.receiveShadow = true;
    bedGroup.add(upperDeck);

    // Perimeter bumper strip
    const bumperGeo = new THREE.BoxGeometry(19.4, 0.15, 8.6);
    const bumper = new THREE.Mesh(bumperGeo, cyanTrimMat);
    bumper.position.set(0, 3.45, 0);
    bedGroup.add(bumper);

    // D. ARTICULATED MATTRESS DECK (32° Ergonomic Fowler Clinical Incline)
    const deckAssembly = new THREE.Group();
    deckAssembly.position.set(0, 3.65, 0);

    // 1. Backrest Section (Pivots at x = -1.8, inclined gracefully upward towards headboard)
    const backrestGroup = new THREE.Group();
    backrestGroup.position.set(-1.8, 0, 0);
    backrestGroup.rotation.z = -0.52; // ~30 degrees upward inclination

    // Backrest base frame
    const brFrameGeo = new THREE.BoxGeometry(7.2, 0.25, 7.8);
    const brFrame = new THREE.Mesh(brFrameGeo, darkChassisMat);
    brFrame.position.set(-3.6, 0.12, 0);
    brFrame.castShadow = true;
    backrestGroup.add(brFrame);

    // Backrest foam contour mattress
    const brMattressGeo = new THREE.BoxGeometry(7.0, 1.1, 7.6);
    const brMattress = new THREE.Mesh(brMattressGeo, mattressMat);
    brMattress.position.set(-3.6, 0.75, 0);
    brMattress.castShadow = true;
    brMattress.receiveShadow = true;
    backrestGroup.add(brMattress);

    // Headrest Pillow (Crisp hospital white linen)
    const pillowGeo = new THREE.BoxGeometry(2.4, 0.55, 4.6);
    const pillow = new THREE.Mesh(pillowGeo, pillowMat);
    pillow.position.set(-5.6, 1.45, 0);
    pillow.castShadow = true;
    backrestGroup.add(pillow);

    deckAssembly.add(backrestGroup);

    // 2. Pelvic / Seat Section (Horizontal flat)
    const seatFrameGeo = new THREE.BoxGeometry(3.6, 0.25, 7.8);
    const seatFrame = new THREE.Mesh(seatFrameGeo, darkChassisMat);
    seatFrame.position.set(0, 0.12, 0);
    deckAssembly.add(seatFrame);

    const seatMattressGeo = new THREE.BoxGeometry(3.4, 1.1, 7.6);
    const seatMattress = new THREE.Mesh(seatMattressGeo, mattressMat);
    seatMattress.position.set(0, 0.75, 0);
    seatMattress.castShadow = true;
    seatMattress.receiveShadow = true;
    deckAssembly.add(seatMattress);

    // 3. Thigh & Knee-Gatch Section (Gentle 8° ergonomic rise)
    const thighGroup = new THREE.Group();
    thighGroup.position.set(1.8, 0, 0);
    thighGroup.rotation.z = 0.14; // slight rise

    const thighMattressGeo = new THREE.BoxGeometry(3.4, 1.1, 7.6);
    const thighMattress = new THREE.Mesh(thighMattressGeo, mattressMat);
    thighMattress.position.set(1.7, 0.75, 0);
    thighMattress.castShadow = true;
    thighGroup.add(thighMattress);
    deckAssembly.add(thighGroup);

    // 4. Lower Leg / Foot Section (Flat descent)
    const legMattressGeo = new THREE.BoxGeometry(4.2, 1.1, 7.6);
    const legMattress = new THREE.Mesh(legMattressGeo, mattressMat);
    legMattress.position.set(6.8, 0.75, 0);
    legMattress.castShadow = true;
    legMattress.receiveShadow = true;
    deckAssembly.add(legMattress);

    bedGroup.add(deckAssembly);

    // E. HEADBOARD & FOOTBOARD (Molded ABS Medical Polymers)
    // Headboard at -9.7
    const headboardGroup = new THREE.Group();
    headboardGroup.position.set(-9.7, 4.4, 0);

    const hbPanelGeo = new THREE.BoxGeometry(0.45, 3.6, 8.4);
    const hbPanel = new THREE.Mesh(hbPanelGeo, medicalAbsMat);
    hbPanel.castShadow = true;
    headboardGroup.add(hbPanel);

    // Ergonomic curved push handles
    const hbHandleGeo = new THREE.CylinderGeometry(0.14, 0.14, 8.0, 16);
    hbHandleGeo.rotateX(Math.PI / 2);
    const hbHandle = new THREE.Mesh(hbHandleGeo, chromeMat);
    hbHandle.position.set(-0.25, 1.7, 0);
    headboardGroup.add(hbHandle);

    // Cyan accent branding strip
    const hbTrimGeo = new THREE.BoxGeometry(0.48, 0.25, 8.4);
    const hbTrim = new THREE.Mesh(hbTrimGeo, cyanTrimMat);
    hbTrim.position.set(0, 0.5, 0);
    headboardGroup.add(hbTrim);

    bedGroup.add(headboardGroup);

    // Footboard at +9.7
    const footboardGroup = new THREE.Group();
    footboardGroup.position.set(9.7, 4.2, 0);

    const fbPanelGeo = new THREE.BoxGeometry(0.45, 2.8, 8.4);
    const fbPanel = new THREE.Mesh(fbPanelGeo, medicalAbsMat);
    fbPanel.castShadow = true;
    footboardGroup.add(fbPanel);

    // Integrated Nurse Telemetry Touchscreen
    const fbScreenTexture = createFootboardScreenTexture();
    const fbScreenMat = new THREE.MeshBasicMaterial({ map: fbScreenTexture });
    const fbScreenGeo = new THREE.PlaneGeometry(2.4, 1.2);
    const fbScreen = new THREE.Mesh(fbScreenGeo, fbScreenMat);
    fbScreen.position.set(0.24, 0.2, 0);
    fbScreen.rotation.y = Math.PI / 2;
    footboardGroup.add(fbScreen);

    // Footboard push handle
    const fbHandle = new THREE.Mesh(hbHandleGeo, chromeMat);
    fbHandle.position.set(0.25, 1.3, 0);
    footboardGroup.add(fbHandle);

    bedGroup.add(footboardGroup);

    // F. DUAL-SPLIT SAFETY SIDE RAILS (Upright Position)
    const railConfigs = [
      { x: -4.5, z: -4.2, len: 6.8 }, // Head Left
      { x: 4.5, z: -4.2, len: 6.8 },  // Foot Left
      { x: -4.5, z: 4.2, len: 6.8 },  // Head Right
      { x: 4.5, z: 4.2, len: 6.8 },   // Foot Right
    ];

    railConfigs.forEach((cfg) => {
      const railGroup = new THREE.Group();
      railGroup.position.set(cfg.x, 4.3, cfg.z);

      // Molded top handrail grip
      const topBarGeo = new THREE.BoxGeometry(cfg.len, 0.35, 0.35);
      const topBar = new THREE.Mesh(topBarGeo, medicalAbsMat);
      topBar.position.y = 1.3;
      topBar.castShadow = true;
      railGroup.add(topBar);

      // Vertical stainless steel safety struts
      const strutCount = 5;
      const step = (cfg.len - 1.2) / (strutCount - 1);
      const startX = -(cfg.len - 1.2) / 2;
      for (let i = 0; i < strutCount; i++) {
        const strutGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 12);
        const strut = new THREE.Mesh(strutGeo, chromeMat);
        strut.position.set(startX + i * step, 0.65, 0);
        strut.castShadow = true;
        railGroup.add(strut);
      }

      // Middle guard rail
      const midBarGeo = new THREE.BoxGeometry(cfg.len - 0.4, 0.18, 0.18);
      const midBar = new THREE.Mesh(midBarGeo, chromeMat);
      midBar.position.y = 0.65;
      railGroup.add(midBar);

      bedGroup.add(railGroup);
    });

    // G. TELESCOPIC STAINLESS STEEL IV INFUSION POLE
    const ivGroup = new THREE.Group();
    ivGroup.position.set(-9.2, 3.45, -3.9);

    // Base socket
    const socketGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.8, 16);
    const socket = new THREE.Mesh(socketGeo, darkChassisMat);
    socket.position.y = 0.4;
    ivGroup.add(socket);

    // Main chrome vertical pole
    const poleGeo = new THREE.CylinderGeometry(0.12, 0.12, 8.2, 16);
    const pole = new THREE.Mesh(poleGeo, chromeMat);
    pole.position.y = 4.8;
    pole.castShadow = true;
    ivGroup.add(pole);

    // 4-Way Ram-Horn Infusion Hooks
    const hookGeo = new THREE.TorusGeometry(0.45, 0.05, 12, 24, Math.PI);
    [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach((rot) => {
      const hook = new THREE.Mesh(hookGeo, chromeMat);
      hook.rotation.y = rot;
      hook.rotation.z = Math.PI;
      hook.position.set(0, 8.7, 0);
      ivGroup.add(hook);
    });

    // Saline Infusion Bags (Translucent)
    [-0.45, 0.45].forEach((offsetZ, idx) => {
      const bagGeo = new THREE.BoxGeometry(0.5, 1.2, 0.25);
      const bag = new THREE.Mesh(bagGeo, ivBagMat);
      bag.position.set(0, 7.8, offsetZ);
      bag.castShadow = true;
      ivGroup.add(bag);

      // Blue / Red graduation label strip
      const labelGeo = new THREE.PlaneGeometry(0.42, 0.6);
      const labelMat = new THREE.MeshBasicMaterial({
        color: idx === 0 ? 0x0284c7 : 0xe11d48,
        transparent: true,
        opacity: 0.8,
      });
      const label = new THREE.Mesh(labelGeo, labelMat);
      label.position.set(0.14, 7.8, offsetZ);
      label.rotation.y = Math.PI / 2;
      ivGroup.add(label);

      // Transparent drip chamber
      const chamberGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.35, 12);
      const chamber = new THREE.Mesh(chamberGeo, chromeMat);
      chamber.position.set(0, 7.05, offsetZ);
      ivGroup.add(chamber);
    });

    bedGroup.add(ivGroup);

    // H. ARTICULATED BEDSIDE PATIENT MONITOR HUD
    const monitorArmGroup = new THREE.Group();
    monitorArmGroup.position.set(-6.5, 3.45, 4.0);

    // Monitor Arm Base Mount
    const armMountGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 16);
    const armMount = new THREE.Mesh(armMountGeo, darkChassisMat);
    monitorArmGroup.add(armMount);

    // Swivel Arm Linkage
    const arm1Geo = new THREE.CylinderGeometry(0.12, 0.12, 3.2, 16);
    arm1Geo.rotateZ(-0.45);
    const arm1 = new THREE.Mesh(arm1Geo, chromeMat);
    arm1.position.set(0.6, 1.6, 0.6);
    arm1.castShadow = true;
    monitorArmGroup.add(arm1);

    // Monitor Head Assembly
    const monitorHead = new THREE.Group();
    monitorHead.position.set(1.4, 3.2, 1.2);
    monitorHead.rotation.y = -Math.PI / 4; // Angled toward viewer / bed

    // Monitor Casing
    const monCasingGeo = new THREE.BoxGeometry(3.0, 2.2, 0.45);
    const monCasing = new THREE.Mesh(monCasingGeo, medicalAbsMat);
    monCasing.castShadow = true;
    monitorHead.add(monCasing);

    // Top Alarm Light Bar
    const alarmBarGeo = new THREE.BoxGeometry(2.6, 0.15, 0.15);
    const alarmBar = new THREE.Mesh(alarmBarGeo, cyanTrimMat);
    alarmBar.position.set(0, 1.05, 0.15);
    monitorHead.add(alarmBar);

    // Live Multi-Parameter Screen Decal
    const monTexture = createBedsideMonitorTexture();
    const monScreenGeo = new THREE.PlaneGeometry(2.7, 1.9);
    const monScreenMat = new THREE.MeshBasicMaterial({ map: monTexture });
    const monScreen = new THREE.Mesh(monScreenGeo, monScreenMat);
    monScreen.position.set(0, 0, 0.24);
    monitorHead.add(monScreen);

    monitorArmGroup.add(monitorHead);
    bedGroup.add(monitorArmGroup);

    // I. ICU-SPECIFIC VENTILATOR & SYRINGE RACK (For ICU / Premium ICU)
    if (selectedCategory === 'ICU' || selectedCategory === 'PREMIUM_ICU') {
      const ventGroup = new THREE.Group();
      ventGroup.position.set(-10.2, 0, 4.8);

      // Mobile Ventilator Trolley Tower
      const cartBaseGeo = new THREE.BoxGeometry(2.4, 0.4, 2.4);
      const cartBase = new THREE.Mesh(cartBaseGeo, darkChassisMat);
      cartBase.position.y = 0.4;
      ventGroup.add(cartBase);

      const cartColGeo = new THREE.BoxGeometry(0.4, 3.6, 0.4);
      const cartCol = new THREE.Mesh(cartColGeo, chromeMat);
      cartCol.position.y = 2.4;
      ventGroup.add(cartCol);

      // Ventilator Head Unit
      const ventHeadGeo = new THREE.BoxGeometry(2.2, 2.4, 1.8);
      const ventHead = new THREE.Mesh(ventHeadGeo, medicalAbsMat);
      ventHead.position.y = 4.8;
      ventHead.castShadow = true;
      ventGroup.add(ventHead);

      // Ventilator Screen
      const ventScreenGeo = new THREE.PlaneGeometry(1.8, 1.4);
      const ventScreenMat = new THREE.MeshBasicMaterial({ color: 0x064e3b });
      const ventScreen = new THREE.Mesh(ventScreenGeo, ventScreenMat);
      ventScreen.position.set(0, 4.9, 0.92);
      ventGroup.add(ventScreen);

      // Dual Corrugated Breathing Tubes (Curving to head of bed)
      const tubeCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 4.4, 0.8),
        new THREE.Vector3(2.0, 4.6, -1.5),
        new THREE.Vector3(4.5, 4.8, -3.2)
      );
      const tubeGeo = new THREE.TubeGeometry(tubeCurve, 24, 0.12, 12, false);
      const tubeMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4 });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      ventGroup.add(tubeMesh);

      bedGroup.add(ventGroup);
    }

    scene.add(bedGroup);

    // ANIMATION & RENDER LOOP
    const animate = () => {
      threeAnimFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // RESIZE OBSERVER
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });

    resizeObserver.observe(container);

    // CLEANUP ON UNMOUNT
    return () => {
      if (threeAnimFrameRef.current) {
        cancelAnimationFrame(threeAnimFrameRef.current);
      }
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [selectedCategory]);

  // 60FPS CANVAS ECG TRACE (Bedside HUD Waveform)
  useEffect(() => {
    const canvas = ecgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let x = 0;
    const step = 2;
    const height = canvas.height;
    const width = canvas.width;
    const midY = height / 2;

    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(0, 0, width, height);

    const render = () => {
      ctx.fillStyle = 'rgba(10, 15, 29, 0.06)';
      ctx.fillRect(x, 0, step * 4, height);

      ctx.beginPath();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 4;

      const cycle = x % 160;
      let y = midY;

      if (cycle > 40 && cycle < 50) {
        y = midY - 6 * Math.sin(((cycle - 40) / 10) * Math.PI);
      } else if (cycle >= 55 && cycle < 60) {
        y = midY + 4;
      } else if (cycle >= 60 && cycle < 68) {
        y = midY - 30;
      } else if (cycle >= 68 && cycle < 74) {
        y = midY + 12;
      } else if (cycle >= 90 && cycle < 115) {
        y = midY - 10 * Math.sin(((cycle - 90) / 25) * Math.PI);
      }

      ctx.moveTo(x, midY);
      ctx.lineTo(x + step, y);
      ctx.stroke();

      x += step;
      if (x >= width) {
        x = 0;
        ctx.fillStyle = '#0a0f1d';
        ctx.fillRect(0, 0, width, height);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-slate-950 via-[#0a1122] to-navy p-4 sm:p-5 text-white overflow-hidden shadow-2xl border border-white/15">
      {/* Top Header Telemetry Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
            SMART BED DIGITAL TWIN • 3D WEBGL ENGINE
          </span>
          <span className="text-white/30">•</span>
          <span className="text-slate-300 font-mono text-[11px]">
            {catMeta.shortCode}-{(selectedCategory === 'ICU' || selectedCategory === 'PREMIUM_ICU') ? 'ICU-VENT-04' : 'WARD-01'}
          </span>
        </div>

        {/* Clinical Spec Tags */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 text-[10px] font-mono border border-cyan-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-cyan-400" /> 4-WHEEL CENTRAL BRAKE LOCKED
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[10px] font-mono border border-emerald-500/30 flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" /> DUAL LOAD-CELL SENSORS: 68.4 KG
          </span>
        </div>
      </div>

      {/* 3D WEBGL CANVAS STAGE */}
      <div className="relative my-3 rounded-xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#060d1b] to-[#040812] shadow-inner">
        {/* Three.js Mounting Container */}
        <div
          ref={mountRef}
          className="w-full h-[360px] sm:h-[400px] cursor-grab active:cursor-grabbing select-none"
        />

        {/* Floating Controls HUD: 360° Interaction Hint */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono text-slate-300 flex items-center gap-2 shadow-lg">
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span>Click & Drag to Orbit 360° • Scroll to Zoom</span>
          </div>
        </div>
      </div>

      {/* Real-time Bedside Telemetry Monitor & Patient Vital Signs HUD */}
      <div className="p-4 rounded-xl bg-slate-900/95 border border-emerald-500/30 shadow-inner flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: 60FPS ECG Trace */}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="font-mono text-xs font-bold text-emerald-300">BEDSIDE MONITOR HUD</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              60 FPS REALTIME
            </span>
          </div>
          <div className="relative rounded-lg overflow-hidden border border-emerald-500/30 bg-slate-950">
            <canvas ref={ecgCanvasRef} width={380} height={60} className="w-full h-[60px] block" />
            <div className="absolute top-1 right-2 text-[10px] font-mono text-emerald-400 font-bold">
              II LEAD • 1mV
            </div>
          </div>
        </div>

        {/* Right: 4 Vitals Readouts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono min-w-[280px]">
          {/* Heart Rate */}
          <div className="p-2 rounded-lg bg-black/40 border border-emerald-500/20">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span className="flex items-center gap-1 text-emerald-400">
                <Heart className="w-3 h-3 text-emerald-400" /> HR
              </span>
              <span>BPM</span>
            </div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5 font-display">72</div>
            <div className="text-[9px] text-slate-400">Sinus Rhythm</div>
          </div>

          {/* SpO2 */}
          <div className="p-2 rounded-lg bg-black/40 border border-cyan-500/20">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span className="flex items-center gap-1 text-cyan-400">
                <Droplet className="w-3 h-3 text-cyan-400" /> SpO2
              </span>
              <span>%</span>
            </div>
            <div className="text-xl font-bold text-cyan-400 mt-0.5 font-display">99%</div>
            <div className="text-[9px] text-slate-400">Room Air / 2L O2</div>
          </div>

          {/* Blood Pressure */}
          <div className="p-2 rounded-lg bg-black/40 border border-amber-500/20">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span className="text-amber-400">NIBP</span>
              <span>mmHg</span>
            </div>
            <div className="text-lg font-bold text-amber-300 mt-0.5 font-display">120/80</div>
            <div className="text-[9px] text-slate-400">MAP 93 (Normal)</div>
          </div>

          {/* Respiration */}
          <div className="p-2 rounded-lg bg-black/40 border border-purple-500/20">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span className="flex items-center gap-1 text-purple-400">
                <Wind className="w-3 h-3 text-purple-400" /> RESP
              </span>
              <span>/min</span>
            </div>
            <div className="text-lg font-bold text-purple-300 mt-0.5 font-display">16</div>
            <div className="text-[9px] text-slate-400">Eupnea Pattern</div>
          </div>
        </div>
      </div>
    </div>
  );
};
