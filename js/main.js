import { LegoEngine } from './legoEngine.js';
import { UIController } from './uiController.js';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('canvasContainer');
  const engine = new LegoEngine(container);
  try {
    const res = await fetch('data/models.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const sets = await res.json();
    window.__legoApp = new UIController(engine, sets);
  } catch (err) {
    console.error('Failed to load LEGO models:', err);
  }
});
