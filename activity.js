document.addEventListener("DOMContentLoaded", async function () {
  let currentLanguage = 'gr';
  let breakIfDownForMaintenance = false;
  let testEnvironment = window.location.href.includes('Thessivity/index.html');
  let outputData = {};

  const apiKey = 'AIzaSyDuJGX7mZ45UxWwctaRSfa6LNq7qPM7_fM'; // Your API key from Google Developer Console
  //https://console.cloud.google.com/apis/credentials?inv=1&invt=AbxvKg&project=thessivity //jimskgg@gmail.com 
  const sheetId = '1LPjh1COe8CRUiLgGqf2wQA64IbOx4q2vuZcTJtwATFs'; // Google Sheet ID
  //https://drive.google.com/drive/folders/1Firv30_I1x6b5ENz3MLu31ZxpDNLcTdE

  const urlParams = new URLSearchParams(window.location.search);
  const activityId = urlParams.get('activityId');
  console.log("Activity Id:", activityId);
  
  const buttonBar = document.querySelector('.card-link-button-activity');
  const stopMarker = document.querySelector('#stop-here');

  async function fetchSheetData(sheetId, apiKey) {
    try {
      const gids = {
        First: '413577439'
      };

      // for (let sheetName in gids) {
      //   if (breakIfDownForMaintenance) break;
      //   const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
      //   const response = await fetch(sheetUrl);
      //   const json = await response.json();
      //   const rows = json.values.slice(1);

      //   if (sheetName === "First") {
      //     rows.forEach(row => {
      //       const [value] = row;
      //       console.log('dimitris2: ' + value);
      //       if (testEnvironment) {
      //         console.log('here');
      //       }
      //     });
      //   }
      // }
      // closeLoadingSpinner();
      // openHomeBody();

      setTimeout(() => {
        closeLoadingSpinner();
        openHomeBody();
      }, 1000);

    } catch (error) {
      console.log('error: ' + error);
      closeLoadingSpinner();
    }
  }

  await fetchSheetData(sheetId, apiKey);

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
     if (isMobileDevice()) checkButtonBarStop();
  }
  
  /* ARROW TO TOP END */
  
  /* ACTIVITY MOVING BUTTON START */

  function isMobileDevice() {
    return /Mobi|Android|iPhone/i.test(navigator.userAgent);
  }

  function checkButtonBarStop() {
    const stopRect = stopMarker.getBoundingClientRect();
    const stopTop = stopRect.top + window.scrollY;
    const stopHeight = stopMarker.offsetHeight;
    const buttonHeight = buttonBar.offsetHeight;

    const scrollBottom = window.scrollY + window.innerHeight;

    // Trigger absolute only when the entire stop-marker + button would fit in view
    const fullStopPoint = stopTop + stopHeight + buttonHeight;

    if (scrollBottom >= fullStopPoint) {

      // Switch to absolute and set exact top position
      buttonBar.classList.add('card-link-button-activity-stopped');
      buttonBar.style.position = 'absolute';
      buttonBar.style.top = `${stopTop + stopHeight}px`;
      buttonBar.style.left = '0';
      buttonBar.style.right = '0';
      buttonBar.style.bottom = 'auto';
    } else {
      // Restore to fixed position
      buttonBar.classList.remove('card-link-button-activity-stopped');
      buttonBar.style.position = 'fixed';
      buttonBar.style.bottom = '0';
      buttonBar.style.top = 'auto';
    }
  }

  if (isMobileDevice()) {
    window.addEventListener('scroll', checkButtonBarStop);
    window.addEventListener('resize', checkButtonBarStop);// Run on load to set correct state initially
    checkButtonBarStop();
  }

  /* ACTIVITY MOVING BUTTON END */
  
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

  document.querySelector('.card-link-button-a-activity')?.addEventListener('mousedown', function(event) {
      const urlsite = this.dataset.urlsite;
      redirectToSite(urlsite, event);
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

  /* SHOW MORE LESS DESCRIPTION LINES START */

  const toggle = document.querySelector('.card-title-activity-text-toggle');
  const content = document.querySelector('.card-title-description-text-activity');
  const textElement = document.querySelector('.card-title-description-text-activity');
  const maxLines = 3;
  
  if (getLineCount(textElement) >= maxLines) {
    document.querySelector('.card-title-activity-text-toggle').style.display = 'inline-block';
    textElement.classList.add('fade-out');
  } else {
    document.querySelector('.card-title-activity-text-toggle').style.display = 'none';
  }

  function getLineCount(element) {
    const style = window.getComputedStyle(element);
    const lineHeight = parseFloat(style.lineHeight);

    // Get the total height of the element in pixels
    const elementHeight = element.getBoundingClientRect().height;

    // Calculate number of lines
    const lines = Math.round(elementHeight / lineHeight);

    return lines;
  }

  toggle.textContent = 'View more';
  
  toggle.addEventListener('click', () => {
    content.classList.toggle('card-title-description-text-activity-expanded');

    if (content.classList.contains('card-title-description-text-activity-expanded')) {
      toggle.textContent = 'Show less';
      content.classList.remove('fade-out');
    } else {
      toggle.textContent = 'View more';
      content.classList.add('fade-out');
    }
    if (isMobileDevice()) checkButtonBarStop();
  });

  /* SHOW MORE LESS DESCRIPTION LINES END */

});
