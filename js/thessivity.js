document.addEventListener("DOMContentLoaded", async function () {
  let startDate = null;
  let endDate = null;
  let calendarPopup = null;
  let secondaryDesc = null;
  let fallbackImage;

  let currentSortBy = 'default'; // default sort

  const activeFilters = {
    category: new Set(),   // multi
    where: new Set(),      // multi
    when: null             // { type: 'preset', value } OR { type: 'range', start, end }
  };

  // Tracks which filter tags are currently selected
  const selectedFilters = new Set();

  const mockEvents = {
    settings: {
      offlineSite: true,
      fallbackImage: 'https://raw.githubusercontent.com/jimskg/Thessivity/refs/heads/master/images/thessivity_logo.jpg',
      descriptionMain: "Activities with Perspective",
      descriptionSecondary: "Whether you dream of distant destinations or hidden gems, we’re here to make your journey unforgettable. Get ready for your next adventure!"
    },
    events: [
      {
        "Id": "a0123456789ABCDE",
        "Name": "Cooking Workshop1",
        "Dates__c": "05-01-2026",
        "Description__c": "Learn traditional recipes with a hands-on experience.",
        "Location_Name__c": "Μέγαρο Μουσικής",
        "Longitude__c": 22.92457222938538,
        "Latitude__c": 40.5827113791267,
        "Category__c": 'Hiking',
        "Number_Of_People__c": "15-30",
        "Price__c": 20,
        "Image__c": 'https://raw.githubusercontent.com/jimskg/Thessivity/refs/heads/master/images/cooking.jpg',
        "Duration__c": 120,
        "Website__c": "https://www.google.gr",
        "Organizer__r": {
          "Name": "Helexpo",
          "BillingStreet": "Μεγάλου Αλεξάνδρου 40",
          "VIP__c": true,
          "Phone": "2310111111",
          "Email__c": "test@test.test"
        }
      },
      {
        "Id": "a0123456789ABCDF",
        "Name": "Painting Class2",
        "Dates__c": "05-01-2026; 08-01-2026; 09-01-2026; 10-01-2026",
        "Description__c": "Express your creativity in a painting workshop.",
        "Location_Name__c": "Τεχνόπολις",
        "Longitude__c": 22.9456,
        "Latitude__c": 40.6372,
        "Category__c": 'Hiking',
        "Number_Of_People__c": "10-20",
        "Price__c": 15,
        "Image__c": 'https://raw.githubusercontent.com/jimskg/Thessivity/refs/heads/master/images/cooking.jpg',
        "Duration__c": 90,
        "Website__c": "https://www.google.gr",
        "Organizer__r": {
          "Name": "ArtCenter",
          "BillingStreet": "Λεωφ. Στρατού 12",
          "VIP__c": false,
          "Phone": "2310222222",
          "Email__c": "info@artcenter.gr"
        }
      },
      {
        "Id": "a0123456789ABCDG",
        "Name": "Hiking Tour3",
        "Dates__c": "05-01-2026:08-01-2026",
        "Description__c": "Enjoy a scenic hike in the mountains.",
        "Location_Name__c": "Mount Olympus",
        "Longitude__c": 22.5400,
        "Latitude__c": 40.0833,
        "Category__c": 'Hiking',
        "Number_Of_People__c": "5-15",
        "Price__c": null,
        "Image__c": 'https://raw.githubusercontent.com/jimskg/Thessivity/refs/heads/master/images/cooking.jpg',
        "Duration__c": 180,
        "Website__c": "https://www.google.gr",
        "Organizer__r": {
          "Name": "Outdoor Adventures",
          "BillingStreet": "Olympus Basecamp",
          "VIP__c": true,
          "Phone": "2310333333",
          "Email__c": "hello@outdoors.gr"
        }
      },
      {
        "Id": "a0123456789ABCD2",
        "Name": "Hiking Tour4",
        "Dates__c": "05-01-2026:08-01-2026; 09-01-2026:10-01-2026",
        "Description__c": "Enjoy a scenic hike in the mountains.",
        "Location_Name__c": "Mount Olympus",
        "Longitude__c": 22.5400,
        "Latitude__c": 40.0833,
        "Category__c": 'Hiking',
        "Number_Of_People__c": "5-15",
        "Price__c": null,
        "Image__c": 'https://raw.githubusercontent.com/jimskg/Thessivity/refs/heads/master/images/cooking.jpg',
        "Duration__c": 180,
        "Website__c": "https://www.google.gr",
        "Organizer__r": {
          "Name": "Outdoor Adventures",
          "BillingStreet": "Olympus Basecamp",
          "Phone": "2310333333",
          "VIP__c": false,
          "Email__c": "hello@outdoors.gr"
        }
      }
    ]
  };

  let realEvents = {};

  const filterTags = [
    {id: 'filter-tag-id-for-kids', filter: 'kids', value: 'kids', field: "Audience__c", text: 'For Kids', i18n: 'filterTagKids' },
    {id: 'filter-tag-id-festivals', filter: 'festivals', value: 'festival', field: "Type__c", text: 'Festivals', i18n: 'filterTagFestivals'},
    {id: 'filter-tag-id-workshops', filter: 'workshops', value: 'workshop', field: "Type__c", text: 'Workshops', i18n: 'filterTagWorkshops'},
    {id: 'filter-tag-id-seminars', filter: 'seminars', value: 'seminar', field: "Type__c", text: 'Seminars', i18n: 'filterTagSeminars'}
  ];

  const SKIP_TILES = ['filterCategoryAll', 'filterWhereEverywhere', 'filterWhenAnytime'];

  const dropdowns = [
    {
      main: { text: 'Category', i18n: 'filterCategoryTitle' },
      secondary: { text: 'All', i18n: 'filterCategoryAll' },
      options: [
        { text: 'All', value: 'All', i18n: 'filterCategoryAll', id: 'all' },
        { text: 'Photography', value: 'Photography', i18n: 'categoryPhotography'},
        { text: 'Hiking', value: 'Hiking', i18n: 'categoryHiking'},
        { text: 'Dance', value: 'Dance', i18n: 'categoryDance'},
        { text: 'Robotics', value: 'Robotics', i18n: 'categoryRobotics'},
        { text: 'Music', value: 'Music', i18n: 'categoryMusic'},
        { text: 'Travel', value: 'Travel', i18n: 'categoryTravel'},
        { text: 'Volunteering', value: 'Volunteering', i18n: 'categoryVolunteering'},
        { text: 'Wellness & Fitness', value: 'Wellness & Fitness', i18n: 'categoryWellnessFitness'},
        { text: 'Personal Development', value: 'Personal Development', i18n: 'categoryPersonalDevelopment'},
        { text: 'Crafts', value: 'Crafts', i18n: 'categoryCrafts'},
        { text: 'Sports', value: 'Sports', i18n: 'categorySports'},
        { text: 'Cooking', value: 'Cooking', i18n: 'categoryCooking'},
        { text: 'Rest', value: 'Rest', i18n: 'categoryRest'},
        { text: 'Painting', value: 'Painting', i18n: 'categoryPainting'}
      ]
    },
    {
      main: { text: 'Where', i18n: 'filterWhereTitle' },
      secondary: { text: 'Everywhere', i18n: 'filterWhereEverywhere' },
      options: [
        { text: 'All', i18n: 'filterWhereEverywhere', id: 'all' }
        // { text: 'Option A', i18n: 'filterWhereOptionA' },
        // { text: 'Option B', i18n: 'filterWhereOptionB' },
        // { text: 'Option C', i18n: 'filterWhereOptionC' },
        // { text: 'Option D', i18n: 'filterWhereOptionD' },
        // { text: 'Option E', i18n: 'filterWhereOptionE' },
        // { text: 'Option F', i18n: 'filterWhereOptionF' },
        // { text: 'Option G', i18n: 'filterWhereOptionG' },
        // { text: 'Option H', i18n: 'filterWhereOptionH' }
      ]
    },
    {
      main: { text: 'When', i18n: 'filterWhenTitle' },
      secondary: { text: 'Anytime', i18n: 'filterWhenAnytime' },
      options: [
        { text: 'Anytime', i18n: 'filterWhenAnytime', id: 'all' },
        { text: 'Today', i18n: 'filterWhenToday' },
        { text: 'Tomorrow', i18n: 'filterWhenTomorrow' },
        { text: 'This weekend', i18n: 'filterWhenWeekend' },
        { text: 'Next week', i18n: 'filterWhenNextWeek' },
        { text: 'Custom', i18n: 'filterWhenCustom', custom: true }
      ]
    }
  ];


  async function fetchSalesforceData() {
    const response = await fetch(`https://thessivity.onrender.com/getData?lang=${currentLanguage}`);

    if (!response.ok) {
      const errorData = await response.json(); // backend error message
      return json({
        success: false,
        error: errorData.message || 'Internal server error'
      });
    }
    
    const data = await response.json();
    return data;
  }

  async function fetchGoogleSheetsData() {
    const gids = { // probably i need to make this calls once, passing all the sheetNames, and in render do multiple callout build the json and return it
      First: '413577439'
    };

    for (let sheetName in gids) {
      const response = await fetch(
        `https://thessivity.onrender.com/getGoogleSheetData?gid=${sheetName}`
      );
      const data = await response.json();
      const rows = data.values.slice(1);

      if (sheetName === "First") {
        rows.forEach(row => {
          const [value] = row;
          console.log('dimitris2:', value);

          if (testEnvironment) {
            console.log('here');
          }
        });
      }
    }
    
    return 'here';
  }

  async function fetchData() {
    try {
      openLoadingSpinner();
      closeHomeBody();

      /*await Promise.all([
        fetchSalesforceData(),
        fetchGoogleSheetsData()
      ]);*/
      
      let data = databaseSource === 'SF' ? await fetchSalesforceData() : await fetchGoogleSheetsData();
      // translateStaticTexts(mockEvents.settings);
      // renderEvents(mockEvents.events);
      //fallbackImage = mockEvents.settings.fallbackImage;
      if (data.error == undefined){
        fallbackImage = data.settings.fallbackImage;
        realEvents = data;
        translateStaticTexts(data.settings);
        setWhereOptions(data.events);
        renderEvents(data.events, true);
        renderFilters();
        ensureTilesContainer();
        translatePage(currentLanguage);
      } else {
        buildErrorScreen(data.error);
      }
      
      initEventListeners();
      
      setTimeout(() => {
        closeLoadingSpinner();
        openHomeBody();
      }, 1000);

    } catch (error) {
      console.log('error: ' + error);
      closeLoadingSpinner();
    }
  }

  await fetchData();

  function el(tag, className, text, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    if (html !== undefined && html !== null) node.innerHTML = html;
    return node;
  }

  function setWhereOptions(events) {
    const whereDropdown = dropdowns.find(
      d => d.main.i18n === 'filterWhereTitle'
    );

    const staticOption = whereDropdown.options[0]; // Everywhere

    const dynamicOptions = buildWhereOptions(events);

    whereDropdown.options = [
      staticOption,
      ...dynamicOptions
    ];
  }

  function buildWhereOptions(events) {
    // Get unique location names
    const uniqueLocations = [...new Set(
      events
        .map(e => e.Location_Name__c)
        .filter(Boolean)
    )];

    // Convert to dropdown options
    return uniqueLocations.map(location => ({
      text: location,
      //i18n: normalizeI18n(location)
      i18n: location
    }));
  }

  function buildErrorScreen(errorMessage){
    const homeBody = document.getElementById('home-body');
    homeBody.innerHTML = '';

    const errorContainer = el('div', 'error-container');
    const errorH2 = el('h2', 'description-main');
    errorH2.innerHTML = errorMessage;
    homeBody.appendChild(errorContainer);
    errorContainer.appendChild(errorH2);

    /*
    const errorContainer = el('div', 'description-container');
    const divErrorMain = el('div', null);
    const errorMain = el('h2', 'description-main');
    errorMain.innerHTML = 'Ωχ! Κάτι πήγε στραβά.';
    const divErrorSecondary = el('div', null);
    const errorSecondary = el('h2', 'description-secondary');
    errorSecondary.innerHTML = 'Η σελίδα που ψάχνεις δε βρέθηκε.';
    homeBody.appendChild(errorContainer);
    errorContainer.appendChild(divErrorMain);
    errorContainer.appendChild(divErrorSecondary);
    divErrorMain.appendChild(errorMain);
    divErrorSecondary.appendChild(errorSecondary);
    */
  }

  function translateStaticTexts(settings){
    document.querySelectorAll('[data-istatic]').forEach(el => {
      const key = el.dataset.istatic;
      el.textContent = settings[key];
    });
  }

  function buildCarouselCard(event) {
    const li = document.createElement('li');
    li.className = 'card-item swiper-slide';

    const a = document.createElement('a');
    a.className = 'card-link';
    a.dataset.id = event.Id;

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'card-image-wrapper';
    const img = document.createElement('img');
    getValidImage(event.Image__c, fallbackImage).then(finalUrl => {
      img.src = finalUrl;
    });
    img.alt = event.Name;
    img.className = 'card-image';
    imageWrapper.appendChild(img);

    const body = document.createElement('div');
    body.className = 'card-link-body';

    const schedule = document.createElement('div');
    schedule.className = 'card-title-info-schedule';
    schedule.dataset.i18n = formatEventDate(event.Dates__c);

    const title = document.createElement('div');
    title.className = 'card-title-info';
    title.textContent = event.Name;

    const location = document.createElement('div');
    location.className = 'card-title-info-location';
    location.textContent = event.Location_Name__c;

    body.append(schedule, title, location);
    a.append(imageWrapper, body);
    li.appendChild(a);

    return li;
  }

  function buildBodyCard(event) {
    const li = document.createElement('li');
    li.className = 'card-item';

    const a = document.createElement('a');
    a.className = 'card-link';
    a.dataset.id = event.Id;

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'card-image-wrapper';
    const img = document.createElement('img');
    getValidImage(event.Image__c, fallbackImage).then(finalUrl => {
      img.src = finalUrl;
    });
    img.alt = event.Name;
    img.className = 'card-image';
    imageWrapper.appendChild(img);

    const body = document.createElement('div');
    body.className = 'card-link-body';

    const schedule = document.createElement('div');
    schedule.className = 'card-title-info-schedule';
    schedule.dataset.i18n = formatEventDate(event.Dates__c);

    const title = document.createElement('div');
    title.className = 'card-title-info';
    title.textContent = event.Name;

    const location = document.createElement('div');
    location.className = 'card-title-info-location';
    location.textContent = event.Location_Name__c;

    // Optional: show price only if exists
    // if (event.Price__c) {
    //   const price = document.createElement('div');
    //   price.className = 'card-title-info-price';
    //   price.textContent = `${event.Price__c} €`;
    //   body.appendChild(price);
    // }

    body.append(schedule, title, location);
    a.append(imageWrapper, body);
    li.appendChild(a);

    return li;
  }

  // Format date
  function formatEventDate(dateStr) {
    if (!dateStr) return '';

    // Split by semicolon first
    const parts = dateStr.split(';').map(p => p.trim()).filter(Boolean);

    // Determine the type
    let displayText = '';

    // Check if all parts are single dates or ranges
    const isAllSingleDates = parts.every(p => !p.includes(':'));
    const isAllRanges = parts.every(p => p.includes(':'));

    try {
      if (parts.length === 1) {
        // Single date or single range
        if (parts[0].includes(':')) {
          // Single range
          const [start, end] = parts[0].split(':').map(parseDate);
          displayText = `${formatDate(start)} - ${formatDate(end)}`;
        } else {
          // Single date
          const date = parseDate(parts[0]);
          displayText = formatDate(date);
        }
      } else {
        // Multiple items
        if (isAllSingleDates) {
          displayText = 'multipleDates';
        } else if (isAllRanges) {
          displayText = 'multipleRanges';
        } else {
          // Mixed (dates and ranges) → treat as multiple ranges for simplicity
          displayText = 'multipleRanges';
        }
      }
    } catch (error){
      displayText = '';
    }
    
    if (displayText == 'Invalid Date') displayText = '';
    return displayText;
  }

  // Render all events
  function renderEvents(events, vip = false) {
    const carouselList = document.querySelector('#card-list-swiper-wrapper');
    const bodyList = document.querySelector('#body-card-list');

    bodyList.innerHTML = '';

    events.forEach(event => {
      bodyList.appendChild(buildBodyCard(event));
    });

    if (vip){
      carouselList.innerHTML = '';
      // Filter VIP events for the carousel
      let vipEvents = events.filter(e => e.Organizer__r.VIP__c);
      let nonVipEvents = events.filter(e => !e.Organizer__r.VIP__c);

      // Ensure at least 4 events in the carousel
      let carouselEvents = [...vipEvents];

      if (carouselEvents.length < 4) {
        // Take as many non-VIP events as needed to reach 4
        const needed = 4 - carouselEvents.length;
        carouselEvents = carouselEvents.concat(nonVipEvents.slice(0, needed));
      }

      // Render carousel events
      carouselEvents.forEach(event => {
        carouselList.appendChild(buildCarouselCard(event));
      });
    }
    
  }

  function renderFilters(){
      const filterRow = document.querySelector('#filter-row');
      filterRow.innerHTML = '';
      filterRow.appendChild(buildFilterRowContainer());
  }

  function buildFilterRowContainer() {
    const container = el('div', 'filter-row-container');
    const card = el('div', 'filter-row-card');

    const top = el('div', 'filter-container-top');
    const desc = el('div', 'filter-description', 'Activities in Thessaloniki');
    desc.dataset.i18n = 'filterDescriptionActivities';

    top.append(desc, buildFilterTagList());

    const bottom = el('div', 'filter-container-bottom');
    dropdowns.forEach(cfg => bottom.appendChild(buildFilterButton(cfg)));

    card.append(top, bottom);
    container.appendChild(card);

    return container;
  }

  function buildFilterTagList() {
    const ul = el('ul', 'filter-tag-list');

    filterTags.forEach(tag => {
      const li = el('li');
      const a = el('a', null, tag.text);

      a.href = '#';
      a.id = tag.id;
      a.dataset.filter = tag.filter;
      a.dataset.i18n = tag.i18n;

      li.appendChild(a);
      ul.appendChild(li);
    });

    return ul;
  }

  function buildFilterButton(config) {
    const container = el('div', 'filter-button-container');
    const button = el('a', 'filter-button');
    const body = el('div', 'filter-button-body');

    const textWrap = document.createElement('div');

    const main = el('div', 'filter-button-main-description', config.main.text);
    main.dataset.i18n = config.main.i18n;

    const secondary = el('div', 'filter-button-secondary-description', config.secondary.text);
    secondary.dataset.i18n = config.secondary.i18n;

    textWrap.append(main, secondary);

    const imgWrap = el('div', 'filter-button-img-conainer');
    const img = document.createElement('img');
    img.src = 'images/down_arrow_logo.png';
    img.className = 'down-arrow-img';
    img.id = 'filter-button-img';

    imgWrap.appendChild(img);
    body.append(textWrap, imgWrap);
    button.appendChild(body);

    container.append(button, buildDropdownPanel(config.options, config.main.text));

    if (config.main.text === 'When') {
      container.appendChild(el('div', 'calendar-popup display-none'));
    }

    return container;
  }
  
  function buildDropdownPanel(options, mainText) {
  const panel = el('div', 'filter-dropdown-panel display-none');
  const isWhen = mainText === 'When';

  // Search bar for Category / Where
  if (!isWhen) {
    const searchBar = el('div', 'filter-search-bar');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'filter-search-input';
    input.placeholder = 'Search';
    input.dataset.i18n = 'filterSearchPlaceholder';
    searchBar.appendChild(input);
    panel.appendChild(searchBar);
  }

  const ul = el(
    'ul',
    isWhen
      ? 'filter-list-activities filter-list-activities-top-when'
      : 'filter-list-activities filter-list-activities-top'
  );

  options.forEach(opt => {
    const li = el('li');
    const label = el('label', 'filter-list-activities-item');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.value = opt.i18n;
    if (opt.id) checkbox.dataset.id = opt.id;
    if (opt.custom) checkbox.classList.add('custom-checkbox');

    const checkmark = el('span', 'filter-list-activities-item-checkmark');
    const text = el('span', 'filter-list-activities-item-text', opt.text);
    text.dataset.i18n = opt.i18n;

    label.append(checkbox, checkmark, text);
    li.appendChild(label);
    ul.appendChild(li);
  });

  panel.appendChild(ul);
  const checkboxes = ul.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const isAll = cb.dataset.id === 'all';
      const filterType = mainText === 'Category' ? 'category' : mainText === 'Where' ? 'where' : 'when';

      // ------------------------
      // WHEN (Single Select)
      // ------------------------
      if (isWhen) {
        // Deselecting an option
        if (!cb.checked) {
          if (activeFilters.when?.value === cb.dataset.value) {
            activeFilters.when = null;
            updateWhenButton('filterWhenAnytime');
            renderTiles();
            filterEvents();
            closeAllFilterDropdownsAndCalendars(new Event('click'));
          }
          return;
        }

        // Selecting an option
        checkboxes.forEach(o => { if (o !== cb) o.checked = false; });

        if (isAll) {
          activeFilters.when = null;
          updateWhenButton('filterWhenAnytime');
          renderTiles();
          filterEvents();
          closeAllFilterDropdownsAndCalendars(new Event('click'));
          return;
        }

        activeFilters.when = { type: 'preset', value: cb.dataset.value };
        updateWhenButton(cb.dataset.value);
        renderTiles();
        filterEvents();
        closeAllFilterDropdownsAndCalendars(new Event('click'));
        return;
      }

      // ------------------------
      // CATEGORY / WHERE (Multi Select)
      // ------------------------
      if (isAll && cb.checked) {
        checkboxes.forEach(o => { if (o !== cb) o.checked = false; });
        activeFilters[filterType].clear();
        renderTiles(); // Remove tiles for this dropdown
        filterEvents();
        return;
      }

      // Normal option: deselect "All"
      const allCb = ul.querySelector('input[data-id="all"]');
      if (allCb) allCb.checked = false;
      // Remove the 'all' value from activeFilters if it exists
      SKIP_TILES.forEach(skipKey => activeFilters[filterType].delete(skipKey));

      if (cb.checked) activeFilters[filterType].add(cb.dataset.value);
      else activeFilters[filterType].delete(cb.dataset.value);

      renderTiles();
      filterEvents();
    });
  });

  return panel;
}
  
  document.getElementById('gr-li')?.addEventListener('click', () => {
      fetchData();
  });

  document.getElementById('en-li')?.addEventListener('click', () => {
      fetchData();
  });

  document.getElementById('sort-by-selection')?.addEventListener('click', () => {
    const menu = document.getElementById('sort-by-menu');
    const arrow = document.getElementById('sort-by-dropdown-img');
    openCloseDynamicMenu(menu);
    changeArrowDirectionIcon(arrow);
  });

  document.getElementById('sort-default-li')?.addEventListener('click', () => {
    const menu = document.getElementById('sort-by-menu');
    const arrow = document.getElementById('sort-by-dropdown-img');
    openCloseDynamicMenu(menu);
    changeArrowDirectionIcon(arrow);
    currentSortBy = 'default';
    document.getElementById('sort-by-selection-title').dataset.i18n = 'sortedByDefault';

    filterEvents(); // re-render events in default order
  });

  document.getElementById('sort-date-li')?.addEventListener('click', () => {
    const menu = document.getElementById('sort-by-menu');
    const arrow = document.getElementById('sort-by-dropdown-img');
    openCloseDynamicMenu(menu);
    changeArrowDirectionIcon(arrow);
    currentSortBy = 'date';
    document.getElementById('sort-by-selection-title').dataset.i18n = 'sortedByDate';

    filterEvents(); // re-render events sorted by date
  });

  function initCardLinkListeners(){
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
  }

  function initEventListeners(){
    initCardLinkListeners();

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
        //const filter = this.value.toLowerCase();
        const filter = normalizeTonesLowerCase(this.value);
        const lis = this.closest('.filter-dropdown-panel').querySelectorAll('.filter-list-activities li');
        lis.forEach(li => {
          //const text = li.textContent.toLowerCase();
          const text = normalizeTonesLowerCase(li.textContent);
          li.style.display = text.includes(filter) ? 'block' : 'none';
        });
      });
    });

    // Filter tag selection
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
        
        filterEvents();       // apply filters including selected tags
      });
    });

    document.querySelectorAll('.filter-list-activities-item input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', e => {
        const container = cb.closest('.filter-button-container');
        const mainKey = container.querySelector('.filter-button-main-description').dataset.i18n;

        if (mainKey === 'filterWhenTitle') return;

        const type = mainKey === 'filterCategoryTitle' ? 'category' : 'where';
        //const value = cb.nextSibling.nextSibling.textContent;
        const valueKey = cb.dataset.value;

        cb.checked
          ? activeFilters[type].add(valueKey) ///////////////
          : activeFilters[type].delete(valueKey);

        updateButtonSecondary(type);
        renderTiles();
        filterEvents();
      });
    });

  }
  

  // Unified outside click handler for menus, language menu, and filter dropdowns including calendars
  window.addEventListener('click', function (event) {

    // Close sort by menu
    closePopUps('sort-by-menu', 'sort-by-selection', 'sort-by-dropdown-img', event);

    // Close filter dropdowns and calendars
    closeAllFilterDropdownsAndCalendars(event);
  });

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
    let monthNames = [];
    let daysInWeek = [];

    if (currentLanguage === 'en') {
      monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      daysInWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    } else if (currentLanguage === 'gr') {
      monthNames = ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μάι', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ'];
      daysInWeek = ['Κ', 'Δ', 'Τ', 'Τ', 'Π', 'Π', 'Σ'];
    }

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

    if (!startDate || endDate) {
      startDate = clickedDate;
      endDate = null;
      clearDateSelection();
      dayEl.classList.add('selected-start');
    } else {
      endDate = clickedDate;
      highlightRange(startDate, endDate);

      activeFilters.when = {
        type: 'range',
        start: startDate,
        end: endDate
      };

      updateWhenButton(
        `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
      );

      closeAllFilterDropdownsAndCalendars(new Event('click'));
      renderTiles();
      filterEvents();
    }
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

  /* CALENDAR END */

  /* FILTERS START */

  function ensureTilesContainer() {
    if (document.querySelector('.filter-tiles')) return;

    const tiles = document.createElement('div');
    tiles.className = 'filter-tiles';
    document.querySelector('.filter-row-card').appendChild(tiles);
  }

  function renderTiles() {
    const container = document.querySelector('.filter-tiles');
    if (!container) return;

    container.innerHTML = '';

    // Category & Where
    ['category', 'where'].forEach(type => {
      activeFilters[type].forEach(valueKey => {
        if (!SKIP_TILES.includes(valueKey)) {
          let label = LABELS[currentLanguage][valueKey] ? LABELS[currentLanguage][valueKey] : valueKey;
          container.appendChild(
            createTile(type, valueKey, label)
          );
        }
      });
    });

    // When
    if (activeFilters.when) {
      let label;

      if (activeFilters.when.type === 'preset') {
        if (!SKIP_TILES.includes(activeFilters.when.value)) { // <-- skip Anytime
          label = LABELS[currentLanguage][activeFilters.when.value];
          container.appendChild(createTile('when', 'when', label));
        }
      } else {
        label =
          `${activeFilters.when.start.toLocaleDateString()} - ` +
          `${activeFilters.when.end.toLocaleDateString()}`;
        container.appendChild(createTile('when', 'when', label));
      }
    }
  }


  function createTile(type, valueKey, label) {
    const tile = document.createElement('div');
    tile.className = 'filter-tile';
    tile.textContent = label;

    const close = document.createElement('span');
    close.className = 'filter-tile-close';
    close.textContent = '×';

    close.addEventListener('click', () => {
      removeFilter(type, valueKey);
    });

    tile.appendChild(close);
    return tile;
  }

  function removeFilter(type, valueKeyOrLabel) {
    // WHEN (single-select)
    if (type === 'when') {

      document.querySelectorAll('.filter-list-activities-item input[type="checkbox"]')
        .forEach(cb => {
          if (cb.dataset.value === activeFilters.when.value) {
            cb.checked = false;
          }
        });

      activeFilters.when = null;
      resetWhenUI();
    }

    // CATEGORY / WHERE (multi-select)
    else {
      activeFilters[type].delete(valueKeyOrLabel);

      // Uncheck checkbox
      document.querySelectorAll('.filter-list-activities-item input[type="checkbox"]')
        .forEach(cb => {
          if (cb.dataset.value === valueKeyOrLabel) {
            cb.checked = false;
          }
        });

      updateButtonSecondary(type);
    }

    renderTiles();
    filterEvents();
  }


  function updateButtonSecondary(type) {
    const container = [...document.querySelectorAll('.filter-button-container')]
      .find(c => c.querySelector('.filter-button-main-description').dataset.i18n
        === (type === 'category' ? 'filterCategoryTitle' : 'filterWhereTitle'));

    const secondary = container.querySelector('.filter-button-secondary-description');

    const values = [...activeFilters[type]];
    if (values.length === 0) {
      secondary.dataset.i18n = type === 'category' ? 'filterCategoryAll' : 'filterWhereEverywhere';
    } else if (values.length === 1) {
      secondary.dataset.i18n = values[0];
    } else {
      secondary.textContent = `${values.length} selected`;
    }
  }

  function updateWhenButton(value) {
    const container = [...document.querySelectorAll('.filter-button-container')]
      .find(c =>
        c.querySelector('.filter-button-main-description')?.dataset.i18n === 'filterWhenTitle'
      );

    if (!container) return;

    container.querySelector('.filter-button-secondary-description').dataset.i18n = value;
  }


  function resetWhenUI() {
    updateWhenButton('filterWhenAnytime');
    document.querySelectorAll('.custom-checkbox').forEach(cb => cb.checked = false);
  }

  function filterEvents() {
    openLoadingSpinner();
    let filtered = realEvents.events.filter(event => {

      // CATEGORY
      const activeCategory = [...activeFilters.category].filter(v => !SKIP_TILES.includes(v));
      if (activeCategory.length) {
        const categoryDropdown = dropdowns.find(d => d.main.i18n === 'filterCategoryTitle');
        if (!activeCategory.includes(getI18nKey(categoryDropdown.options, event.Category__c))) return false;
      }

      // WHERE
      const activeWhere = [...activeFilters.where].filter(v => !SKIP_TILES.includes(v));
      if (activeWhere.length) {
        if (!event.Location_Name__c) return false;
        //if (!activeWhere.includes(normalizeI18n(event.Location_Name__c))) return false;
        if (!activeWhere.includes(event.Location_Name__c)) return false;
      }

      // WHEN
      if (activeFilters.when) {
        const eventDates = parseEventDates(event.Dates__c);

        if (activeFilters.when.type === 'preset') {
          if (!matchesPreset(eventDates, activeFilters.when.value)) return false;
        } else {
          if (!matchesRange(eventDates, activeFilters.when.start, activeFilters.when.end)) return false;
        }
      }

      // ------------------------
      // FILTER TAGS (new)
      // ------------------------
      if (selectedFilters.size) {
        const tagMatched = [...selectedFilters].some(tagFilter => {
          const tagConfig = filterTags.find(ft => ft.filter === tagFilter);
          if (!tagConfig) return false;
          return event[tagConfig.field] && event[tagConfig.field].toLowerCase() === tagConfig.value;
        });

        if (!tagMatched) return false;
      }

      return true;
    });

    // --- Sort events based on currentSortBy ---
    if (currentSortBy === 'date') {
      filtered = filtered
      .map(event => ({
        event,
        nextDate: getNextUpcomingDate(event)
      }))
      .filter(e => e.nextDate !== null) // ignore events with no upcoming dates
      .sort((a, b) => a.nextDate - b.nextDate) // closest upcoming date first
      .map(e => e.event); // unwrap event objects
    }

    renderEvents(filtered);
    translatePage(currentLanguage);
    initCardLinkListeners();
    closeLoadingSpinner();
  }

  function getNextUpcomingDate(event) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to start of day

    const dates = parseEventDates(event.Dates__c); // returns [{start, end}, ...]

    // Flatten to all start dates that are >= today
    const futureStarts = dates
      .flatMap(d => {
        // if it's a range, check start and end
        if (d.end >= today) {
          // If start < today, treat today as start
          return [d.start < today ? today : d.start];
        }
        return []; // range fully in past → ignore
      });

    if (futureStarts.length === 0) return null; // no future dates
    return futureStarts.sort((a, b) => a - b)[0]; // earliest upcoming date
  }


  function getI18nKey(options, value) {
    return options.find(opt => opt.value === value)?.i18n;
  }

  function parseDMY(dateStr) {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  function parseEventDates(str) {
    return str.split(';').flatMap(part => {
      if (part.includes(':')) {
        const [s, e] = part.split(':').map(p => p.trim());
        return [{ start: parseDMY(s), end: parseDMY(e) }];
      }
      const d = parseDMY(part);
      return [{ start: d, end: d }];
    });
  }

  // function matchesRange(dates, start, end) {
  //   return dates.some(d =>
  //     d.end >= start && d.start <= end
  //   );
  // }

  function isSameOrAfter(dateA, dateB) {
    // Compare only year, month, day
    return dateA.getFullYear() > dateB.getFullYear() ||
          (dateA.getFullYear() === dateB.getFullYear() &&
            dateA.getMonth() > dateB.getMonth()) ||
          (dateA.getFullYear() === dateB.getFullYear() &&
            dateA.getMonth() === dateB.getMonth() &&
            dateA.getDate() >= dateB.getDate());
  }

  function isSameOrBefore(dateA, dateB) {
    return dateA.getFullYear() < dateB.getFullYear() ||
          (dateA.getFullYear() === dateB.getFullYear() &&
            dateA.getMonth() < dateB.getMonth()) ||
          (dateA.getFullYear() === dateB.getFullYear() &&
            dateA.getMonth() === dateB.getMonth() &&
            dateA.getDate() <= dateB.getDate());
  }

  function matchesRange(dates, start, end) {
    return dates.some(d =>
      isSameOrAfter(d.end, start) && isSameOrBefore(d.start, end)
    );
  }

  function matchesPreset(dates, presetKey) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday

    switch (presetKey) {
      case 'filterWhenToday':
        return matchesRange(dates, today, today);

      case 'filterWhenTomorrow':
        return matchesRange(dates, tomorrow, tomorrow);

      case 'filterWhenWeekend': {
        const { start, end } = getWeekendRange(dayOfWeek, today);
        return matchesRange(dates, start, end);
      }

      case 'filterWhenNextWeek': {
        const { start, end } = getNextWeekRange(dayOfWeek, today);
        return matchesRange(dates, start, end);
      }

      case 'filterWhenAnytime':
        return true;

      default:
        return true;
    }
  }

  function getWeekendRange(dayOfWeek, today) {
    // Assuming weekend = Saturday & Sunday
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + ((6 - dayOfWeek + 7) % 7)); // next Saturday
    saturday.setHours(0, 0, 0, 0);

    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);
    sunday.setHours(23, 59, 59, 999);

    return { start: saturday, end: sunday };
  }

  function getNextWeekRange(dayOfWeek, today) {
    const monday = new Date(today);
    monday.setDate(today.getDate() + ((8 - dayOfWeek) % 7)); // next Monday
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6); // next Sunday
    sunday.setHours(23, 59, 59, 999);

    return { start: monday, end: sunday };
  }

  /* FILTERS END */

});