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
  const buttonId = urlParams.get('buttonId');
  console.log("Button ID:", buttonId); // Use it as needed

  async function fetchSheetData(sheetId, apiKey) {
    try {
      const gids = {
        First: '413577439'
      };

      for (let sheetName in gids) {
        if (breakIfDownForMaintenance) break;
        const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
        const response = await fetch(sheetUrl);
        const json = await response.json();
        const rows = json.values.slice(1);

        if (sheetName === "First") {
          rows.forEach(row => {
            const [value] = row;
            console.log('dimitris2: ' + value);
            if (testEnvironment) {
              console.log('here');
            }
          });
        }
      }
      closeLoadingSpinner();
      openHomeBody();
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

  function redirectToActivity(activityId){
    window.location.href = `activity.html?buttonId=${encodeURIComponent(activityId)}`;
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

  document.getElementById('home-a')?.addEventListener('click', function () {
    redirectToActivity();
  });

  document.getElementById('activities-a')?.addEventListener('click', function () {
    redirectToActivity();
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
    // Close language menu
    closePopUps('list-language-menu', 'lang-button', 'lang-button-img', event);

    // Close main menu
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
