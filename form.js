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
      }, 1000);

    } catch (error) {
      console.log('error: ' + error);
      closeLoadingSpinner();
    }
  }

  await fetchSheetData(sheetId, apiKey);

  function closeLoadingSpinner(){
    const spinner = document.getElementById("loading-container");
    spinner.classList.add("hidden");
  }

});

    document.getElementById('vip').addEventListener('change', function() {
      document.getElementById('vipDurationInput').classList.toggle('hidden', !this.checked);
    });






    const organizer = document.getElementById('organizer');
    const createNewOrg = document.getElementById('createNewOrg');
    const orgDetails = document.getElementById('orgDetails');

    createNewOrg.addEventListener('change', () => {
      if (createNewOrg.checked) {
        organizer.value = '';
        organizer.classList.add('input-disabled');
        orgDetails.classList.remove('hidden');
      } else {
        organizer.classList.remove('input-disabled');
        if (!organizer.value) orgDetails.classList.add('hidden');
      }
    });

    organizer.addEventListener('change', () => {
      orgDetails.classList.toggle('hidden', !organizer.value);
    });






    const dateInputs = document.getElementById('dateInputs');
    const addRangeBtn = document.getElementById('addRange');
    const dateMode = document.getElementById('dateMode');

    function clearDates() {
      dateInputs.innerHTML = '';
      addRangeBtn.classList.add('hidden');
    }

    function createFlatpickr(type = 'single', range = false) {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'date-picker';
      input.placeholder = type == 'single' ?  "Select Date.." : "Select Dates..";
      dateInputs.appendChild(input);
      flatpickr(input, { mode: type, dateFormat: 'Y-m-d' });
    }

    function createRangePair() {
      const wrapper = document.createElement('div');
      wrapper.className = 'inline';
      const from = document.createElement('input');
      from.type = 'text';
      const to = document.createElement('input');
      to.type = 'text';
      from.placeholder = 'From';
      to.placeholder = 'To';
      wrapper.appendChild(from);
      wrapper.appendChild(to);
      dateInputs.appendChild(wrapper);
      flatpickr(from, { dateFormat: 'Y-m-d' });
      flatpickr(to, { dateFormat: 'Y-m-d' });
    }

    
    createFlatpickr('single');


    dateMode.addEventListener('change', () => {
      clearDates();
      switch (dateMode.value) {
        case 'single':
          createFlatpickr('single');
          break;
        case 'multiple':
          createFlatpickr('multiple');
          break;
        case 'range':
          createRangePair();
          break;
        case 'multiple-ranges':
          createRangePair();
          addRangeBtn.classList.remove('hidden');
          break;
      }
    });

    addRangeBtn.addEventListener('click', createRangePair);

    var quill = new Quill('#editor', {
      theme: 'snow',
      placeholder: 'Please enter the event\'s description...',
    });



    function initAutocomplete() {
      const input = document.getElementById('location');
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', function () {
        const place = autocomplete.getPlace();
        document.getElementById('lat').value = place.geometry.location.lat();
        document.getElementById('lng').value = place.geometry.location.lng();
      });
    }
    google.maps.event.addDomListener(window, 'load', initAutocomplete);






    const fileInput = document.getElementById('fileInput');
    const fileText = document.getElementById('fileText');
    const removeBtn = document.getElementById('removeBtn');
    const defaultPlaceholder = fileText.textContent;

    fileInput.addEventListener('change', (evt) => {
      const files = Array.from(evt.target.files);
      if (files.length === 0) {
        fileText.textContent = defaultPlaceholder;
        removeBtn.style.display = 'none';
      } else if (files.length === 1) {
        fileText.textContent = files[0].name;
        removeBtn.style.display = 'inline';
      } else {
        fileText.textContent = `${files.length} files selected`;
        removeBtn.style.display = 'inline';
      }
    });

    removeBtn.addEventListener('click', () => {
      fileInput.value = ''; // clear selected files
      fileText.textContent = defaultPlaceholder;
      removeBtn.style.display = 'none';
    });

    document.querySelector('input[type="number"]').addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^\d.]/g, '');
    });