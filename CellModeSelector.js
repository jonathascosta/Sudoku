export class CellModeSelector {
    constructor(defaultMode = 'Value', onToggle = () => {}) {
      this.mode = defaultMode;
      this.onToggle = onToggle;
      this.toggleMode = this.toggleMode.bind(this);
    }
  
    toggleMode(checkboxElement) {
      this.mode = checkboxElement.checked ? 'Annotations' : 'Value';
      this.onToggle(this.mode);
    }
  
    render() {
      return `
        <div class="checkbox-container">
          <label>
            <input type="checkbox" style="margin-top: 20px" onchange="window.board.cellModeSelector.toggleMode(this)" ${this.mode === 'Annotations' ? 'checked' : ''} />
            Annotations Mode
          </label>
        </div>
      `;
    }
  }
  