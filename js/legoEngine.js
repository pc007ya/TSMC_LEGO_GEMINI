import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PARTS, COLORS, STUD, PLATE } from './legoCatalog.js';

const GAP = 0.032; // Inter-brick seam tolerance for realistic LEGO look
const STUD_R = 0.30;
const STUD_H = 0.20;

export class LegoEngine {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#EEF1F5');

    const w = container.clientWidth || 800;
    const h = container.clientHeight || 600;

    this.camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 250);
    this.camera.position.set(22, 18, 24);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.03;
    this.controls.minDistance = 8;
    this.controls.maxDistance = 68;
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 1.1;

    this._setupLighting();
    this._setupStudioFloor();

    this.modelGroup = new THREE.Group();
    this.scene.add(this.modelGroup);

    // Caches
    this.materialCache = new Map();
    this.printTextureCache = new Map();
    this.studGeom = new THREE.CylinderGeometry(STUD_R, STUD_R, STUD_H, 16);

    // Active set state
    this.currentSet = null;
    this.brickEntries = []; // { mesh, data, basePos, targetPos, animStart, animDuration, isAnimating }
    this.explodeFactor = 0;
    this.clock = new THREE.Clock();

    this._resizeObserver = new ResizeObserver(() => this._onResize());
    this._resizeObserver.observe(container);

    this._animate();
  }

  _setupLighting() {
    const hemi = new THREE.HemisphereLight('#FFFFFF', '#CFD6E0', 0.85);
    hemi.position.set(0, 40, 0);
    this.scene.add(hemi);

    const key = new THREE.DirectionalLight('#FFFDF8', 1.35);
    key.position.set(22, 34, 20);
    key.castShadow = true;
    key.shadow.mapSize.width = 2048;
    key.shadow.mapSize.height = 2048;
    key.shadow.camera.near = 5;
    key.shadow.camera.far = 90;
    const d = 24;
    key.shadow.camera.left = -d;
    key.shadow.camera.right = d;
    key.shadow.camera.top = d;
    key.shadow.camera.bottom = -d;
    key.shadow.bias = -0.0005;
    this.scene.add(key);

    const fill = new THREE.DirectionalLight('#DDE9FF', 0.45);
    fill.position.set(-24, 16, -14);
    this.scene.add(fill);

    const rim = new THREE.DirectionalLight('#FFFFFF', 0.35);
    rim.position.set(0, 12, -28);
    this.scene.add(rim);
  }

  _setupStudioFloor() {
    const floorGeo = new THREE.PlaneGeometry(160, 160);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.16 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Subtle architectural display plinth ring
    const ringGeo = new THREE.RingGeometry(15.5, 15.65, 96);
    const ringMat = new THREE.MeshBasicMaterial({ color: '#CBD3DF', side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.005;
    this.scene.add(ring);
  }

  _getMaterial(colorKey, printKey = null) {
    const cacheKey = `${colorKey}__${printKey || ''}`;
    if (this.materialCache.has(cacheKey)) return this.materialCache.get(cacheKey);

    const c = COLORS[colorKey] || COLORS.WHITE;
    const params = {
      color: new THREE.Color(c.hex),
      roughness: c.roughness ?? 0.28,
      metalness: c.metalness ?? 0.03
    };
    if (c.transparent) {
      params.transparent = true;
      params.opacity = c.opacity ?? 0.72;
      params.depthWrite = false;
    }

    const baseMat = new THREE.MeshStandardMaterial(params);

    if (!printKey) {
      this.materialCache.set(cacheKey, baseMat);
      return baseMat;
    }

    const tex = this._getPrintTexture(printKey, c.hex);
    const printMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.22,
      metalness: 0.02
    });
    const result = { baseMat, printMat };
    this.materialCache.set(cacheKey, result);
    return result;
  }

  _getPrintTexture(printKey, bgHex) {
    if (this.printTextureCache.has(printKey)) return this.printTextureCache.get(printKey);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bgHex || '#F4F5F7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (printKey === 'TSMC_RED') {
      ctx.fillStyle = '#C91A09';
      ctx.font = 'bold 126px "Inter", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('tsmc', 256, 134);
    } else if (printKey === 'TSMC_WAFER' || printKey === 'TSMC_ROUND') {
      canvas.width = 256;
      canvas.height = 256;
      ctx.fillStyle = '#F4F5F7';
      ctx.fillRect(0, 0, 256, 256);
      // Red wafer ellipse
      ctx.strokeStyle = '#C91A09';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.ellipse(128, 128, 96, 68, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Subtle wafer grid lines
      ctx.strokeStyle = 'rgba(201, 26, 9, 0.28)';
      ctx.lineWidth = 3;
      for (let i = 60; i <= 196; i += 22) {
        ctx.beginPath(); ctx.moveTo(i, 76); ctx.lineTo(i, 180); ctx.stroke();
      }
      ctx.fillStyle = '#C91A09';
      ctx.font = 'bold 64px "Inter", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('tsmc', 128, 130);
    } else if (printKey === 'JASM') {
      ctx.fillStyle = '#1E2124';
      ctx.font = 'bold 112px "Inter", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Jasm', 256, 128);
      ctx.fillStyle = '#C91A09';
      ctx.fillRect(108, 186, 296, 12);
    } else if (printKey === 'MORRIS_WALL') {
      ctx.fillStyle = '#4A5056';
      ctx.fillRect(0, 0, 512, 256);
      ctx.fillStyle = '#F4F5F7';
      ctx.font = 'bold 74px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('張忠謀大樓', 256, 102);
      ctx.font = '600 32px "Inter", sans-serif';
      ctx.fillStyle = '#CFD6DE';
      ctx.fillText('Morris Chang Building', 256, 178);
      ctx.fillStyle = '#C91A09';
      ctx.fillRect(40, 224, 432, 16);
    } else if (printKey === 'MORRIS_PLAQUE') {
      ctx.fillStyle = '#A6ACB2';
      ctx.fillRect(0, 0, 512, 256);
      ctx.fillStyle = '#1E2124';
      ctx.font = 'bold 68px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('張忠謀大樓', 256, 108);
      ctx.font = '600 28px "Inter", sans-serif';
      ctx.fillText('Morris Chang Building', 256, 176);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    this.printTextureCache.set(printKey, tex);
    return tex;
  }

  _buildBrickMesh(b) {
    const part = PARTS[b.part];
    if (!part) return null;

    const group = new THREE.Group();
    const matObj = this._getMaterial(b.color, part.print);
    const mat = part.print ? matObj.baseMat : matObj;
    const printMat = part.print ? matObj.printMat : null;

    const w = part.w * STUD;
    const d = part.d * STUD;
    const h = part.h * PLATE;

    if (part.shape === 'round' || part.shape === 'round_plate' || part.shape === 'round_tile') {
      const r = (Math.min(w, d) / 2) - GAP;
      const bodyGeo = new THREE.CylinderGeometry(r, r, h, 24);
      const mats = printMat ? [mat, printMat, mat] : mat;
      const body = new THREE.Mesh(bodyGeo, mats);
      body.position.y = h / 2;
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      if (part.studs) {
        if (part.w === 1) {
          const stud = new THREE.Mesh(this.studGeom, mat);
          stud.position.y = h + STUD_H / 2;
          stud.castShadow = true;
          group.add(stud);
        } else {
          // 2x2 or 4x4 studs on circular plate
          const halfW = (part.w - 1) / 2;
          const halfD = (part.d - 1) / 2;
          for (let ix = 0; ix < part.w; ix++) {
            for (let iz = 0; iz < part.d; iz++) {
              const sx = (ix - halfW) * STUD;
              const sz = (iz - halfD) * STUD;
              if (Math.hypot(sx, sz) <= r - 0.15) {
                const stud = new THREE.Mesh(this.studGeom, mat);
                stud.position.set(sx, h + STUD_H / 2, sz);
                stud.castShadow = true;
                group.add(stud);
              }
            }
          }
        }
      }
    } else if (part.shape === 'dish') {
      const r = (w / 2) - GAP;
      const geo = new THREE.SphereGeometry(r, 28, 14, 0, Math.PI * 2, 0, Math.PI * 0.42);
      const dish = new THREE.Mesh(geo, mat);
      dish.scale.set(1, 0.55, 1);
      dish.position.y = -0.15;
      dish.castShadow = true;
      dish.receiveShadow = true;
      group.add(dish);
      // Flat cap ring
      const baseRing = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.94, r * 0.96, 0.25, 28), mat);
      baseRing.position.y = 0.125;
      group.add(baseRing);
    } else if (part.shape === 'cone') {
      const rBot = (w / 2) - GAP;
      const rTop = STUD_R;
      const geo = new THREE.CylinderGeometry(rTop, rBot, h, 20);
      const cone = new THREE.Mesh(geo, mat);
      cone.position.y = h / 2;
      cone.castShadow = true;
      cone.receiveShadow = true;
      group.add(cone);
      const stud = new THREE.Mesh(this.studGeom, mat);
      stud.position.y = h + STUD_H / 2;
      group.add(stud);
    } else if (part.shape === 'bar') {
      const geo = new THREE.CylinderGeometry(0.14, 0.14, d - GAP * 2, 12);
      geo.rotateX(Math.PI / 2);
      const bar = new THREE.Mesh(geo, mat);
      bar.position.y = h / 2;
      bar.castShadow = true;
      group.add(bar);
    } else if (part.shape === 'plant') {
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, h * 0.85, 8), mat);
      stem.position.y = h * 0.42;
      stem.castShadow = true;
      group.add(stem);
      for (let i = 0; i < 3; i++) {
        const ang = (i * Math.PI * 2) / 3;
        const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.24), mat);
        leaf.position.set(Math.cos(ang) * 0.24, h * 0.84, Math.sin(ang) * 0.24);
        leaf.rotation.y = -ang;
        leaf.rotation.z = 0.35;
        leaf.castShadow = true;
        group.add(leaf);
      }
    } else if (part.shape === 'flower') {
      const center = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, h, 10), mat);
      center.position.y = h / 2;
      group.add(center);
      for (let i = 0; i < 5; i++) {
        const ang = (i * Math.PI * 2) / 5;
        const petal = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, h, 8), mat);
        petal.position.set(Math.cos(ang) * 0.28, h / 2, Math.sin(ang) * 0.28);
        petal.castShadow = true;
        group.add(petal);
      }
    } else if (part.shape === 'slope' || part.shape === 'curved_slope') {
      const shape = new THREE.Shape();
      const bw = w - GAP * 2;
      const bd = d - GAP * 2;
      shape.moveTo(-bd / 2, 0);
      shape.lineTo(bd / 2, 0);
      shape.lineTo(bd / 2, h);
      if (part.shape === 'curved_slope') {
        shape.quadraticCurveTo(0, h, -bd / 2, h * 0.22);
      } else {
        shape.lineTo(bd * 0.15, h);
        shape.lineTo(-bd / 2, h * 0.18);
      }
      shape.closePath();

      const extrudeGeo = new THREE.ExtrudeGeometry(shape, { depth: bw, bevelEnabled: false });
      extrudeGeo.translate(0, 0, -bw / 2);
      extrudeGeo.rotateY(Math.PI / 2);
      const mesh = new THREE.Mesh(extrudeGeo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);

      if (printMat) {
        const decal = new THREE.Mesh(new THREE.PlaneGeometry(bw * 0.92, h * 0.85), printMat);
        decal.position.set(0, h * 0.56, -bd * 0.14);
        decal.rotation.x = -Math.PI / 4;
        decal.rotation.y = Math.PI;
        group.add(decal);
      }
    } else {
      // Standard rectangular brick, plate, tile, or grille
      const bodyGeo = new THREE.BoxGeometry(w - GAP * 2, h - 0.008, d - GAP * 2);
      const mats = printMat ? [mat, mat, printMat, mat, printMat, mat] : mat;
      const body = new THREE.Mesh(bodyGeo, mats);
      body.position.y = h / 2;
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      if (part.shape === 'grille') {
        for (let i = -1; i <= 1; i++) {
          const rib = new THREE.Mesh(new THREE.BoxGeometry(w - GAP * 2 - 0.08, 0.09, 0.18), mat);
          rib.position.set(0, h + 0.04, i * 0.54);
          group.add(rib);
        }
      }

      if (part.studs) {
        const halfW = (part.w - 1) / 2;
        const halfD = (part.d - 1) / 2;
        for (let ix = 0; ix < part.w; ix++) {
          for (let iz = 0; iz < part.d; iz++) {
            const stud = new THREE.Mesh(this.studGeom, mat);
            stud.position.set((ix - halfW) * STUD, h + STUD_H / 2, (iz - halfD) * STUD);
            stud.castShadow = true;
            group.add(stud);
          }
        }
      }
    }

    // Apply position & rotation
    group.rotation.y = (b.rot || 0) * (Math.PI / 2);
    const basePos = new THREE.Vector3(b.x * STUD, b.y * PLATE, b.z * STUD);
    group.position.copy(basePos);

    return { mesh: group, basePos };
  }

  loadSet(setData, mode = 'showcase') {
    // Clear existing model
    while (this.modelGroup.children.length > 0) {
      this.modelGroup.remove(this.modelGroup.children[0]);
    }
    this.brickEntries = [];
    this.currentSet = setData;
    this.explodeFactor = 0;

    for (const b of setData.bricks) {
      const built = this._buildBrickMesh(b);
      if (!built) continue;
      this.modelGroup.add(built.mesh);
      this.brickEntries.push({
        mesh: built.mesh,
        data: b,
        basePos: built.basePos.clone(),
        animStart: 0,
        animDuration: 0.48,
        isAnimating: false,
        dropOffset: 0
      });
    }

    // Center & frame camera nicely
    this.resetCamera(setData);

    if (mode === 'assembly') {
      this.setAssemblyStep(0, false);
    }
  }

  setAssemblyStep(stepNum, animateNew = true) {
    const now = this.clock.getElapsedTime();
    let staggerIndex = 0;

    for (const entry of this.brickEntries) {
      const s = entry.data.step;
      if (s <= stepNum) {
        entry.mesh.visible = true;
        if (animateNew && s === stepNum) {
          entry.isAnimating = true;
          entry.animStart = now + staggerIndex * 0.025;
          entry.animDuration = 0.42;
          entry.dropOffset = 5.5 + (staggerIndex % 4) * 0.4;
          entry.mesh.position.set(entry.basePos.x, entry.basePos.y + entry.dropOffset, entry.basePos.z);
          staggerIndex++;
        } else {
          entry.isAnimating = false;
          entry.mesh.position.copy(entry.basePos);
        }
      } else {
        entry.mesh.visible = false;
        entry.isAnimating = false;
      }
    }
  }

  showAllBricks() {
    for (const entry of this.brickEntries) {
      entry.mesh.visible = true;
      entry.isAnimating = false;
      entry.mesh.position.copy(entry.basePos);
    }
    this.setExplodeFactor(this.explodeFactor);
  }

  setExplodeFactor(factor) {
    this.explodeFactor = factor;
    for (const entry of this.brickEntries) {
      if (entry.isAnimating) continue;
      const lift = entry.data.y * PLATE * factor * 1.15;
      entry.mesh.position.set(entry.basePos.x, entry.basePos.y + lift, entry.basePos.z);
    }
  }

  setAutoRotate(enabled) {
    this.controls.autoRotate = enabled;
  }

  resetCamera(setData = this.currentSet) {
    const camPos = setData?.cameraPos || [21, 16, 22];
    const target = setData?.cameraTarget || [0, 2.2, 0];
    this.camera.position.set(camPos[0], camPos[1], camPos[2]);
    this.controls.target.set(target[0], target[1], target[2]);
    this.controls.update();
  }

  _onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (!w || !h) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  _animate() {
    requestAnimationFrame(() => this._animate());
    const now = this.clock.getElapsedTime();

    for (const entry of this.brickEntries) {
      if (!entry.isAnimating) continue;
      const elapsed = now - entry.animStart;
      if (elapsed < 0) continue;
      const t = Math.min(elapsed / entry.animDuration, 1);
      // Ease-out bounce snap feel
      const ease = 1 - Math.pow(1 - t, 3);
      const y = entry.basePos.y + entry.dropOffset * (1 - ease);
      entry.mesh.position.set(entry.basePos.x, y, entry.basePos.z);
      if (t >= 1) {
        entry.isAnimating = false;
        entry.mesh.position.copy(entry.basePos);
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
