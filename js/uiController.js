import { ALL_SETS } from './sets/index.js';
import { computeBOM, computeBagSummaries, renderPartSVG, exportBOMToCSV } from './bomGenerator.js';

/**
 * Lightweight Web Audio API sound synthesizer for tactile LEGO feedback
 * (brick snap click, polybag tear, box open, completion chime).
 */
class LegoSoundFX {
  constructor() {
    this.ctx = null;
  }

  _ensure() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playSnap() {
    try {
      this._ensure();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(720, now);
      osc.frequency.exponentialRampToValueAtTime(190, now + 0.045);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (_) {}
  }

  playBagTear() {
    try {
      this._ensure();
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 0.16;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.45));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2600;
      const gain = this.ctx.createGain();
      gain.gain.value = 0.22;
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch (_) {}
  }

  playChime() {
    try {
      this._ensure();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const now = this.ctx.currentTime + idx * 0.085;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      });
    } catch (_) {}
  }
}

export class UIController {
  constructor(engine) {
    this.engine = engine;
    this.sfx = new LegoSoundFX();

    this.currentSetIndex = 0;
    this.currentSet = ALL_SETS[0];
    this.mode = 'showcase'; // 'showcase' | 'box' | 'bags' | 'build'

    // Per-set build progress state
    this.progressMap = new Map();
    for (const s of ALL_SETS) {
      this.progressMap.set(s.id, {
        unboxed: false,
        openedBags: new Set(),
        builtStep: 0,      // highest step placed in 3D
        activeBagId: 1
      });
    }

    this.autoBuildTimer = null;
    this.bomBagFilter = 'all';

    this._cacheElements();
    this._bindEvents();
    this._renderSetSwitcher();
    this.selectSet(0);
  }

  _cacheElements() {
    const $ = id => document.getElementById(id);
    this.el = {
      setSwitcher: $('setSwitcher'),
      btnToggleRef: $('btnToggleRef'),
      btnOpenBOM: $('btnOpenBOM'),
      btnStartAssembly: $('btnStartAssembly'),
      btnStartAssemblyBottom: $('btnStartAssemblyBottom'),

      showcaseInfoCard: $('showcaseInfoCard'),
      infoSetNumber: $('infoSetNumber'),
      infoPieceCount: $('infoPieceCount'),
      infoTitle: $('infoTitle'),
      infoEnglish: $('infoEnglish'),
      infoLocation: $('infoLocation'),
      infoDesc: $('infoDesc'),
      statPieces: $('statPieces'),
      statUnique: $('statUnique'),
      statBags: $('statBags'),
      statSteps: $('statSteps'),

      studioToolbar: $('studioToolbar'),
      btnAutoRotate: $('btnAutoRotate'),
      explodeSlider: $('explodeSlider'),
      btnResetCam: $('btnResetCam'),

      refCard: $('refCard'),
      refCardImg: $('refCardImg'),
      refCardCaption: $('refCardCaption'),
      btnCloseRef: $('btnCloseRef'),

      boxOverlay: $('boxOverlay'),
      legoBox3d: $('legoBox3d'),
      btnCancelBox: $('btnCancelBox'),
      btnUnboxNow: $('btnUnboxNow'),
      boxSetNo: $('boxSetNo'),
      boxPcs: $('boxPcs'),
      boxArtworkImg: $('boxArtworkImg'),
      boxTitle: $('boxTitle'),
      boxSubtitle: $('boxSubtitle'),

      bagsOverlay: $('bagsOverlay'),
      bagsGrid: $('bagsGrid'),
      wbTitle: $('wbTitle'),
      wbSub: $('wbSub'),
      bookletTitle: $('bookletTitle'),
      btnExitAssemblyFromBags: $('btnExitAssemblyFromBags'),
      btnOpenBOMFromBags: $('btnOpenBOMFromBags'),

      manualPanel: $('manualPanel'),
      manualBagBadge: $('manualBagBadge'),
      manualStepNum: $('manualStepNum'),
      manualStepTotal: $('manualStepTotal'),
      manualProgressFill: $('manualProgressFill'),
      manualStepTitle: $('manualStepTitle'),
      manualStepTip: $('manualStepTip'),
      calloutCount: $('calloutCount'),
      calloutPartsGrid: $('calloutPartsGrid'),
      bagTrayText: $('bagTrayText'),
      btnSwitchBag: $('btnSwitchBag'),
      btnExitBuild: $('btnExitBuild'),

      milestoneBanner: $('milestoneBanner'),
      milestoneEmoji: $('milestoneEmoji'),
      milestoneTitle: $('milestoneTitle'),
      milestoneSub: $('milestoneSub'),
      btnNextBagAction: $('btnNextBagAction'),

      btnPrevStep: $('btnPrevStep'),
      btnAutoBuild: $('btnAutoBuild'),
      btnNextStep: $('btnNextStep'),

      bomModal: $('bomModal'),
      bomModalTitle: $('bomModalTitle'),
      bomModalSub: $('bomModalSub'),
      bomFilters: $('bomFilters'),
      bomTableBody: $('bomTableBody'),
      btnCloseBOM: $('btnCloseBOM'),
      btnExportCSV: $('btnExportCSV'),

      toast: $('toast')
    };
  }

