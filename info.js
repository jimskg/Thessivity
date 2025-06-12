document.addEventListener("DOMContentLoaded", async function () {
  let currentLanguage = 'gr';
  
  const urlParams = new URLSearchParams(window.location.search);
  const pageId = urlParams.get('page');
  const divToShow = document.getElementById(pageId);
  if (divToShow){
    divToShow.classList.remove('hidden');
  } else {
    document.getElementById('test').classList.remove('hidden');
  }
  

  openHomeBody();
  closeLoadingSpinner();

  /* ARROW TO TOP START */

  window.addEventListener('scroll', function () {
    const scrollBtn = document.getElementById("arrow-to-top-button");
    if (!scrollBtn) return;
    window.scrollY > window.innerHeight - 500
      ? scrollBtn.classList.add("show")
      : scrollBtn.classList.remove("show");
  });

  document.getElementById('arrow-to-top-button')?.addEventListener('click', () => {
    scrollToTop();
  });

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  
  /* ARROW TO TOP END */
  
  /* SPINNER START */

  function closeLoadingSpinner(){
    const spinner = document.getElementById("loading-container");
    spinner.classList.add("hidden");
  }

  function openLoadingSpinner(){
    const spinner = document.getElementById("loading-container");
    spinner.classList.remove("hidden");
  }

  /* SPINNER END */

  function redirectToActivity(activityId, event){
    const url = `activity.html?activityId=${encodeURIComponent(activityId)}`;
    if (event.button === 1) window.open(url, '_blank');
    else if (event.button === 0) window.location.href = url;
  }
  
  function redirectToHome(event){
    const url = 'index.html';
    if (event.button === 1) window.open(url, '_blank');
    else if (event.button === 0) window.location.href = url;
  }

  function redirectToSite(urlsite, event){
    const url = urlsite;
    if (event.button === 1) window.open(url, '_blank');
    else if (event.button === 0) window.location.href = url;
  }

  function openHomeBody(){
    const home = document.getElementById("home-body");
    home.classList.remove("hidden");
  }

  function changeArrowDirectionIcon(arrowImg) {
    if (arrowImg.src.includes('down_arrow_logo.png')) {
      arrowImg.src = 'images/up_arrow_logo.png';
    } else {
      arrowImg.src = 'images/down_arrow_logo.png';
    }
  }

  function collapseArrowIcon(arrowImg) {
    arrowImg.src = 'images/down_arrow_logo.png';
  }

  function openCloseDynamicMenu(menu) {
    if (menu.classList.contains('display-none')) {
      menu.classList.remove("display-none");
    } else {
      menu.classList.add("display-none");
    }
  }

  document.getElementById('home-a')?.addEventListener('mousedown', function (event) {
    redirectToHome(event);
  });

  document.getElementById('activities-a')?.addEventListener('mousedown', function (event) {
    redirectToActivity(undefined, event);
  });
  
  document.getElementById('home-li')?.addEventListener('mousedown', function (event) {
    redirectToHome(event);
  });

  document.getElementById('activities-li')?.addEventListener('mousedown', function (event) {
    redirectToActivity(undefined, event);
  });

  document.getElementById('lang-button')?.addEventListener('click', () => {
    const menu = document.getElementById('list-language-menu');
    openCloseDynamicMenu(menu);
  });

  document.getElementById('menu-button')?.addEventListener('click', () => {
    const menu = document.getElementById('list-menu');
    openCloseDynamicMenu(menu);
  });

  document.getElementById('gr-li')?.addEventListener('click', () => {
    const menu = document.getElementById('list-language-menu');
    openCloseDynamicMenu(menu);
    if (currentLanguage !== 'gr') {
      currentLanguage = 'gr';
    }
  });

  document.getElementById('en-li')?.addEventListener('click', () => {
    const menu = document.getElementById('list-language-menu');
    openCloseDynamicMenu(menu);
    if (currentLanguage !== 'en') {
      currentLanguage = 'en';
    }
  });

  document.getElementById('home-li')?.addEventListener('click', () => {
    const menu = document.getElementById('list-menu');
    openCloseDynamicMenu(menu);
  });

  document.getElementById('activities-li')?.addEventListener('click', () => {
    const menu = document.getElementById('list-menu');
    openCloseDynamicMenu(menu);
    window.currentPage = 'activities';
  });

  document.getElementById('footer-info-dropdown')?.addEventListener('click', () => {
    const arrow = document.getElementById('footer-info-dropdown-img');
    if (getComputedStyle(arrow).display === 'none') return;
    document.getElementById('footer-list-info').classList.toggle("display-block");
    changeArrowDirectionIcon(arrow);
  });

  document.getElementById('footer-support-dropdown')?.addEventListener('click', () => {
    const arrow = document.getElementById('footer-support-dropdown-img');
    if (getComputedStyle(arrow).display === 'none') return;
    document.getElementById('footer-list-support').classList.toggle("display-block");
    changeArrowDirectionIcon(arrow);
  });

  // Unified outside click handler for menus, language menu, and filter dropdowns including calendars
  window.addEventListener('click', function (event) {
    closePopUps('list-language-menu', 'lang-button', 'lang-button-img', event);
    closePopUps('list-menu', 'menu-button', 'menu-button-img', event);
  });

  function closePopUps(menuId, buttonId, imgId, event) {
    const menu = document.getElementById(menuId);
    const button = document.getElementById(buttonId);
    const img = document.getElementById(imgId);
    if (!(menu.contains(event.target) || button.contains(event.target) || (img && img.contains(event.target)))) {
      menu.classList.add("display-none");
      if (img && img.src.includes('up_arrow_logo.png')) collapseArrowIcon(img);
    }
  }

});
