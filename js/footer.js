async function loadFooter() {
  const res = await fetch('partials/footer.html');
  const html = await res.text();

  document.getElementById('footer-placeholder').innerHTML = html;

  initializeFooterToggles();
  translatePage();
}

function initializeFooterToggles() {
  // Info dropdown
  const infoDropdown = document.getElementById('footer-info-dropdown');
  infoDropdown?.addEventListener('click', () => {
    const arrow = document.getElementById('footer-info-dropdown-img');
    if (!arrow || getComputedStyle(arrow).display === 'none') return;
    document.getElementById('footer-list-info')?.classList.toggle('display-block');
    changeArrowDirectionIcon(arrow);
  });

  // Support dropdown
  const supportDropdown = document.getElementById('footer-support-dropdown');
  supportDropdown?.addEventListener('click', () => {
    const arrow = document.getElementById('footer-support-dropdown-img');
    if (!arrow || getComputedStyle(arrow).display === 'none') return;
    document.getElementById('footer-list-support')?.classList.toggle('display-block');
    changeArrowDirectionIcon(arrow);
  });
}

loadFooter();

function changeArrowDirectionIcon(arrowImg) {
  if (arrowImg.src.includes('down_arrow_logo.png')) {
    arrowImg.src = 'images/up_arrow_logo.png';
  } else {
    arrowImg.src = 'images/down_arrow_logo.png';
  }
}
