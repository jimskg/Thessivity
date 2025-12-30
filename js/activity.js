document.addEventListener("DOMContentLoaded", async function () {

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
  

  const mockEventResponse = {
    Id: activityId || 'a0123456789ABCDE',
    Name: 'Rizes',
    Date__c: '25/6/2025',
    Description__c: `Η πόλη ξυπνά σιγά σιγά καθώς ο ήλιος ανατέλλει πίσω από τα βουνά.
  Οι δρόμοι γεμίζουν με ανθρώπους που βιάζονται να φτάσουν στις δουλειές τους.
  Η μυρωδιά του φρεσκοκομμένου καφέ γεμίζει τον αέρα από τις καφετέριες της γειτονιάς.
  Τα παιδιά γελούν στο δρόμο για το σχολείο, κρατώντας τις τσάντες τους.
  Ένα ελαφρύ αεράκι ανακατεύει τα φύλλα των δέντρων και φέρνει μια αίσθηση ηρεμίας.
  Η μέρα ξεκινά γεμάτη δυνατότητες και μικρές στιγμές ευτυχίας.
  Η πόλη ξυπνά σιγά σιγά καθώς ο ήλιος ανατέλλει πίσω από τα βουνά.`,
    Location_name__c: 'Μέγαρο Μουσικής',
    Latitude__c: 40.5827113791267,
    Longitude__c: 22.92457222938538,
    Number_Of_People__c: '15-30',
    Price__c: 20,
    Duration__c: 120,
    Website__c: 'https://www.google.gr',
    Organizer__r: {
      Name: 'Helexpo',
      Address__c: 'Μεγάλου Αλεξάνδρου 40',
      Phone: '2310111111',
      Email__c: 'test@test.test'
    }
  };

  async function fetchSheetData(sheetId, apiKey) {
    try {
      
      openLoadingSpinner();

      await new Promise(resolve => setTimeout(resolve, 800));

      buildEventCard(mockEventResponse);

      closeLoadingSpinner();
      openHomeBody();
      setViewMore();

    } catch (error) {
      closeLoadingSpinner();
    }
  }

  await fetchSheetData(sheetId, apiKey);

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
              <div class="card-secondary-title-activity">${event.Location_name__c}</div>
            </div>
            <div class="card-title-info-schedule-activity">
              <img src="images/schedule_logo.png" class="schedule-img">
              <div class="card-secondary-title-activity">${event.Date__c}</div>
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
            <div class="card-usefull-info-organiser-title-value-div">${event.Location_name__c}</div>
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
                ${buildOrganizerRow(t('address'), o.Address__c)}
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
      buildEventCard(mockEventResponse);
      setViewMore();
  });

  document.getElementById('en-li')?.addEventListener('click', () => {
      buildEventCard(mockEventResponse);
      setViewMore();
  });

  document.querySelector('.card-link-button-a-activity')?.addEventListener('mousedown', function(event) {
      const urlsite = this.dataset.urlsite;
      redirectToSite(urlsite, event);
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
