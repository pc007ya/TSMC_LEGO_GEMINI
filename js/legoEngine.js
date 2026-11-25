import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PARTS, COLORS, STUD, PLATE } from './legoCatalog.js';

const GAP = 0.028;
const STUD_R = 0.30;
const STUD_H = 0.20;

export class LegoEngine {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#EEF1F5');

    const w = container.clientWidth || 800;
    const h = container.clientHeight || 600;

    this.camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 250);
    this.camera.position.set(22, 18, 24);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.06;
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.03;
    this.controls.minDistance = 6;
    this.controls.maxDistance = 215;
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 0.75;

    this._setupLighting();
    this._setupStudioFloor();

    this.modelGroup = new THREE.Group();
    this.scene.add(this.modelGroup);

    this.highlightGroup = new THREE.Group();
    this.scene.add(this.highlightGroup);

    // Caches (shared geometries + InstancedMesh fast-path keep 6,500+ brick UCS sets at 60fps)
    this.materialCache = new Map();
    this.printTextureCache = new Map();
    this.boxGeoCache = new Map();
    this.edgeGeoCache = new Map();
    this.unitBoxGeo = new THREE.BoxGeometry(1, 1, 1);
    this.studGeom = new THREE.CylinderGeometry(STUD_R, STUD_R, STUD_H, 10);
    this.edgeMat = new THREE.LineBasicMaterial({ color: '#1E242B', transparent: true, opacity: 0.11 });

    this.currentSet = null;
    this.brickEntries = [];
    this.instancedMeshes = [];
    this._dummy = new THREE.Object3D();
    this.explodeFactor = 0;
    this.cameraTween = null;
    this.clock = new THREE.Clock();

    this._resizeObserver = new ResizeObserver(() => this._onResize());
    this._resizeObserver.observe(container);

    this._animate();
  }

  _setupLighting() {
    const hemi = new THREE.HemisphereLight('#FFFFFF', '#CFD6E0', 0.90);
    hemi.position.set(0, 85, 0);
    this.scene.add(hemi);

    const key = new THREE.DirectionalLight('#FFFDF8', 1.38);
    key.position.set(48, 76, 50);
    key.castShadow = true;
    key.shadow.mapSize.width = 2048;
    key.shadow.mapSize.height = 2048;
    key.shadow.camera.near = 5;
    key.shadow.camera.far = 215;
    const d = 62;
    key.shadow.camera.left = -d;
    key.shadow.camera.right = d;
    key.shadow.camera.top = d;
    key.shadow.camera.bottom = -d;
    key.shadow.bias = -0.0004;
    this.scene.add(key);

    const fill = new THREE.DirectionalLight('#DCEBFF', 0.48);
    fill.position.set(-44, 30, -28);
    this.scene.add(fill);

    const rim = new THREE.DirectionalLight('#FFFFFF', 0.35);
    rim.position.set(0, 22, -52);
    this.scene.add(rim);
  }

  _setupStudioFloor() {
    const floorGeo = new THREE.PlaneGeometry(320, 320);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.16 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const ringGeo = new THREE.RingGeometry(38.0, 38.25, 96);
    const ringMat = new THREE.MeshBasicMaterial({ color: '#CBD3DF', side: THREE.DoubleSide, transparent: true, opacity: 0.42 });
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
      roughness: c.roughness ?? 0.26,
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
      roughness: 0.20,
      metalness: 0.02
    });
    const result = { baseMat, printMat };
    this.materialCache.set(cacheKey, result);
    return result;
  }

  /**
   * High-DPI Canvas textures matching the authentic TSMC semiconductor wafer logo
   * and commemorative LEGO printed tiles from the reference photos.
   */
  _getPrintTexture(printKey, bgHex) {
    if (this.printTextureCache.has(printKey)) return this.printTextureCache.get(printKey);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    if (printKey === 'TSMC_WAFER') {
      // Authentic TSMC official red semiconductor wafer emblem on white tile
      canvas.width = 512;
      canvas.height = 512;
      ctx.fillStyle = '#F6F7F9';
      ctx.fillRect(0, 0, 512, 512);

      // Subtle sticker border
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 6;
      ctx.strokeRect(12, 12, 488, 488);

      // Clip to wafer ellipse with flat bottom notch
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(256, 256, 206, 152, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#D11919';
      ctx.fill();
      ctx.clip();

      // Crisp white die/wafer circuit grid lines inside red wafer
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 4;
      for (let x = 76; x <= 436; x += 36) {
        ctx.beginPath(); ctx.moveTo(x, 90); ctx.lineTo(x, 420); ctx.stroke();
      }
      for (let y = 120; y <= 392; y += 34) {
        ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(472, y); ctx.stroke();
      }

      // Solid red horizontal band for crisp 'tsmc' lettering
      ctx.fillStyle = '#D11919';
      ctx.fillRect(68, 204, 376, 104);

      // White lowercase 'tsmc' wordmark
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 116px "Inter", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('tsmc', 256, 258);
      ctx.restore();

      // Clean outer red wafer ring stroke
      ctx.strokeStyle = '#B51212';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.ellipse(256, 256, 206, 152, 0, 0, Math.PI * 2);
      ctx.stroke();

    } else if (printKey === 'TSMC_RED') {
      ctx.fillStyle = bgHex || '#F6F7F9';
      ctx.fillRect(0, 0, 512, 256);
      ctx.fillStyle = '#D11919';
      ctx.font = '800 132px "Inter", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('tsmc', 256, 134);

    } else if (printKey === 'JASM') {
      ctx.fillStyle = '#F6F7F9';
      ctx.fillRect(0, 0, 512, 256);
      ctx.fillStyle = '#1E2124';
      ctx.font = '800 118px "Inter", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Jasm', 256, 122);
      ctx.fillStyle = '#D11919';
      ctx.fillRect(108, 188, 296, 12);

    } else if (printKey === 'MORRIS_WALL') {
      // Exact match to img4.jpg front monument plaque
      ctx.fillStyle = '#9EA5AC';
      ctx.fillRect(0, 0, 512, 256);
      ctx.fillStyle = '#2A2F35';
      ctx.font = '800 76px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('張忠謀大樓', 256, 98);
      ctx.font = '700 32px "Inter", sans-serif';
      ctx.fillStyle = '#3C434B';
      ctx.fillText('Morris Chang Building', 256, 174);
      ctx.fillStyle = '#C91A09';
      ctx.fillRect(0, 218, 512, 38);

    } else if (printKey === 'MORRIS_PLAQUE') {
      ctx.fillStyle = '#A8AEB4';
      ctx.fillRect(0, 0, 512, 256);
      ctx.fillStyle = '#1E2124';
      ctx.font = '800 68px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('張忠謀大樓', 256, 104);
      ctx.font = '700 28px "Inter", sans-serif';
      ctx.fillText('Morris Chang Building', 256, 174);
    } else if (printKey === 'NTT_PLAQUE') {
      ctx.fillStyle = '#1E2124';
      ctx.fillRect(0, 0, 512, 256);
      ctx.fillStyle = '#F6F7F9';
      ctx.font = '800 62px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('臺中國家歌劇院', 256, 102);
      ctx.font = '600 26px "Inter", sans-serif';
      ctx.fillStyle = '#CBD5E1';
      ctx.fillText('National Taichung Theater', 256, 174);
      ctx.fillStyle = '#C91A09';
      ctx.fillRect(56, 218, 400, 12);
    } else if (printKey === 'TICEC_PLAQUE') {
      ctx.fillStyle = '#1E2124';
      ctx.fillRect(0, 0, 512, 256);
      ctx.fillStyle = '#F6F7F9';
      ctx.font = '800 54px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('臺中國際會展中心', 256, 98);
      ctx.font = '600 22px "Inter", sans-serif';
      ctx.fillStyle = '#93C5FD';
      ctx.fillText('TICEC • PHASES 1 & 2', 256, 170);
      ctx.fillStyle = '#3AC5ED';
      ctx.fillRect(56, 216, 400, 12);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    this.printTextureCache.set(printKey, tex);
    return tex;
  }

  _getBoxGeo(bw, bh, bd) {
    const key = `${bw.toFixed(3)}_${bh.toFixed(3)}_${bd.toFixed(3)}`;
    if (!this.boxGeoCache.has(key)) {
      this.boxGeoCache.set(key, new THREE.BoxGeometry(bw, bh, bd));
    }
    return this.boxGeoCache.get(key);
  }

  _addSubtleEdges(mesh, geo, isTransparent, cacheKey = null) {
    if (isTransparent) return;
    let edges;
    if (cacheKey) {
      if (!this.edgeGeoCache.has(cacheKey)) {
        this.edgeGeoCache.set(cacheKey, new THREE.EdgesGeometry(geo, 32));
      }
      edges = this.edgeGeoCache.get(cacheKey);
    } else {
      edges = new THREE.EdgesGeometry(geo, 32);
    }
    const line = new THREE.LineSegments(edges, this.edgeMat);
    mesh.add(line);
  }

  _buildBrickMesh(b) {
    const part = PARTS[b.part];
    if (!part) return null;

    const group = new THREE.Group();
    const cDef = COLORS[b.color] || COLORS.WHITE;
    const matObj = this._getMaterial(b.color, part.print);
    const mat = part.print ? matObj.baseMat : matObj;
    const printMat = part.print ? matObj.printMat : null;

    const w = part.w * STUD;
    const d = part.d * STUD;
    const h = part.h * PLATE;

    if (part.shape === 'wall_tile' || part.shape === 'wall_round_tile') {
      // True vertical SNOT wall-mounted printed tile (facing +Z in local space)
      const thick = 0.24;
      if (part.shape === 'wall_round_tile') {
        const r = Math.min(w, h) * 0.46;
        const discGeo = new THREE.CylinderGeometry(r, r, thick, 28);
        discGeo.rotateX(Math.PI / 2);
        const disc = new THREE.Mesh(discGeo, mat);
        disc.position.set(0, h / 2, -d / 2 + thick / 2 + 0.02);
        disc.castShadow = true;
        group.add(disc);

        if (printMat) {
          const face = new THREE.Mesh(new THREE.CircleGeometry(r * 0.96, 28), printMat);
          face.position.set(0, h / 2, -d / 2 + thick + 0.026);
          group.add(face);
        }
      } else {
        const pw = w - GAP * 2;
        const ph = h - GAP * 2;
        const plateGeo = new THREE.BoxGeometry(pw, ph, thick);
        const mats = printMat ? [mat, mat, mat, mat, printMat, mat] : mat;
        const mesh = new THREE.Mesh(plateGeo, mats);
        mesh.position.set(0, h / 2, -d / 2 + thick / 2 + 0.02);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
      }

    } else if (part.shape === 'cooling_fan') {
      const r = (w / 2) - GAP;
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 24), mat);
      ring.position.y = h / 2;
      ring.castShadow = true;
      group.add(ring);
      const darkCore = new THREE.Mesh(
        new THREE.CylinderGeometry(r * 0.68, r * 0.68, h + 0.03, 18),
        this._getMaterial('BLACK')
      );
      darkCore.position.y = h / 2 + 0.01;
      group.add(darkCore);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.22, r * 0.22, h + 0.05, 12), mat);
      hub.position.y = h / 2 + 0.02;
      group.add(hub);

    } else if (part.shape === 'v_pillar') {
      // Twin angled V-struts (like Set #01 elevated hall support)
      const strutGeo = new THREE.BoxGeometry(0.22, h * 1.08, 0.22);
      const left = new THREE.Mesh(strutGeo, mat);
      left.position.set(0, h / 2, -0.35);
      left.rotation.x = 0.26;
      left.castShadow = true;
      group.add(left);
      const right = new THREE.Mesh(strutGeo, mat);
      right.position.set(0, h / 2, 0.35);
      right.rotation.x = -0.26;
      right.castShadow = true;
      group.add(right);

    } else if (part.shape === 'round' || part.shape === 'round_plate' || part.shape === 'round_tile') {
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
      dish.scale.set(1, 0.52, 1);
      dish.position.y = -0.14;
      dish.castShadow = true;
      dish.receiveShadow = true;
      group.add(dish);
      const baseRing = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.94, r * 0.96, 0.24, 28), mat);
      baseRing.position.y = 0.12;
      group.add(baseRing);
    } else if (part.shape === 'cone') {
      const rBot = (w / 2) - GAP;
      const geo = new THREE.CylinderGeometry(STUD_R, rBot, h, 20);
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
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.13, h * 0.85, 8), mat);
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
      const center = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.30, h, 10), mat);
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
      this._addSubtleEdges(mesh, extrudeGeo, !!cDef.transparent);
      group.add(mesh);

      if (printMat) {
        const decal = new THREE.Mesh(new THREE.PlaneGeometry(bw * 0.90, h * 0.82), printMat);
        decal.position.set(0, h * 0.56, bd * 0.14);
        decal.rotation.x = -Math.PI / 4;
        group.add(decal);
      }
    } else {
      // Standard rectangular brick, plate, tile, grille, or fluted vent_brick
      const bw = w - GAP * 2;
      const bh = h - 0.008;
      const bd = d - GAP * 2;
      const geoKey = `${bw.toFixed(3)}_${bh.toFixed(3)}_${bd.toFixed(3)}`;
      const bodyGeo = this._getBoxGeo(bw, bh, bd);
      const mats = printMat ? [mat, mat, printMat, mat, printMat, mat] : mat;
      const body = new THREE.Mesh(bodyGeo, mats);
      body.position.y = h / 2;
      body.castShadow = true;
      body.receiveShadow = true;
      this._addSubtleEdges(body, bodyGeo, !!cDef.transparent, geoKey);
      group.add(body);

      if (part.shape === 'grille') {
        for (let i = -1; i <= 1; i++) {
          const rib = new THREE.Mesh(new THREE.BoxGeometry(w - GAP * 2 - 0.08, 0.09, 0.18), mat);
          rib.position.set(0, h + 0.04, i * 0.54);
          group.add(rib);
        }
      }

      if (part.shape === 'vent_brick') {
        // Horizontal architectural louver fins along both faces
        for (let fy = 0.22; fy <= h - 0.18; fy += 0.26) {
          const fin = new THREE.Mesh(new THREE.BoxGeometry(w - GAP * 2 + 0.04, 0.09, d - GAP * 2 + 0.04), mat);
          fin.position.y = fy;
          group.add(fin);
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

    group.rotation.y = (b.rotDeg !== undefined)
      ? (b.rotDeg * Math.PI / 180)
      : (b.rot || 0) * (Math.PI / 2);
    const basePos = new THREE.Vector3(b.x * STUD, b.y * PLATE, b.z * STUD);
    group.position.copy(basePos);

    return { mesh: group, basePos };
  }

  _writeEntryTransform(entry, yPos, visible) {
    if (entry.kind === 'mesh') {
      entry.mesh.visible = visible;
      if (visible) entry.mesh.position.set(entry.basePos.x, yPos, entry.basePos.z);
      return;
    }
    const d = this._dummy;
    if (!visible) {
      d.position.set(0, -9999, 0);
      d.scale.set(0, 0, 0);
      d.rotation.set(0, 0, 0);
      d.updateMatrix();
      entry.bodyMesh.setMatrixAt(entry.bodyIdx, d.matrix);
      entry.bodyMesh.instanceMatrix.needsUpdate = true;
      if (entry.studMesh && entry.studIndices.length) {
        for (const si of entry.studIndices) entry.studMesh.setMatrixAt(si, d.matrix);
        entry.studMesh.instanceMatrix.needsUpdate = true;
      }
      return;
    }
    d.position.set(entry.basePos.x, yPos + entry.bh / 2, entry.basePos.z);
    d.rotation.set(0, entry.rotY, 0);
    d.scale.set(entry.bw, entry.bh, entry.bd);
    d.updateMatrix();
    entry.bodyMesh.setMatrixAt(entry.bodyIdx, d.matrix);
    entry.bodyMesh.instanceMatrix.needsUpdate = true;

    if (entry.studMesh && entry.studOffsets.length) {
      d.rotation.set(0, 0, 0);
      d.scale.set(1, 1, 1);
      for (let i = 0; i < entry.studOffsets.length; i++) {
        const off = entry.studOffsets[i];
        d.position.set(entry.basePos.x + off[0], yPos + entry.bh + STUD_H / 2, entry.basePos.z + off[1]);
        d.updateMatrix();
        entry.studMesh.setMatrixAt(entry.studIndices[i], d.matrix);
      }
      entry.studMesh.instanceMatrix.needsUpdate = true;
    }
  }

  loadSet(setData, mode = 'showcase') {
    while (this.modelGroup.children.length > 0) {
      this.modelGroup.remove(this.modelGroup.children[0]);
    }
    for (const im of this.instancedMeshes) im.dispose?.();
    this.instancedMeshes = [];
    this.brickEntries = [];
    this.currentSet = setData;
    this.explodeFactor = 0;

    const useInstancing = setData.bricks.length > 1200;

    if (!useInstancing) {
      for (const b of setData.bricks) {
        const built = this._buildBrickMesh(b);
        if (!built) continue;
        this.modelGroup.add(built.mesh);
        this.brickEntries.push({
          kind: 'mesh',
          mesh: built.mesh,
          data: b,
          basePos: built.basePos.clone(),
          animStart: 0,
          animDuration: 0.45,
          isAnimating: false,
          dropOffset: 0
        });
      }
    } else {
      // High-performance InstancedMesh path for 6,000+ piece UCS models (30 draw calls, 60 FPS!)
      const boxShapes = new Set(['brick', 'plate', 'tile', 'grille', 'vent_brick']);
      const bodyCounts = new Map();
      const studCounts = new Map();

      for (const b of setData.bricks) {
        const p = PARTS[b.part];
        if (!p) continue;
        if (boxShapes.has(p.shape) && !p.print) {
          bodyCounts.set(b.color, (bodyCounts.get(b.color) || 0) + 1);
          if (p.studs && p.w * p.d <= 8) {
            studCounts.set(b.color, (studCounts.get(b.color) || 0) + p.w * p.d);
          }
        }
      }

      const bodyIMs = new Map();
      const studIMs = new Map();
      const bodyCursor = new Map();
      const studCursor = new Map();

      for (const [colorKey, count] of bodyCounts.entries()) {
        const mat = this._getMaterial(colorKey);
        const im = new THREE.InstancedMesh(this.unitBoxGeo, mat, count);
        im.castShadow = !COLORS[colorKey]?.transparent;
        im.receiveShadow = true;
        im.frustumCulled = false;
        this.modelGroup.add(im);
        this.instancedMeshes.push(im);
        bodyIMs.set(colorKey, im);
        bodyCursor.set(colorKey, 0);
      }

      for (const [colorKey, count] of studCounts.entries()) {
        const mat = this._getMaterial(colorKey);
        const im = new THREE.InstancedMesh(this.studGeom, mat, count);
        im.castShadow = false;
        im.receiveShadow = true;
        im.frustumCulled = false;
        this.modelGroup.add(im);
        this.instancedMeshes.push(im);
        studIMs.set(colorKey, im);
        studCursor.set(colorKey, 0);
      }

      for (const b of setData.bricks) {
        const p = PARTS[b.part];
        if (!p) continue;
        const basePos = new THREE.Vector3(b.x * STUD, b.y * PLATE, b.z * STUD);

        if (boxShapes.has(p.shape) && !p.print) {
          const bodyMesh = bodyIMs.get(b.color);
          const bodyIdx = bodyCursor.get(b.color);
          bodyCursor.set(b.color, bodyIdx + 1);

          const rotY = (b.rotDeg !== undefined) ? (b.rotDeg * Math.PI / 180) : (b.rot || 0) * (Math.PI / 2);
          const bw = p.w * STUD - GAP * 2;
          const bh = p.h * PLATE - 0.008;
          const bd = p.d * STUD - GAP * 2;

          const studMesh = studIMs.get(b.color) || null;
          const studIndices = [];
          const studOffsets = [];
          if (studMesh && p.studs && p.w * p.d <= 8) {
            const halfW = (p.w - 1) / 2;
            const halfD = (p.d - 1) / 2;
            const cos = Math.cos(rotY), sin = Math.sin(rotY);
            for (let ix = 0; ix < p.w; ix++) {
              for (let iz = 0; iz < p.d; iz++) {
                const lx = (ix - halfW) * STUD;
                const lz = (iz - halfD) * STUD;
                const wx = lx * cos + lz * sin;
                const wz = -lx * sin + lz * cos;
                const si = studCursor.get(b.color);
                studCursor.set(b.color, si + 1);
                studIndices.push(si);
                studOffsets.push([wx, wz]);
              }
            }
          }

          const entry = {
            kind: 'instanced',
            bodyMesh, bodyIdx, studMesh, studIndices, studOffsets,
            bw, bh, bd, rotY,
            data: b,
            basePos,
            animStart: 0,
            animDuration: 0.42,
            isAnimating: false,
            dropOffset: 0
          };
          this._writeEntryTransform(entry, basePos.y, true);
          this.brickEntries.push(entry);
        } else {
          const built = this._buildBrickMesh(b);
          if (!built) continue;
          this.modelGroup.add(built.mesh);
          this.brickEntries.push({
            kind: 'mesh',
            mesh: built.mesh,
            data: b,
            basePos: built.basePos.clone(),
            animStart: 0,
            animDuration: 0.42,
            isAnimating: false,
            dropOffset: 0
          });
        }
      }
    }

    this.resetCamera(setData);
    if (mode === 'assembly') this.setAssemblyStep(0, false);
  }

  setAssemblyStep(stepNum, animateNew = true) {
    const now = this.clock.getElapsedTime();
    let staggerIndex = 0;

    for (const entry of this.brickEntries) {
      const s = entry.data.step;
      if (s <= stepNum) {
        if (animateNew && s === stepNum) {
          entry.isAnimating = true;
          entry.animStart = now + Math.min(staggerIndex * 0.008, 0.48);
          entry.animDuration = 0.38;
          entry.dropOffset = 6.0 + (staggerIndex % 4) * 0.35;
          this._writeEntryTransform(entry, entry.basePos.y + entry.dropOffset, true);
          staggerIndex++;
        } else {
          entry.isAnimating = false;
          this._writeEntryTransform(entry, entry.basePos.y, true);
        }
      } else {
        entry.isAnimating = false;
        this._writeEntryTransform(entry, entry.basePos.y, false);
      }
    }
  }

  showAllBricks() {
    this.clearHighlight();
    for (const entry of this.brickEntries) {
      entry.isAnimating = false;
      const lift = entry.data.y * PLATE * this.explodeFactor * 1.15;
      this._writeEntryTransform(entry, entry.basePos.y + lift, true);
    }
  }

  clearHighlight() {
    while (this.highlightGroup.children.length > 0) {
      this.highlightGroup.remove(this.highlightGroup.children[0]);
    }
  }

  highlightStep(stepNum) {
    this.clearHighlight();
    const box = new THREE.Box3();
    let found = false;
    for (const entry of this.brickEntries) {
      if (entry.data.step === stepNum) {
        const p = PARTS[entry.data.part];
        const isRot = ((entry.data.rot || 0) % 2) === 1;
        const w = (isRot ? p.d : p.w) * STUD;
        const d = (isRot ? p.w : p.d) * STUD;
        const h = p.h * PLATE;
        const bmin = new THREE.Vector3(entry.basePos.x - w / 2, entry.basePos.y, entry.basePos.z - d / 2);
        const bmax = new THREE.Vector3(entry.basePos.x + w / 2, entry.basePos.y + h, entry.basePos.z + d / 2);
        box.expandByPoint(bmin);
        box.expandByPoint(bmax);
        found = true;
      }
    }
    if (!found) return;
    box.expandByScalar(0.18);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const wireGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(size.x, size.y, size.z));
    const wireMat = new THREE.LineBasicMaterial({ color: '#F97316', transparent: true, opacity: 0.92 });
    const wire = new THREE.LineSegments(wireGeo, wireMat);
    wire.position.copy(center);
    this.highlightGroup.add(wire);
  }

  focusCamera(camPos, targetPos, duration = 0.75) {
    this.controls.autoRotate = false;
    this.cameraTween = {
      start: this.clock.getElapsedTime(),
      duration,
      fromPos: this.camera.position.clone(),
      toPos: new THREE.Vector3(camPos[0], camPos[1], camPos[2]),
      fromTarget: this.controls.target.clone(),
      toTarget: new THREE.Vector3(targetPos[0], targetPos[1], targetPos[2])
    };
  }

  setExplodeFactor(factor) {
    this.explodeFactor = factor;
    for (const entry of this.brickEntries) {
      if (entry.isAnimating) continue;
      const lift = entry.data.y * PLATE * factor * 1.15;
      this._writeEntryTransform(entry, entry.basePos.y + lift, true);
    }
  }

  setAutoRotate(enabled) {
    this.controls.autoRotate = enabled;
  }

  resetCamera(setData = this.currentSet) {
    this.cameraTween = null;
    const camPos = setData?.cameraPos || [36, 26, 38];
    const target = setData?.cameraTarget || [0, 4.0, 0];
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

    if (this.cameraTween) {
      const t = Math.min((now - this.cameraTween.start) / this.cameraTween.duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      this.camera.position.lerpVectors(this.cameraTween.fromPos, this.cameraTween.toPos, ease);
      this.controls.target.lerpVectors(this.cameraTween.fromTarget, this.cameraTween.toTarget, ease);
      if (t >= 1) this.cameraTween = null;
    }

    for (const entry of this.brickEntries) {
      if (!entry.isAnimating) continue;
      const elapsed = now - entry.animStart;
      if (elapsed < 0) continue;
      const t = Math.min(elapsed / entry.animDuration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const y = entry.basePos.y + entry.dropOffset * (1 - ease);
      this._writeEntryTransform(entry, y, true);
      if (t >= 1) {
        entry.isAnimating = false;
        this._writeEntryTransform(entry, entry.basePos.y, true);
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
