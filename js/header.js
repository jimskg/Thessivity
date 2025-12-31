
let databaseSource = 'SF' // 'SF' / 'GD'
let testEnvironment = window.location.href.includes('Thessivity/index.html');

async function loadHeader() {
  const res = await fetch('partials/header.html');
  const html = await res.text();

  document.getElementById('header-placeholder').innerHTML = html;

  initializeHeaderToggles();
  translatePage();
}


function initializeHeaderToggles() {
  // GR language
  const grLi = document.getElementById('gr-li');
  grLi?.addEventListener('click', () => {
    const menu = document.getElementById('list-language-menu');
    openCloseDynamicMenu(menu);
    if (currentLanguage !== 'gr') {
      setLanguage('gr');
    }
  });

  // EN language
  const enLi = document.getElementById('en-li');
  enLi?.addEventListener('click', () => {
    const menu = document.getElementById('list-language-menu');
    openCloseDynamicMenu(menu);
    if (currentLanguage !== 'en') {
      setLanguage('en');
    }
  });

  document.getElementById('logo-a')?.addEventListener('mousedown', function (event) {
    redirectToHome(event);
  });

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

  document.getElementById('home-li')?.addEventListener('click', () => {
    const menu = document.getElementById('list-menu');
    openCloseDynamicMenu(menu);
  });

  document.getElementById('activities-li')?.addEventListener('click', () => {
    const menu = document.getElementById('list-menu');
    openCloseDynamicMenu(menu);
    window.currentPage = 'activities';
  });

  document.getElementById('lang-button')?.addEventListener('click', () => {
    const menu = document.getElementById('list-language-menu');
    openCloseDynamicMenu(menu);
  });

  document.getElementById('menu-button')?.addEventListener('click', () => {
    const menu = document.getElementById('list-menu');
    openCloseDynamicMenu(menu);
  });

  window.addEventListener('click', function (event) {
    // Close language menu
    closePopUps('list-language-menu', 'lang-button', 'lang-button-img', event);

    // Close main menu
    closePopUps('list-menu', 'menu-button', 'menu-button-img', event);
  });

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
}

loadHeader();
  
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

function openHomeBody(){
  const home = document.getElementById("home-body");
  home.classList.remove("hidden");
}

function closeHomeBody(){
  const home = document.getElementById("home-body");
  home.classList.add("hidden");
}

function openCloseDynamicMenu(menu) {
  if (menu.classList.contains('display-none')) {
    menu.classList.remove("display-none");
  } else {
    menu.classList.add("display-none");
  }
}

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

function closePopUps(menuId, buttonId, imgId, event) {
  const menu = document.getElementById(menuId);
  const button = document.getElementById(buttonId);
  const img = document.getElementById(imgId);
  if (!(menu.contains(event.target) || button.contains(event.target) || (img && img.contains(event.target)))) {
    menu.classList.add("display-none");
    if (img && img.src.includes('up_arrow_logo.png')) collapseArrowIcon(img);
  }
}

function collapseArrowIcon(arrowImg) {
  arrowImg.src = 'images/down_arrow_logo.png';
}
