document.addEventListener("DOMContentLoaded", async function () {

  let breakIfDownForMaintenance = false;
  let testEnvironment = window.location.href.includes('Thessivity/index.html');
  let outputData = {};
  let fallbackImage;

  const apiKey = 'AIzaSyDuJGX7mZ45UxWwctaRSfa6LNq7qPM7_fM'; // Your API key from Google Developer Console
  //https://console.cloud.google.com/apis/credentials?inv=1&invt=AbxvKg&project=thessivity //jimskgg@gmail.com 
  const sheetId = '1LPjh1COe8CRUiLgGqf2wQA64IbOx4q2vuZcTJtwATFs'; // Google Sheet ID
  //https://drive.google.com/drive/folders/1Firv30_I1x6b5ENz3MLu31ZxpDNLcTdE

  const urlParams = new URLSearchParams(window.location.search);
  const activityId = urlParams.get('activityId');
  console.log("Activity Id:", activityId);
  

  const mockEventResponse = [
     {
        "Id": "a0123456789ABCDE",
        "Name": "Cooking Workshop1",
        "Dates__c": "2025-06-25",
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
      }
  ];

  async function fetchSalesforceDataForEvent() {
    const response = await fetch(`https://thessivity.onrender.com/getData?lang=${currentLanguage}&id=${activityId}`);

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

  async function fetchGoogleSheetsDataForEvent() {
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

  async function fetchDataForEvent() {
    try {
      openLoadingSpinner();
      closeHomeBody();

      //await new Promise(resolve => setTimeout(resolve, 800));
      let data = databaseSource === 'SF' ? await fetchSalesforceDataForEvent() : await fetchGoogleSheetsDataForEvent();

      if (data.error == undefined){
        fallbackImage = data.settings.fallbackImage;
        buildEventCard(data.events[0]);
      } else {
        buildErrorScreen(data.error);
      }
      //buildEventCard(mockEventResponse[0]);

      closeLoadingSpinner();
      openHomeBody();
      setViewMore();

    } catch (error) {
      closeLoadingSpinner();
    }
  }

  await fetchDataForEvent();

  function el(tag, className, text, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    if (html !== undefined && html !== null) node.innerHTML = html;
    return node;
  }

  function buildErrorScreen(errorMessage){
    const homeBody = document.getElementById('home-body');
    //homeBody.innerHTML = errorMessage;

    const errorContainer = el('div', 'error-container');
    const errorH2 = el('h2', 'description-main');
    errorH2.innerHTML = errorMessage;
    homeBody.appendChild(errorContainer);
    errorContainer.appendChild(errorH2);

    bindDynamicEventListeners();
  }

  function buildEventCard(event) {
    const homeBody = document.getElementById('home-body');
    homeBody.innerHTML = '';

    const bodyRow = el('div', 'body-row');
    const wrapper = el('div', 'body-card-wrapper');
    const cardList = el('div', 'card-list');
    const cardItem = el('div', 'card-item');
    const cardLink = el('div', 'card-link-activity');

    cardLink.append(
      buildHeaderSection(event),
      buildDescriptionSection(event),
      buildUsefulInfoSection(event),
      buildOrganizerSection(event),
      el('div', null) // stop-here
    );

    cardLink.lastChild.id = 'stop-here';

    cardItem.appendChild(cardLink);
    cardList.appendChild(cardItem);
    wrapper.appendChild(cardList);
    bodyRow.appendChild(wrapper);
    homeBody.appendChild(bodyRow);

    bindDynamicEventListeners();
  }

  function buildHeaderSection(event) {
    const fragment = document.createDocumentFragment();

    const imgWrapper = el('div', 'card-image-activity-wrapper');
    const img = el('img', 'card-image-activity');
    getValidImage(event.Image__c, fallbackImage).then(finalUrl => {
      img.src = finalUrl;
    });
    imgWrapper.appendChild(img);

    const container = el('div', 'card-link-body-container-activity');
    const body = el('div', 'card-link-body-activity');

    const title = el('h1', 'card-title-main-activity', event.Name);

    const info = el('div', 'card-title-info-activity');

    info.append(
      buildIconTextRow('location_logo.png', 'location-img', event.Location_Name__c),
      buildIconTextRow('schedule_logo.png', 'schedule-img', event.Dates__c, true)
    );

    body.append(title, info);

    const buttonBar = el('div', 'card-link-button-activity');
    const link = el('a', 'card-link-button-a-activity', t('website'));
    link.dataset.urlsite = normalizeUrl(event.Website__c);
    link.rel = 'noopener noreferrer';
    buttonBar.appendChild(link);

    container.append(body, buttonBar);
    fragment.append(imgWrapper, container);

    return fragment;
  }

  function buildIconTextRow(icon, imgClass, text, isDates = false) {
    const row = el('div', 'card-title-info-location-activity');
    const img = el('img', imgClass);
    img.src = `images/${icon}`;

    let content;
    if (isDates) {
      // Build tiles for dates
      content = buildDateTiles(text); // returns a div with tiles
    } else {
      content = el('div', 'card-secondary-title-activity', text);
    }

    row.append(img, content);
    return row;
  }

  function buildDescriptionSection(event) {
    const container = el('div', 'card-link-body-container-activity');
    const body = el('div', 'card-link-body-activity');
    
    body.append(
      el('h3', 'card-title-description-activity', t('description')),
      el('div', 'card-title-description-text-activity', null, event.Description__c),
      el('div', 'card-title-activity-text-toggle')
    );

    container.appendChild(body);
    return container;
  }

  function buildUsefulInfoSection(event) {
    const container = el('div', 'card-link-body-container-activity');
    const body = el('div', 'card-link-body-activity');

    body.appendChild(el('h3', 'card-title-description-activity', t('usefulInfo')));

    const first = el('div', 'card-usefull-info-organiser-first-container');
    const col1 = el('div', 'card-usefull-info-container-column');
    const col2 = el('div', 'card-usefull-info-container-column');

    if (event.Duration__c)
      col1.appendChild(buildInfoRow('duration_logo.png', 'duration-img', t('duration'), `${event.Duration__c} ${t('minutes')}`));

    if (event.Price__c)
      col1.appendChild(buildInfoRow('price_logo.png', 'price-img', t('price'), `${event.Price__c} €`));

    if (event.Number_Of_People__c)
      col1.appendChild(buildInfoRow('people_logo.png', 'people-img', t('people'), event.Number_Of_People__c));

    col2.appendChild(buildLocationSection(event));

    first.append(col1, col2);
    body.appendChild(first);
    container.appendChild(body);

    return container;
  }

  function buildInfoRow(icon, imgClass, label, value) {
    const row = el('div', 'card-usefull-info-organiser-third-container');

    const title = el('div', 'card-usefull-info-organiser-title');
    const img = el('img', imgClass);
    img.src = `images/${icon}`;
    title.append(img, el('span', 'card-usefull-info-organiser-title-text', label));

    row.append(title, el('p', 'card-usefull-info-organiser-title-value', value));
    return row;
  }

  function buildLocationSection(event) {
    const row = el('div', 'card-usefull-info-organiser-third-container');

    const title = el('div', 'card-usefull-info-organiser-title');
    const img = el('img', 'location-img');
    img.src = 'images/location_logo.png';

    title.append(img, el('span', 'card-usefull-info-organiser-title-text', t('location')));

    const iframe = el('iframe', 'card-usefull-information-location-map');
    iframe.loading = 'lazy';
    iframe.allowFullscreen = true;
    iframe.src = `https://www.google.com/maps?q=${event.Location__Latitude__s},${event.Location__Longitude__s}&output=embed`;

    const valueP = el('p', 'card-usefull-info-organiser-title-value');
    const valueDiv = el('div', 'card-usefull-info-organiser-title-value-div', event.Location_Name__c);
    row.append(title, valueP, valueDiv, iframe);
    return row;
  }

  function buildOrganizerSection(event) {
    const o = event.Organizer__r;

    const container = el('div', 'card-link-body-container-activity');
    const body = el('div', 'card-link-body-activity');

    // Section title
    body.appendChild(el('h3', 'card-title-description-activity', t('organizer')));

    // Outer organizer container
    const organiserContainer = el('div','card-usefull-info-organiser-third-container');

    // Organizer title (icon + name)
    const organiserTitle = el('div','card-usefull-info-organiser-title');

    const organiserImg = el('img', 'organiser-img');
    organiserImg.src = 'images/organiser_logo.png';

    organiserTitle.append(organiserImg,el('span', 'card-usefull-info-organiser-title-text', o.Name));

    organiserContainer.appendChild(organiserTitle);

    // Details wrapper
    const detailsWrapper = el('div','card-organiser-details-multiple-rows');

    // -------- First row (address + phone)
    const firstRow = el('div', 'card-organiser-details-single-row');

    firstRow.append(
      buildOrganizerRow(t('address'), o.BillingStreet),
      buildOrganizerLinkRow(t('phone'), `tel:${o.Phone}`, o.Phone)
    );

    // -------- Second row (email)
    const secondRow = el('div','card-organiser-details-single-row');

    secondRow.append(buildOrganizerLinkRow(t('email'),`mailto:${o.Email__c}`, o.Email__c));

    detailsWrapper.append(firstRow, secondRow);
    organiserContainer.appendChild(detailsWrapper);
    body.appendChild(organiserContainer);
    container.appendChild(body);

    return container;
  }

  function buildOrganizerRow(label, value) {
    const col = el('div', 'card-organiser-details-single-column');
    col.append(
      el('div', 'card-organiser-details-single-column-title', label),
      el('div', 'card-organiser-details-single-column-value', value)
    );
    return col;
  }

  function buildOrganizerLinkRow(label, href, value) {
    const col = el('div', 'card-organiser-details-single-column');
    const a = el('a', 'card-organiser-details-single-column-value', value);
    a.href = href;
    col.append(
      el('div', 'card-organiser-details-single-column-title', label),
      a
    );
    return col;
  }

  function buildDateTiles(dateStr) {
    const container = el('div', 'dates-container');

    if (!dateStr) return container;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = dateStr.split(';').map(p => p.trim()).filter(Boolean);

    parts.forEach(part => {
      let text = '';
      let includeTile = true;

      if (part.includes(':')) {
        // Range
        const [start, end] = part.split(':').map(parseDate);
        if (end < today) includeTile = false;
        text = `${formatDate(start)} - ${formatDate(end)}`;
      } else {
        // Single date
        const date = parseDate(part);
        if (date < today) includeTile = false;
        text = formatDate(date);
      }

      if (includeTile && text != 'Invalid Date'){
        const tile = el('div', 'date-tile', text);
        container.appendChild(tile);
      }
      
    });

    return container;
  }


  /*

  function buildEventCard(event) {
    const homeBody = document.getElementById('home-body');
    homeBody.innerHTML = `
      <div class="body-row">
        <div class="body-card-wrapper">
          <div class="card-list">
            <div class="card-item">
              <div class="card-link-activity">
                ${buildHeaderSection(event)}
                ${buildDescriptionSection(event)}
                ${buildUsefulInfoSection(event)}
                ${buildOrganizerSection(event)}
                <div id="stop-here"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    bindDynamicEventListeners();
  }

  function buildHeaderSection(event) {
    return `
      <div class="card-image-activity-wrapper">
        <img src="images/cooking.jpg" class="card-image-activity">
      </div>

      <div class="card-link-body-container-activity">
        <div class="card-link-body-activity">
          <h1 class="card-title-main-activity">${event.Name}</h1>
          <div class="card-title-info-activity">
            <div class="card-title-info-location-activity">
              <img src="images/location_logo.png" class="location-img">
              <div class="card-secondary-title-activity">${event.Location_Name__c}</div>
            </div>
            <div class="card-title-info-schedule-activity">
              <img src="images/schedule_logo.png" class="schedule-img">
              <div class="card-secondary-title-activity">${event.Dates__c}</div>
            </div>
          </div>
        </div>

        <div class="card-link-button-activity">
          <a class="card-link-button-a-activity" data-urlsite="${event.Website__c}">${t('website')}</a>
        </div>
      </div>
    `;
  }

  function buildDescriptionSection(event) {
    return `
      <div class="card-link-body-container-activity">
        <div class="card-link-body-activity">
          <h3 class="card-title-description-activity">${t('description')}</h3>
          <div class="card-title-description-text-activity">
            ${event.Description__c}
          </div>
          <div class="card-title-activity-text-toggle"></div>
        </div>
      </div>
    `;
  }

  function buildUsefulInfoSection(event) {
    return `
      <div class="card-link-body-container-activity">
        <div class="card-link-body-activity">
          <h3 class="card-title-description-activity">${t('usefulInfo')}</h3>

          <div class="card-usefull-info-organiser-first-container">
            <div class="card-usefull-info-container-column">
              ${buildInfoRow('duration-img', 'duration_logo.png', t('duration'), event.Duration__c ? `${event.Duration__c} ${t('minutes')}` : null)}
              ${buildInfoRow('price-img', 'price_logo.png', t('price'), `${event.Price__c} €`)}
              ${buildInfoRow('people-img', 'people_logo.png', t('people'), event.Number_Of_People__c)}
            </div>
            <div class="card-usefull-info-container-column">
              ${buildLocationSection(event)}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function buildInfoRow(logo_class, icon, label, value) {
    if (value === null || value === undefined || value === '') {
      return '';
    }
    return `
      <div class="card-usefull-info-organiser-third-container">
        <div class="card-usefull-info-organiser-title">
          <img class="${logo_class}" src="images/${icon}">
          <span class="card-usefull-info-organiser-title-text">${label}</span>
        </div>
        <p class="card-usefull-info-organiser-title-value">${value}</p>
      </div>
    `;
  }

  function buildLocationSection(event) {
    const mapUrl = `https://www.google.com/maps?q=${event.Latitude__c},${event.Longitude__c}&output=embed`;

    return `
      <div class="card-usefull-info-organiser-third-container">
        <div class="card-usefull-info-organiser-title">
          <img class="location-img" src="images/location_logo.png">
          <span class="card-usefull-info-organiser-title-text">${t('location')}</span>
        </div>
        <div>
          <p class="card-usefull-info-organiser-title-value">
            <div class="card-usefull-info-organiser-title-value-div">${event.Location_Name__c}</div>
            <iframe class="card-usefull-information-location-map"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    allowfullscreen
                    src="${mapUrl}">
            </iframe>
          </p>
        </div>
      </div>
    `;
  }

  function buildOrganizerSection(event) {
    const o = event.Organizer__r;

    return `
      <div class="card-link-body-container-activity">
        <div class="card-link-body-activity">
          <h3 class="card-title-description-activity">${t('organizer')}</h3>

          <div class="card-usefull-info-organiser-third-container">
            <div class="card-usefull-info-organiser-title">
              <img class="organiser-img" src="images/organiser_logo.png">
              <span class="card-usefull-info-organiser-title-text">${o.Name}</span>
            </div>

            <div class="card-organiser-details-multiple-rows">
              <div class="card-organiser-details-single-row">
                ${buildOrganizerRow(t('address'), o.BillingStreet)}
                ${buildOrganizerLinkRow(t('phone'), `tel:${o.Phone}`, o.Phone)}
              </div>
              <div class="card-organiser-details-single-row">
                ${buildOrganizerLinkRow(t('email'), `mailto:${o.Email__c}`, o.Email__c)} 
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function buildOrganizerRow(label, value) {
    return `
      <div class="card-organiser-details-single-column">
        <div class="card-organiser-details-single-column-title">${label}</div>
        <div class="card-organiser-details-single-column-value">${value}</div>
      </div>
    `;
  }

  function buildOrganizerLinkRow(label, href, value) {
    return `
      <div class="card-organiser-details-single-column">
        <div class="card-organiser-details-single-column-title">${label}</div>
        <a href="${href}" class="card-organiser-details-single-column-value">
          ${value}
        </a>
      </div>
    `;
  }
    
  */

  function bindDynamicEventListeners() {
    document
      .querySelector('.card-link-button-a-activity')
      ?.addEventListener('mousedown', function (event) {
        redirectToSite(this.dataset.urlsite, event);
      });

    if (isMobileDevice()) {
      window.removeEventListener('scroll', checkButtonBarStop);
      window.removeEventListener('resize', checkButtonBarStop);

      window.addEventListener('scroll', checkButtonBarStop);
      window.addEventListener('resize', checkButtonBarStop);

      // Run once after render
      requestAnimationFrame(checkButtonBarStop);
    }
  }

  function normalizeUrl(url) {
    if (!url) return '';

    // If it already starts with http:// or https://, return as-is
    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    // Otherwise, prepend https://
    return `https://${url}`;
  }

  /* ARROW TO TOP START */

  document.getElementById('arrow-to-top-button')?.addEventListener('click', () => {
     if (isMobileDevice()) checkButtonBarStop();
  });
  
  /* ARROW TO TOP END */
  
  /* ACTIVITY MOVING BUTTON START */

  function isMobileDevice() {
    return /Mobi|Android|iPhone/i.test(navigator.userAgent);
  }

  function checkButtonBarStop() {
    const buttonBar = document.querySelector('.card-link-button-activity');
    const stopMarker = document.querySelector('#stop-here');

    // If dynamic elements not yet rendered, exit safely
    if (!buttonBar || !stopMarker) return;

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

  /* ACTIVITY MOVING BUTTON END */

  function redirectToSite(urlsite, event){
    const url = urlsite;
    if (event.button === 1) window.open(url, '_blank');
    else if (event.button === 0) window.location.href = url;
  }

  document.getElementById('gr-li')?.addEventListener('click', () => {
      fetchDataForEvent();
  });

  document.getElementById('en-li')?.addEventListener('click', () => {
      fetchDataForEvent();
  });

  /* SHOW MORE LESS DESCRIPTION LINES START */

  function setViewMore(){
    const toggle = document.querySelector('.card-title-activity-text-toggle');
    const textElement = document.querySelector('.card-title-description-text-activity');
    const maxLines = 3;
    
    toggle.textContent = t('viewMore');

    if (getLineCount(textElement) >= maxLines) {
      document.querySelector('.card-title-activity-text-toggle').style.display = 'inline-block';
      textElement.classList.add('fade-out');
    } else {
      document.querySelector('.card-title-activity-text-toggle').style.display = 'none';
    }

    toggle.addEventListener('click', () => {
      const toggle = document.querySelector('.card-title-activity-text-toggle');
      const content = document.querySelector('.card-title-description-text-activity');
      content.classList.toggle('card-title-description-text-activity-expanded');

      if (content.classList.contains('card-title-description-text-activity-expanded')) {
        toggle.textContent = t('showLess');
        content.classList.remove('fade-out');
      } else {
        toggle.textContent = t('viewMore');
        content.classList.add('fade-out');
      }
      if (isMobileDevice()) checkButtonBarStop();
    });
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

  /* SHOW MORE LESS DESCRIPTION LINES END */

});