  _bindEvents() {
    this.el.btnToggleRef.addEventListener('click', () => {
      this.el.refCard.classList.toggle('hidden');
    });
    this.el.btnCloseRef.addEventListener('click', () => {
      this.el.refCard.classList.add('hidden');
    });

    this.el.btnOpenBOM.addEventListener('click', () => this.openBOMModal('all'));
    this.el.btnOpenBOMFromBags.addEventListener('click', () => this.openBOMModal('all'));
    this.el.btnCloseBOM.addEventListener('click', () => this.el.bomModal.classList.add('hidden'));
    this.el.bomModal.addEventListener('click', e => {
      if (e.target === this.el.bomModal) this.el.bomModal.classList.add('hidden');
    });

    this.el.bomFilters.addEventListener('click', e => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      this.bomBagFilter = btn.dataset.bag;
      this.el.bomFilters.querySelectorAll('.filter-pill').forEach(p => p.classList.toggle('active', p === btn));
      this._renderBOMTable();
    });

    this.el.btnExportCSV.addEventListener('click', () => {
      const csv = exportBOMToCSV(this.currentSet);
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TSMC_LEGO_${this.currentSet.setNumber}_BOM.csv`;
      a.click();
      URL.revokeObjectURL(url);
      this.showToast(`已匯出 #${this.currentSet.setNumber} 完整零件 BOM (CSV)`);
    });

    // Showcase 3D Controls
    this.el.btnAutoRotate.addEventListener('click', () => {
      const next = this.el.btnAutoRotate.getAttribute('aria-pressed') !== 'true';
      this.el.btnAutoRotate.setAttribute('aria-pressed', String(next));
      this.engine.setAutoRotate(next);
    });

    this.el.explodeSlider.addEventListener('input', e => {
      const factor = Number(e.target.value) / 100;
      this.engine.setExplodeFactor(factor);
    });

    this.el.btnResetCam.addEventListener('click', () => {
      this.engine.resetCamera(this.currentSet);
    });

    // Enter Assembly Flow
    const enterAssembly = () => {
      this._stopAutoBuild();
      const prog = this.progressMap.get(this.currentSet.id);
      if (!prog.unboxed) {
        this.setMode('box');
      } else {
        this.setMode('bags');
      }
    };
    this.el.btnStartAssembly.addEventListener('click', enterAssembly);
    this.el.btnStartAssemblyBottom.addEventListener('click', enterAssembly);

    // Stage 1: Box Unboxing
    this.el.btnCancelBox.addEventListener('click', () => this.setMode('showcase'));
    this.el.btnUnboxNow.addEventListener('click', () => {
      this.sfx.playBagTear();
      this.el.legoBox3d.classList.add('opening');
      const prog = this.progressMap.get(this.currentSet.id);
      prog.unboxed = true;
      setTimeout(() => {
        this.el.legoBox3d.classList.remove('opening');
        this.setMode('bags');
        this.showToast('開箱成功！請選擇第 1 包零件袋撕開並開始組裝');
      }, 480);
    });

