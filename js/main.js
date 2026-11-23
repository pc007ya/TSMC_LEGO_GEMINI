import { LegoEngine } from './legoEngine.js';
import { UIController } from './uiController.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('canvasContainer');
  const engine = new LegoEngine(container);
  window.__legoApp = new UIController(engine);
});
