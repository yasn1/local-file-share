// public/alert.js

// Basit alert
function showAlert(title, text, type = 'info') {
    const colors = {
      info:  '#3150ff',
      success: '#43a047',
      error: '#e53935',
      warning: '#ff9800'
    };
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
  
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <h3 style="color: ${colors[type] || colors.info}">${title}</h3>
      <p>${text}</p>
      <div class="modal-buttons">
        <button class="btn btn-primary">Tamam</button>
      </div>
    `;
  
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  
    modal.querySelector('button').onclick = () => {
      document.body.removeChild(overlay);
    };
  }
  
  // Basit confirm
  function showConfirm(title, text) {
    return new Promise(resolve => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
  
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
        <h3 style="color: var(--accent)">${title}</h3>
        <p>${text}</p>
        <div class="modal-buttons">
          <button class="btn btn-secondary">İptal</button>
          <button class="btn btn-primary">Tamam</button>
        </div>
      `;
  
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
  
      const [noBtn, yesBtn] = modal.querySelectorAll('button');
      noBtn.onclick  = () => { document.body.removeChild(overlay); resolve(false); };
      yesBtn.onclick = () => { document.body.removeChild(overlay); resolve(true); };
    });
  }
  