    // Stage 2: Bags Workbench
    this.el.btnExitAssemblyFromBags.addEventListener('click', () => this.setMode('showcase'));

    // Stage 3: Live 3D Build Manual Controls
    this.el.btnExitBuild.addEventListener('click', () => {
      this._stopAutoBuild();
      this.setMode('bags');
    });
    this.el.btnSwitchBag.addEventListener('click', () => {
      this._stopAutoBuild();
      this.setMode('bags');
    });

    this.el.btnNextStep.addEventListener('click', () => this._placeNextStep());
    this.el.btnPrevStep.addEventListener('click', () => this._undoStep());
    this.el.btnAutoBuild.addEventListener('click', () => this._toggleAutoBuild());

    this.el.btnNextBagAction.addEventListener('click', () => {
      const prog = this.progressMap.get(this.currentSet.id);
      const totalSteps = this.currentSet.steps.length;
      if (prog.builtStep >= totalSteps) {
        this.setMode('showcase');
        this.showToast(`🎉 恭喜完成「${this.currentSet.name}」！自由旋轉欣賞你的作品`);
      } else {
        this.setMode('bags');
      }
    });
  }

  _renderSetSwitcher() {
    this.el.setSwitcher.innerHTML = '';
    ALL_SETS.forEach((set, idx) => {
      const btn = document.createElement('button');
      btn.className = 'set-tab';
      btn.dataset.index = String(idx);
      btn.innerHTML = `<span class="set-tab-no">#${set.setNumber}</span><span>${set.shortName}</span>`;
      btn.addEventListener('click', () => this.selectSet(idx));
      this.el.setSwitcher.appendChild(btn);
    });
  }

  selectSet(idx) {
    this._stopAutoBuild();
    this.currentSetIndex = idx;
    this.currentSet = ALL_SETS[idx];

    // Update active tab styling
    this.el.setSwitcher.querySelectorAll('.set-tab').forEach((tab, i) => {
      tab.classList.toggle('active', i === idx);
    });

    // Reset explode slider
    this.el.explodeSlider.value = '0';

    // Update Showcase Info Card
    const bom = computeBOM(this.currentSet.bricks);
    this.el.infoSetNumber.textContent = `#${this.currentSet.setNumber}`;
    this.el.infoPieceCount.textContent = `${bom.totalCount} PCS`;
    this.el.infoTitle.textContent = this.currentSet.name;
    this.el.infoEnglish.textContent = this.currentSet.englishName;
    this.el.infoLocation.textContent = `📍 ${this.currentSet.location}`;
    this.el.infoDesc.textContent = this.currentSet.description;
    this.el.statPieces.textContent = String(bom.totalCount);
    this.el.statUnique.textContent = String(bom.uniqueCount);
    this.el.statBags.textContent = String(this.currentSet.bags.length);
    this.el.statSteps.textContent = String(this.currentSet.steps.length);

    // Update Reference Photo Card
    this.el.refCardImg.src = this.currentSet.refImage;
    this.el.refCardCaption.textContent = `#${this.currentSet.setNumber} ${this.currentSet.name} — 設計參考原圖`;

    // Update Collector Box Art
    this.el.boxSetNo.textContent = this.currentSet.setNumber;
    this.el.boxPcs.textContent = `${bom.totalCount} pcs/pzs`;
    this.el.boxArtworkImg.src = this.currentSet.refImage;
    this.el.boxTitle.textContent = this.currentSet.name;
    this.el.boxSubtitle.textContent = this.currentSet.englishName;

    // Load 3D Model
    this.engine.loadSet(this.currentSet, 'showcase');
    this.setMode('showcase');
  }

  setMode(mode) {
    this.mode = mode;
    this._stopAutoBuild();

    this.el.showcaseInfoCard.classList.toggle('hidden', mode !== 'showcase');
    this.el.studioToolbar.classList.toggle('hidden', mode !== 'showcase');
    this.el.boxOverlay.classList.toggle('hidden', mode !== 'box');
    this.el.bagsOverlay.classList.toggle('hidden', mode !== 'bags');
    this.el.manualPanel.classList.toggle('hidden', mode !== 'build');

    if (mode === 'showcase') {
      this.engine.showAllBricks();
      this.el.btnStartAssembly.innerHTML = '<span class="btn-icon">📦</span><span class="btn-label">開箱組裝</span>';
    } else if (mode === 'bags') {
      this._renderBagsWorkbench();
    } else if (mode === 'build') {
      const prog = this.progressMap.get(this.currentSet.id);
      this.engine.setAutoRotate(false);
      this.el.btnAutoRotate.setAttribute('aria-pressed', 'false');
      this.engine.setExplodeFactor(0);
      this.engine.setAssemblyStep(prog.builtStep, false);
      this._renderManualPanel();
    }
  }

  _renderBagsWorkbench() {
    const prog = this.progressMap.get(this.currentSet.id);
    const summaries = computeBagSummaries(this.currentSet);

    this.el.wbTitle.textContent = `#${this.currentSet.setNumber} ${this.currentSet.name} — 零件袋工作台`;
    this.el.bookletTitle.textContent = `官方樂高風格組裝說明書 (共 ${this.currentSet.steps.length} 步驟)`;

    // Find next uncompleted bag
    let nextBagId = 1;
    for (const bag of summaries) {
      const maxStepInBag = Math.max(...bag.steps);
      if (prog.builtStep < maxStepInBag) {
        nextBagId = bag.id;
        break;
      }
      nextBagId = bag.id + 1;
    }

    this.el.bagsGrid.innerHTML = '';
    for (const bag of summaries) {
      const minStep = Math.min(...bag.steps);
      const maxStep = Math.max(...bag.steps);
      const isCompleted = prog.builtStep >= maxStep;
      const isNext = bag.id === nextBagId;

      const card = document.createElement('button');
      card.className = `polybag-card ${isCompleted ? 'completed' : ''} ${isNext ? 'active-next' : ''}`;

      // Show top 6 unique color swatches inside the transparent polybag
      const uniqueHexes = [...new Set(bag.bom.items.map(i => i.hex))].slice(0, 7);
      const swatchesHtml = uniqueHexes.map(hex => `<span class="bag-swatch-dot" style="background:${hex}"></span>`).join('');

      let actionText = '✂️ 撕開此包零件';
      if (isCompleted) actionText = '✅ 已完成（可重看）';
      else if (prog.openedBags.has(bag.id)) actionText = '🧱 繼續組裝此包';

      card.innerHTML = `
        <div class="bag-big-number">${bag.id}</div>
        <div class="bag-title">${bag.title.replace(/^第 \d 包：/, '')}</div>
        <div class="bag-meta">${bag.pieceCount} 件零件・步驟 ${minStep}–${maxStep}</div>
        <div class="bag-swatches">${swatchesHtml}</div>
        <div class="bag-action-pill">${actionText}</div>
      `;

      card.addEventListener('click', () => {
        this.sfx.playBagTear();
        prog.openedBags.add(bag.id);
        prog.activeBagId = bag.id;
        // If user jumped ahead to a later bag, ensure prior bags' bricks are visible so bricks don't float
        if (prog.builtStep < minStep - 1) {
          prog.builtStep = minStep - 1;
        } else if (isCompleted) {
          // Allow replaying this bag from its first step
          prog.builtStep = minStep - 1;
        }
        this.setMode('build');
        this.showToast(`已撕開第 ${bag.id} 包零件袋（${bag.pieceCount} 件零件已倒出至托盤）`);
      });

      this.el.bagsGrid.appendChild(card);
    }
  }

  _renderManualPanel() {
    const prog = this.progressMap.get(this.currentSet.id);
    const totalSteps = this.currentSet.steps.length;
    const summaries = computeBagSummaries(this.currentSet);
    const currentBag = summaries.find(b => b.id === prog.activeBagId) || summaries[0];
    const maxStepInBag = Math.max(...currentBag.steps);

    // Determine which step is currently being instructed (next step to place)
    const displayStepNum = Math.min(prog.builtStep + 1, totalSteps);
    const stepMeta = this.currentSet.steps.find(s => s.step === displayStepNum) || this.currentSet.steps[totalSteps - 1];

    const bagCompleted = prog.builtStep >= maxStepInBag;
    const setCompleted = prog.builtStep >= totalSteps;

    this.el.manualBagBadge.textContent = `BAG ${currentBag.id}`;
    this.el.manualStepNum.textContent = String(setCompleted ? totalSteps : displayStepNum);
    this.el.manualStepTotal.textContent = `/ ${totalSteps}`;
    this.el.manualProgressFill.style.width = `${Math.round((prog.builtStep / totalSteps) * 100)}%`;

    this.el.manualStepTitle.textContent = setCompleted
      ? `🎉 全部 ${totalSteps} 步驟已完成！`
      : `步驟 ${stepMeta.step}：${stepMeta.title}`;
    this.el.manualStepTip.textContent = setCompleted
      ? `你已親手完成「${this.currentSet.name}」的整組樂高建築模型！`
      : stepMeta.tip;

    // Render Official LEGO Blue-Bordered Parts Callout Box for the active step
    const stepBom = computeBOM(this.currentSet.bricks, { step: stepMeta.step });
    this.el.calloutCount.textContent = `${stepBom.totalCount} 件`;
    this.el.calloutPartsGrid.innerHTML = stepBom.items.map(item => `
      <div class="callout-part-item" title="${item.partZh} (${item.partName}) - ${item.colorZh}">
        ${renderPartSVG(item)}
        <div class="callout-part-info">
          <span class="callout-qty">${item.qty}×</span>
          <span class="callout-name">${item.partZh}</span>
          <span class="callout-id">#${item.partId}・${item.colorZh}</span>
        </div>
      </div>
    `).join('');

    // Remaining pieces in current bag
    const remainingInBag = this.currentSet.bricks.filter(
      b => b.bag === currentBag.id && b.step > prog.builtStep
    ).length;
    this.el.bagTrayText.textContent = `第 ${currentBag.id} 包托盤剩餘零件：${remainingInBag} 件`;

    // Milestone Banner (Bag completed or entire Set completed)
    if (setCompleted) {
      this.el.milestoneBanner.classList.remove('hidden');
      this.el.milestoneEmoji.textContent = '🏆';
      this.el.milestoneTitle.textContent = `恭喜完成 ${this.currentSet.name}！`;
      this.el.milestoneSub.textContent = `4 包零件共 ${this.currentSet.bricks.length} 塊積木已全部精準組裝。`;
      this.el.btnNextBagAction.textContent = '✨ 進入 3D 典藏展示';
    } else if (bagCompleted) {
      this.el.milestoneBanner.classList.remove('hidden');
      this.el.milestoneEmoji.textContent = '🎉';
      this.el.milestoneTitle.textContent = `第 ${currentBag.id} 包零件組裝完成！`;
      this.el.milestoneSub.textContent = `接下來請拆開第 ${currentBag.id + 1} 包零件袋繼續建構。`;
      this.el.btnNextBagAction.textContent = `🛍️ 拆開第 ${currentBag.id + 1} 包零件`;
    } else {
      this.el.milestoneBanner.classList.add('hidden');
    }

    // Button states
    this.el.btnPrevStep.disabled = prog.builtStep <= 0;
    this.el.btnNextStep.disabled = bagCompleted || setCompleted;
    this.el.btnNextStep.textContent = setCompleted
      ? '✅ 已完工'
      : (bagCompleted ? '🛍️ 請拆開下一包' : `🧱 放置步驟 ${displayStepNum} 積木`);
  }

  _placeNextStep() {
    const prog = this.progressMap.get(this.currentSet.id);
    const totalSteps = this.currentSet.steps.length;
    const summaries = computeBagSummaries(this.currentSet);
    const currentBag = summaries.find(b => b.id === prog.activeBagId) || summaries[0];
    const maxStepInBag = Math.max(...currentBag.steps);

    if (prog.builtStep >= maxStepInBag || prog.builtStep >= totalSteps) {
      this._stopAutoBuild();
      return;
    }

    prog.builtStep += 1;
    this.engine.setAssemblyStep(prog.builtStep, true);
    this.sfx.playSnap();

    if (prog.builtStep === maxStepInBag || prog.builtStep === totalSteps) {
      this._stopAutoBuild();
      setTimeout(() => this.sfx.playChime(), 360);
    }

    this._renderManualPanel();
  }

  _undoStep() {
    this._stopAutoBuild();
    const prog = this.progressMap.get(this.currentSet.id);
    if (prog.builtStep <= 0) return;
    prog.builtStep -= 1;
    this.engine.setAssemblyStep(prog.builtStep, false);
    this._renderManualPanel();
  }

  _toggleAutoBuild() {
    if (this.autoBuildTimer) {
      this._stopAutoBuild();
      return;
    }
    this.el.btnAutoBuild.textContent = '⏸ 暫停';
    this._placeNextStep();
    this.autoBuildTimer = setInterval(() => {
      const prog = this.progressMap.get(this.currentSet.id);
      const summaries = computeBagSummaries(this.currentSet);
      const currentBag = summaries.find(b => b.id === prog.activeBagId) || summaries[0];
      const maxStepInBag = Math.max(...currentBag.steps);
      if (prog.builtStep >= maxStepInBag) {
        this._stopAutoBuild();
      } else {
        this._placeNextStep();
      }
    }, 1150);
  }

  _stopAutoBuild() {
    if (this.autoBuildTimer) {
      clearInterval(this.autoBuildTimer);
      this.autoBuildTimer = null;
    }
    if (this.el?.btnAutoBuild) {
      this.el.btnAutoBuild.textContent = '▶ 自動';
    }
  }

  openBOMModal(bagFilter = 'all') {
    this.bomBagFilter = String(bagFilter);
    this.el.bomModalTitle.textContent = `#${this.currentSet.setNumber} ${this.currentSet.name} — 零件 BOM 表`;
    const totalBom = computeBOM(this.currentSet.bricks);
    this.el.bomModalSub.textContent = `共 ${totalBom.totalCount} 件積木・${totalBom.uniqueCount} 種獨立零件・分 4 包封裝`;

    this.el.bomFilters.querySelectorAll('.filter-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.bag === this.bomBagFilter);
    });

    this._renderBOMTable();
    this.el.bomModal.classList.remove('hidden');
  }

  _renderBOMTable() {
    const filter = this.bomBagFilter === 'all' ? {} : { bag: Number(this.bomBagFilter) };
    const bom = computeBOM(this.currentSet.bricks, filter);

    this.el.bomTableBody.innerHTML = bom.items.map(item => `
      <tr>
        <td>${renderPartSVG(item)}</td>
        <td><code>${item.partId}</code></td>
        <td>
          <strong>${item.partZh}</strong><br/>
          <span style="font-size:11.5px;color:#7C8594">${item.partName}</span>
        </td>
        <td>
          <span class="color-cell">
            <span class="color-dot" style="background:${item.hex};${item.transparent ? 'opacity:0.75;' : ''}"></span>
            <span>${item.colorZh} <span style="color:#7C8594;font-size:11.5px">(#${item.colorId})</span></span>
          </span>
        </td>
        <td class="num">${item.qty}×</td>
      </tr>
    `).join('');
  }

  showToast(message) {
    this.el.toast.textContent = message;
    this.el.toast.classList.remove('hidden');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this.el.toast.classList.add('hidden');
    }, 3200);
  }
}
