document.addEventListener("DOMContentLoaded", async function () {
  let currentLanguage = 'gr';
  let breakIfDownForMaintenance = false;
  let testEnvironment = window.location.href.includes('Thessivity/index.html');
  let outputData = {};

  const apiKey = 'AIzaSyDuJGX7mZ45UxWwctaRSfa6LNq7qPM7_fM'; // Your API key from Google Developer Console
  //https://console.cloud.google.com/apis/credentials?inv=1&invt=AbxvKg&project=thessivity //jimskgg@gmail.com 
  const sheetId = '1LPjh1COe8CRUiLgGqf2wQA64IbOx4q2vuZcTJtwATFs'; // Google Sheet ID
  //https://drive.google.com/drive/folders/1Firv30_I1x6b5ENz3MLu31ZxpDNLcTdE

  let startDate = null;
  let endDate = null;
  let calendarPopup = null;
  let secondaryDesc = null;

  /*
  let CONSUMER_KEY = '';
  let CONSUMER_SECRET = '';
  let CALLBACK_URL = 'https://login.salesforce.com/services/oauth2/success';
  let FETCH_TOKEN = 'https://login.salesforce.com/services/oauth2/token';
  */

  async function fetchSheetData(sheetId, apiKey) {
    try {
      const gids = {
        First: '413577439'
      };

      fetch('https://thessivity.onrender.com/getData')
      .then(res => res.json())
      .then(data => {
        const list = document.getElementById('accounts');
        console.log('dimitris: ' +data.records);
      })
      .catch(err => console.error(err));

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

      /*
      fetch(FETCH_TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Control-Allow-Origin': '*'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: CONSUMER_KEY,
          client_secret: CONSUMER_SECRET,
          redirect_uri: CALLBACK_URL
        })
      })
      .then(res => res.json())
      .then(auth => console.log(auth));
      */

      
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

  document.getElementById('sort-by-selection')?.addEventListener('click', () => {
    const menu = document.getElementById('sort-by-menu');
    const arrow = document.getElementById('sort-by-dropdown-img');
    openCloseDynamicMenu(menu);
    changeArrowDirectionIcon(arrow);
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

  document.getElementById('sort-default-li')?.addEventListener('click', () => {
    const menu = document.getElementById('sort-by-menu');
    const arrow = document.getElementById('sort-by-dropdown-img');
    openCloseDynamicMenu(menu);
    changeArrowDirectionIcon(arrow);
    let sortBy = 'default';
  });

  document.getElementById('sort-date-li')?.addEventListener('click', () => {
    const menu = document.getElementById('sort-by-menu');
    const arrow = document.getElementById('sort-by-dropdown-img');
    openCloseDynamicMenu(menu);
    changeArrowDirectionIcon(arrow);
    let sortBy = 'date';
  });

  document.getElementById('sort-populatity-li')?.addEventListener('click', () => {
    const menu = document.getElementById('sort-by-menu');
    const arrow = document.getElementById('sort-by-dropdown-img');
    openCloseDynamicMenu(menu);
    changeArrowDirectionIcon(arrow);
    let sortBy = 'popularity';
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

  document.querySelectorAll('.card-link').forEach(function(card) {
    card.addEventListener('mousedown', function(event) {
      if (event.button === 1) {
        const activityId = this.dataset.id;
        redirectToActivity(activityId, event);
      }
    });

    card.addEventListener('click', function(event) {
      if (event.button === 0) {
        event.preventDefault();
        const activityId = this.dataset.id;
        redirectToActivity(activityId, event);
      }
    });
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
        collapseArrowIcon(img); // sets to down arrow
      });

      if (!isOpen) {
        dropdown.classList.remove('display-none');
        changeArrowDirectionIcon(arrow); // sets to up arrow
        initCustomCheckboxListener(parent);
      }
    });
  });

  // Filter search
  document.querySelectorAll('.filter-search-input').forEach(input => {
    input.addEventListener('input', function () {
      const filter = this.value.toLowerCase();
      const lis = this.closest('.filter-dropdown-panel').querySelectorAll('.filter-list-activities li');
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
  document.querySelectorAll('.filter-list-activities-item input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', (event) => {
      console.log('Clicked checkbox data-id:', event.target.getAttribute('data-id'));
      console.log('Checked:', event.target.checked);
    });
  });

  // Swiper init
  const swiper = new Swiper('.card-wrapper', {
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
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

  // Unified outside click handler for menus, language menu, and filter dropdowns including calendars
  window.addEventListener('click', function (event) {
    // Close language menu
    closePopUps('list-language-menu', 'lang-button', 'lang-button-img', event);

    // Close main menu
    closePopUps('list-menu', 'menu-button', 'menu-button-img', event);

    // Close sort by menu
    closePopUps('sort-by-menu', 'sort-by-selection', 'sort-by-dropdown-img', event);

    // Close filter dropdowns and calendars
    closeAllFilterDropdownsAndCalendars(event);
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

  function closeAllFilterDropdownsAndCalendars(event) {
    let clickedInsideDropdownOrCalendar = false;

    document.querySelectorAll('.filter-button-container').forEach(container => {
      if (container.contains(event.target)) {
        clickedInsideDropdownOrCalendar = true;
      }
    });

    if (!clickedInsideDropdownOrCalendar) {
      // Hide all dropdown panels
      document.querySelectorAll('.filter-dropdown-panel').forEach(panel => {
        panel.classList.add('display-none');
      });

      // Hide all calendar popups
      document.querySelectorAll('.calendar-popup').forEach(popup => {
        popup.classList.add('display-none');
      });

      // Collapse all filter arrows
      document.querySelectorAll('.filter-button').forEach(filterButton => {
        filterButton.querySelectorAll('.down-arrow-img').forEach(img => {
          collapseArrowIcon(img);
        });
      })
    }
  }

  /* CALENDAR START */
  function initCustomCheckboxListener(container) {
    const customCheckbox = container.querySelector('.custom-checkbox');
    if (customCheckbox && !customCheckbox.hasListener) {
      customCheckbox.addEventListener('change', () => {
        calendarPopup = container.querySelector('.calendar-popup');
        secondaryDesc = container.querySelector('.filter-button-secondary-description');

        if (customCheckbox.checked) {
          renderCalendarForContainer(container);
        } else {
          hideCalendarForContainer(container);
        }
      });
      customCheckbox.hasListener = true;
    }
  }

  function createCalendar(month, year) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const daysInWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarMonth = document.createElement('div');
    calendarMonth.classList.add('calendar-month');

    const header = document.createElement('h4');
    header.textContent = `${monthNames[month]} ${year}`;
    calendarMonth.appendChild(header);

    const grid = document.createElement('div');
    grid.classList.add('calendar-grid');

    // Append days of the week header inside grid
    daysInWeek.forEach(day => {
      const dayEl = document.createElement('div');
      dayEl.textContent = day;
      dayEl.style.fontWeight = 'bold';
      dayEl.style.textAlign = 'center';
      grid.appendChild(dayEl);
    });

    // Add blank cells for first day offset
    for (let i = 0; i < firstDay; i++) {
      const blankCell = document.createElement('div');
      blankCell.classList.add('calendar-day', 'blank');
      grid.appendChild(blankCell);
    }

    // Days cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEl = document.createElement('div');
      dayEl.classList.add('calendar-day');
      dayEl.textContent = day;

      const thisDate = new Date(year, month, day);
      dayEl.dataset.date = thisDate.toISOString();

      // Disable days before today if in current month & year
      const today = new Date();
      const isPastDayInCurrentMonth = (year === today.getFullYear() && month === today.getMonth() && day < today.getDate());

      if (isPastDayInCurrentMonth) {
        dayEl.classList.add('disabled-day');
      } else {
        dayEl.addEventListener('click', () => {
          handleDateClick(dayEl);
        });
      }

      grid.appendChild(dayEl);
    }

    calendarMonth.appendChild(grid);

    return calendarMonth;
  }

  function renderCalendarForContainer(container) {
    const calendarPopup = container.querySelector('.calendar-popup');
    const dropdownPanel = container.querySelector('.filter-dropdown-panel');
    calendarPopup.innerHTML = '';

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    calendarPopup.appendChild(createCalendar(currentMonth, currentYear));

    let nextMonth = currentMonth + 1;
    let nextYear = currentYear;
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear++;
    }
    calendarPopup.appendChild(createCalendar(nextMonth, nextYear));

    calendarPopup.classList.remove('display-none');
  }

  function hideCalendarForContainer(container) {
    calendarPopup = container.querySelector('.calendar-popup');
    secondaryDesc = container.querySelector('.filter-button-secondary-description');
    const customCheckbox = container.querySelector('.custom-checkbox');

    if (calendarPopup) {
      calendarPopup.classList.add('display-none');
      calendarPopup.innerHTML = '';
    }

    if (customCheckbox) {
      customCheckbox.checked = false;
    }

    startDate = null;
    endDate = null;

    if (secondaryDesc) {
      secondaryDesc.textContent = 'Custom';
    }
  }

  function handleDateClick(dayEl) {
    const clickedDate = new Date(dayEl.dataset.date);

    if (!startDate || (startDate && endDate)) {
      // Reset selection if both dates are set or startDate missing
      startDate = clickedDate;
      endDate = null;
      clearDateSelection();
      dayEl.classList.add('selected-start');
    } else if (clickedDate < startDate) {
      // If clicked before startDate, make it new startDate
      clearDateSelection();
      startDate = clickedDate;
      dayEl.classList.add('selected-start');
    } else {
      // Set endDate
      endDate = clickedDate;
      highlightRange(startDate, endDate);
    }

    updateSecondaryDesc();
  }

  function clearDateSelection() {
    document.querySelectorAll('.calendar-day').forEach(dayEl => {
      dayEl.classList.remove('selected-start', 'selected-end', 'in-range');
    });
  }

  function highlightRange(start, end) {
    clearDateSelection();

    document.querySelectorAll('.calendar-day').forEach(dayEl => {
      const dayDate = new Date(dayEl.dataset.date);
      if (dayDate.getTime() === start.getTime()) {
        dayEl.classList.add('selected-start');
      } else if (dayDate.getTime() === end.getTime()) {
        dayEl.classList.add('selected-end');
      } else if (dayDate > start && dayDate < end) {
        dayEl.classList.add('in-range');
      }
    });
  }

  function updateSecondaryDesc() {
    if (!secondaryDesc) return;

    if (startDate && endDate) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      secondaryDesc.textContent = `${startDate.toLocaleDateString(undefined, options)} - ${endDate.toLocaleDateString(undefined, options)}`;
    } else if (startDate) {
      secondaryDesc.textContent = `${startDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}`;
    } else {
      secondaryDesc.textContent = 'Custom';
    }
  }
  /* CALENDAR END */

});