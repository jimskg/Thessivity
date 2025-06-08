(function ($) {
  $(function () {

    let currentLanguage = 'gr';
    let breakIfDownForMaintenance = false;
    let testEnvironment = window.location.href.includes('Thessivity/index.html');
    let outputData = {};
    const apiKey = 'AIzaSyDuJGX7mZ45UxWwctaRSfa6LNq7qPM7_fM'; // Your API key from Google Developer Console
    //https://console.cloud.google.com/apis/credentials?inv=1&invt=AbxvKg&project=thessivity //jimskgg@gmail.com 
    const sheetId = '1LPjh1COe8CRUiLgGqf2wQA64IbOx4q2vuZcTJtwATFs'; // Google Sheet ID
    //https://drive.google.com/drive/folders/1Firv30_I1x6b5ENz3MLu31ZxpDNLcTdE

    
    async function fetchSheetData(sheetId, apiKey) {
      try {
        // Define the gids for each sheet (Category, Products, Translations)
        const gids = {
          First: '413577439'
        };
    
        // Create an object to store the categories, products, and translations
        const categories = [];
        const products = [];
        const translations = { 
          gr: { categories: {}, offers: {}, products: {}, offerProducts: {} }, 
          en: { categories: {}, offers: {}, products: {}, offerProducts: {} } 
        };
        const offers = [];
        const offerProducts = [];

        // Fetch data for Categories, Products, and Translations sheets
        for (let sheetName in gids) {
          if (breakIfDownForMaintenance) break;
          const gid = gids[sheetName];
          const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

          const response = await fetch(sheetUrl);
          const json = await response.json();

          // Skip headers by starting from the second row
          const rows = json.values.slice(1);
          // Process each sheet based on its name (maintenance, categories, products, translations)
          if (sheetName === "First") {
            rows.forEach(row => {
              const [value] = row; // Map columns based on the sheet structure
              console.log('dimitris2: ' + value);
                if (testEnvironment){
                  console.log('here');
                }
            });
          }
        }
        
      } catch (error) {
        console.log('error: ' + error);
      }
    }

    fetchSheetData(sheetId, apiKey);

    function navigateTo(tabId, buttonId) {
      const tabs = document.getElementsByClassName('tab');
      const buttons = document.getElementsByClassName('nav-item');
      for (currentButtons of buttons) {
        if (buttonId == 'back-id-li'){
          if (currentButtons.id == 'back-id-li') currentButtons.style.display = 'block';
          else currentButtons.style.display = 'none';
        } else {
          if (currentButtons.id == 'back-id-li') currentButtons.style.display = 'none';
          else currentButtons.style.display = 'block';
        }
      }

      for (currentTab of tabs) {
        currentTab.style.display = 'none';
        if (currentTab.id == tabId){
           if (currentTab.id == 'birthday-id') currentTab.style.display = 'flex';
           else currentTab.style.display = 'block';
        }
      }
    }
  
    $('#back-id-button').on('click', function () {
      navigateTo('timeline-id', 'birthday-id-li');
    });

    $('#birthday-id-button').on('click', function () {
      navigateTo('birthday-id', 'back-id-li'); 
    });

    $('#chat-id-button').on('click', function () {
      navigateTo('chat-id', 'back-id-li'); 
    });
    
    function togglePasswordVisibility() {
      const passwordInput = document.getElementById('password');
      const showPasswordBtn = document.getElementById('show-password-button-id');
      const enteredPassword = passwordInput.value;
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        showPasswordBtn.textContent = '🙉';
      } else {
        passwordInput.type = 'password';
        showPasswordBtn.textContent = '🙈';
      }
    }

    document.addEventListener('keydown', function(event) {
      let carouselElement = document.getElementById("carousel-modal-id");
      if (carouselElement){
        switch (event.keyCode) {
          case 37:
              SlideShow(slidePosition += -1);
              break;
          case 39:
              SlideShow(slidePosition += +1);
              break;
        }
      }
    });

    $('#lang-button').on('click', function () {
        openLanguageMenu();
    });

    function openLanguageMenu(){
      closeMenu();
      const listLanguageMenu = document.getElementById("list-language-menu");
      listLanguageMenu.classList.remove("display-none");
    }
    
    function closeLanguageMenu(){
      const listLanguageMenu = document.getElementById("list-language-menu");
      listLanguageMenu.classList.add("display-none");
    }

    $('#gr-li').on('click', function () {
      closeLanguageMenu();
      if (currentLanguage == 'gr') return;
      currentLanguage = 'gr';
    });

    $('#en-li').on('click', function () {
      closeLanguageMenu();
      if (currentLanguage == 'en') return;
      currentLanguage = 'en';
    });

    $('#menu-button').on('click', function () {
        openMenu();
    });

    function openMenu(){
      closeLanguageMenu();
      const listMenu = document.getElementById("list-menu");
      listMenu.classList.remove("display-none");
    }
    
    function closeMenu(){
      const listMenu = document.getElementById("list-menu");
      listMenu.classList.add("display-none");
    }

    $('#home-li').on('click', function () {
      closeMenu();
      if (currentPage == 'home') return;
      currentPage = 'home';
    });

    $('#activities-li').on('click', function () {
      closeMenu();
      if (currentPage == 'activities') return;
      currentPage = 'activities';
    });

    $('#footer-info-dropdown').on('click', function () {
      const infoImageArrow = document.getElementById('footer-info-dropdown-img');
      const isHidden = window.getComputedStyle(infoImageArrow).display === 'none';
      if (isHidden) return;

      const footerListInfo = document.getElementById('footer-list-info');
      footerListInfo.classList.toggle("display-block");
      changeArrowDirectionIcon(infoImageArrow);
    });

    $('#footer-support-dropdown').on('click', function () {
      const supportImageArrow = document.getElementById('footer-support-dropdown-img');
      const isHidden = window.getComputedStyle(supportImageArrow).display === 'none';
      if (isHidden) return;

      const footerListSupport = document.getElementById('footer-list-support');
      footerListSupport.classList.toggle("display-block");
      changeArrowDirectionIcon(supportImageArrow);
    });

    function changeArrowDirectionIcon(arrowImg){
      if (arrowImg.src.includes('down_arrow_logo.png')) {
        arrowImg.src = 'images/up_arrow_logo.png';
      } else {
        arrowImg.src = 'images/down_arrow_logo.png';
      }
    }

    const swiper = new Swiper('.card-wrapper', {
      autoplay: {
        delay: 5000, // 5 seconds
        disableOnInteraction: false, // Continue autoplay after user swipes
      },
      loop: true,
      spaceBetween: 30,

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
          0: {
              slidesPerView: 1
          },
          768: {
              slidesPerView: 2
          },
          1024: {
              slidesPerView: 3
          }
      },
    });
    
  });

  window.addEventListener('click', function(event) {
    const listLangMenu = document.getElementById('list-language-menu');
    const langButton = document.getElementById('lang-button');
    const langButtonImg = document.getElementById('lang-button-img');
    
    if (!(listLangMenu.contains(event.target) || langButton.contains(event.target) || langButtonImg.contains(event.target)) ){
      listLangMenu.classList.add("display-none");
    }
  });

  window.addEventListener('click', function(event) {
    const listMenu = document.getElementById('list-menu');
    const menuButton = document.getElementById('lang-button');
    const menuButtonImg = document.getElementById('menu-button-img');
    if (!(listMenu.contains(event.target) || menuButton.contains(event.target) || menuButtonImg.contains(event.target)) ){
      listMenu.classList.add("display-none");
    }
  });
  
})(jQuery);
