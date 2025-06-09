document.addEventListener("DOMContentLoaded", function () {
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
    } catch (error) {
      console.log('error: ' + error);
    }
  }

  fetchSheetData(sheetId, apiKey);

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

  function openLanguageMenu() {
    closeMenu();
    document.getElementById("list-language-menu").classList.remove("display-none");
  }

  function closeLanguageMenu() {
    document.getElementById("list-language-menu").classList.add("display-none");
  }

  function openMenu() {
    closeLanguageMenu();
    document.getElementById("list-menu").classList.remove("display-none");
  }

  function closeMenu() {
    document.getElementById("list-menu").classList.add("display-none");
  }

  document.getElementById('lang-button')?.addEventListener('click', () => {
    const langMenu = document.getElementById('list-language-menu');
    if (langMenu.classList.contains('display-none')) {
      openLanguageMenu();
    } else {
      closeLanguageMenu();
    }
  });

  document.getElementById('menu-button')?.addEventListener('click', () => {
    const menu = document.getElementById('list-menu');
    if (menu.classList.contains('display-none')) {
      openMenu();
    } else {
      closeMenu();
    }
  });
  
  document.getElementById('gr-li')?.addEventListener('click', () => {
    closeLanguageMenu();
    if (currentLanguage !== 'gr') {
      currentLanguage = 'gr';
    }
  });

  document.getElementById('en-li')?.addEventListener('click', () => {
    closeLanguageMenu();
    if (currentLanguage !== 'en') {
      currentLanguage = 'en';
    }
  });

  document.getElementById('home-li')?.addEventListener('click', () => {
    closeMenu();
    window.currentPage = 'home';
  });

  document.getElementById('activities-li')?.addEventListener('click', () => {
    closeMenu();
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

  // Dropdown filter open/close and arrow toggle
  document.querySelectorAll('.filter-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.filter-button-container');
      const dropdown = parent.querySelector('.filter-dropdown-panel');
      const arrow = btn.querySelector('.down-arrow-img');

      const isOpen = !dropdown.classList.contains('display-none');

      // Close all dropdowns and reset all arrows
      document.querySelectorAll('.filter-dropdown-panel').forEach(panel => {
        panel.classList.add('display-none');
      });

      document.querySelectorAll('.down-arrow-img').forEach(img => {
        collapseArrowIcon(img); // sets it to "down" arrow
      });

      // If it wasn't open, now open it and rotate the arrow
      if (!isOpen) {
        dropdown.classList.remove('display-none');
        changeArrowDirectionIcon(arrow); // sets it to "up" arrow
      }
    });
  });

  // Filter search
  document.querySelectorAll('.filter-search-input').forEach(input => {
    input.addEventListener('input', function () {
      const filter = this.value.toLowerCase();
      const lis = this.closest('.filter-dropdown-panel').querySelectorAll('.filter-list-events li');
      lis.forEach(li => {
        const text = li.textContent.toLowerCase();
        li.style.display = text.includes(filter) ? 'block' : 'none';
      });
    });
  });

  // Filter tag selection
  const selectedFilters = new Set();
  document.querySelectorAll('.filter-tag-list a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const filter = this.dataset.filter;

      if (selectedFilters.has(filter)) {
        selectedFilters.delete(filter);
        this.classList.remove('filter-tag-selected');
      } else {
        selectedFilters.add(filter);
        this.classList.add('filter-tag-selected');
      }
    });
  });

  // Checkbox handling
  document.querySelectorAll('.filter-list-events-item input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', (event) => {
      console.log('Clicked checkbox data-id:', event.target.getAttribute('data-id'));
      console.log('Checked:', event.target.checked);
    });
  });

  // Swiper init
  const swiper = new Swiper('.card-wrapper', {
    // autoplay: {
    //   delay: 5000, // 5 seconds
    //   disableOnInteraction: false, // Continue autoplay after user swipes
    // },
    loop: true,
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    },
  });

  // Outside click handlers
  
  // Outside click handlers
  window.addEventListener('click', function (event) {
    closePopUps('list-language-menu', 'lang-button', 'lang-button-img', event);
    closePopUps('list-menu', 'menu-button', 'menu-button-img', event);
    closeAllFilterDropdowns(event);
  });

  function closePopUps(tempMenu, tempButton, tempImg, event) {
    const menu = document.getElementById(tempMenu);
    const button = document.getElementById(tempButton);
    const img = document.getElementById(tempImg);
    if (!(menu.contains(event.target) || button.contains(event.target) || img.contains(event.target))) {
      menu.classList.add("display-none");
    }
  }

  function closeAllFilterDropdowns(event) {
    let clickedInsideDropdown = false;

    document.querySelectorAll('.filter-button-container').forEach(container => {
      if (container.contains(event.target)) {
        clickedInsideDropdown = true;
      }
    });

    if (!clickedInsideDropdown) {
      document.querySelectorAll('.filter-dropdown-panel').forEach(panel => {
        panel.classList.add('display-none');
      });

      document.querySelectorAll('.down-arrow-img').forEach(img => {
        collapseArrowIcon(img); // Set arrow to down
      });
    }
  }
});
