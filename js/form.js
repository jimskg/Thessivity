// -------------------- Constants / Options --------------------
let quill; 

const vipDurationOptions = [
  { id: 'vip-placeholder', value: '', i18n: 'selectOne', disabled: true, selected: true, hidden: true},
  { id: 'vip-30', value: 30, i18n: 'vipDuration30' },
  { id: 'vip-60', value: 60, i18n: 'vipDuration60' },
  { id: 'vip-90', value: 90, i18n: 'vipDuration90' }
];

const categoryOptions = [
  { id: 'cat-placeholder', value: '', i18n: 'selectOne', disabled: true, selected: true, hidden: true},
  { id: 'cat-photography', value: 'Photography', i18n: 'categoryPhotography'},
  { id: 'cat-hiking', value: 'Hiking', i18n: 'categoryHiking'},
  { id: 'cat-dance', value: 'Dance', i18n: 'categoryDance'},
  { id: 'cat-robotics', value: 'Robotics', i18n: 'categoryRobotics'},
  { id: 'cat-music', value: 'Music', i18n: 'categoryMusic'},
  { id: 'cat-travel', value: 'Travel', i18n: 'categoryTravel'},
  { id: 'cat-volunteering', value: 'Volunteering', i18n: 'categoryVolunteering'},
  { id: 'cat-wellness', value: 'Wellness & Fitness', i18n: 'categoryWellnessFitness'},
  { id: 'cat-personalDevelopment', value: 'Personal Development', i18n: 'categoryPersonalDevelopment'},
  { id: 'cat-crafts', value: 'Crafts', i18n: 'categoryCrafts'},
  { id: 'cat-sports', value: 'Sports', i18n: 'categorySports'},
  { id: 'cat-cooking', value: 'Cooking', i18n: 'categoryCooking'},
  { id: 'cat-rest', value: 'Rest', i18n: 'categoryRest'},
];

const typeOptions = [
  { id: 'type-placeholder', value: '', i18n: 'selectOne', disabled: true, selected: true, hidden: true},
  { id: 'type-seminar', value: 'seminar', i18n: 'typeSeminar' },
  { id: 'type-festival', value: 'festival', i18n: 'typeFestival' },
  { id: 'type-workshop', value: 'workshop', i18n: 'typeWorkshop' },
  { id: 'type-experience', value: 'experience', i18n: 'typeExperience' }
];

const audienceOptions = [
  { id: 'audience-placeholder', value: '', i18n: 'selectOne', disabled: true, selected: true, hidden: true},
  { id: 'audience-kids', value: 'kids', i18n: 'audienceKids' },
  { id: 'audience-adults', value: 'adults', i18n: 'audienceAdults' },
  { id: 'audience-all', value: 'adults_kids', i18n: 'audienceAdultsKids' }
];

// Example organizer suggestions
const organizerChoices = ['Deloitte', 'Pfizer', 'Accenture'];

// -------------------- Utility Functions --------------------
function t(key) {
  return LABELS[currentLanguage]?.[key] || key;
}

// -------------------- DOM Builders --------------------
function buildSelectHTML(containerId, selectId, options) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  const select = document.createElement('select');
  select.id = selectId;

  options.forEach(o => {
    const opt = document.createElement('option');
    opt.value = o.value;
    opt.dataset.i18n = o.i18n;
    opt.textContent = t(o.i18n);
    
    if (o.disabled) opt.disabled = true;
    if (o.hidden) opt.hidden = true;
    if (o.selected) opt.selected = true;

    select.appendChild(opt);
  });

  container.appendChild(select);
}

// -------------------- Event Listeners --------------------

function initLangListeners() {
  document.addEventListener('click', (e) => {
    if (e.target.id === 'gr-li' || e.target.closest('#gr-li')) {
      updateQuillPlaceholder(quill);
    }

    if (e.target.id === 'en-li' || e.target.closest('#en-li')) {
      updateQuillPlaceholder(quill);
    }
  });
}

function initVIPToggle() {
  const vipCheckbox = document.getElementById('vip');
  const vipContainer = document.getElementById('vipDurationInput');

  if (!vipCheckbox || !vipContainer) return;

  // Initial visibility
  vipContainer.classList.toggle('hidden', !vipCheckbox.checked);

  // Toggle on change
  vipCheckbox.addEventListener('change', () => {
    vipContainer.classList.toggle('hidden', !vipCheckbox.checked);
  });
}

function initOrganizerToggle() {
  const organizerInput = document.getElementById('searchOrg');
  const createNewOrg = document.getElementById('createNewOrg');
  const orgDetails = document.getElementById('orgDetails');
  const orgNameAddress = document.getElementById('orgNameAddress');
  const orgName = document.getElementById('orgName');
  
  createNewOrg.checked = false;

  createNewOrg?.addEventListener('change', () => {
    if (createNewOrg.checked) {
      organizerInput.value = '';
      organizerInput.classList.add('input-disabled');
      orgDetails.classList.remove('hidden');
      orgNameAddress.classList.add('row');
      orgName.classList.remove('hidden');
    } else {
      organizerInput.classList.remove('input-disabled');
      if (!organizerInput.value) orgDetails.classList.add('hidden');
    }
  });

  organizerInput?.addEventListener('change', () => {
    orgDetails.classList.toggle('hidden', !organizerInput.value);
    orgName.classList.toggle('hidden', organizerInput.value);
  });

  initOrganizerAutocomplete(organizerInput, organizerChoices);
}

function initOrganizerAutocomplete(input, choices) {
  const suggestions = document.getElementById('suggestions');
  if (!input || !suggestions) return;

  const hideList = () => {
    suggestions.innerHTML = '';
    suggestions.classList.add('hidden');
  };

  input.addEventListener('input', () => {
    const q = input.value.trim();
    hideList();
    if (!q) return;

    const hits = choices.filter(c => c.toLowerCase().includes(q.toLowerCase()));
    if (!hits.length) return;

    suggestions.classList.remove('hidden');
    hits.forEach(text => {
      const li = document.createElement('li');
      li.tabIndex = 0;

      const re = new RegExp(`(${q})`, 'i');
      const htmlText = text.replace(re, '<mark>$1</mark>');

      li.innerHTML = `
        <img src="images/organiser_logo.png" class="organiser-img" alt="organiser logo">
        <span class="label">${htmlText}</span>
      `;
      suggestions.appendChild(li);
    });
  });

  suggestions.addEventListener('click', e => {
    const li = e.target.closest('li');
    if (li) {
      input.value = li.querySelector('.label').textContent;
      hideList();
    }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.autocomplete')) hideList();
  });
}

function initDatePickers() {
  const dateInputs = document.getElementById('dateInputs');
  const addRangeBtn = document.getElementById('addRange');
  const dateMode = document.getElementById('dateMode');

  // Start hidden
  dateInputs.classList.add('hidden'); 
  addRangeBtn.classList.add('hidden'); 

  function clearDates() {
    dateInputs.innerHTML = '';
    addRangeBtn.classList.add('hidden'); 
  }

  function createFlatpickr(type = 'single') {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'date-picker';
    input.dataset.i18n = type === 'single' ? "selectDate" : "selectDates";
    input.placeholder = t(input.dataset.i18n);
    dateInputs.appendChild(input);
    flatpickr(input, { mode: type, dateFormat: 'Y-m-d' });
  }

  function createRangePair(firstTime = true) {
    const wrapper = document.createElement('div');
    wrapper.className = 'inline';
    const from = document.createElement('input');
    from.type = 'text';
    from.dataset.i18n = 'from';
    from.placeholder = t(from.dataset.i18n).charAt(0).toUpperCase() + t(from.dataset.i18n).slice(1);
    const to = document.createElement('input');
    to.type = 'text';
    to.dataset.i18n = 'to';
    to.placeholder = t(to.dataset.i18n).charAt(0).toUpperCase() + t(to.dataset.i18n).slice(1);

    wrapper.appendChild(from);
    wrapper.appendChild(to);

    if (!firstTime) {
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'remove-dates-btn';
      removeBtn.innerHTML = '&times;';
      wrapper.appendChild(removeBtn);
    }

    dateInputs.appendChild(wrapper);
    flatpickr(from, { dateFormat: 'Y-m-d' });
    flatpickr(to, { dateFormat: 'Y-m-d' });
  }

  dateInputs.addEventListener('click', e => {
    if (e.target.matches('button.remove-dates-btn')) {
      e.target.closest('.inline')?.remove();
    }
  });

  dateMode?.addEventListener('change', () => {
    clearDates();

    if (!dateMode.value) {
      // User selected placeholder / empty value
      dateInputs.classList.add('hidden'); 
      addRangeBtn.classList.add('hidden'); 
      return;
    }

    // Show inputs when a real value is selected
    dateInputs.classList.remove('hidden'); 

    switch (dateMode.value) {
      case 'single': createFlatpickr('single'); break;
      case 'multiple': createFlatpickr('multiple'); break;
      case 'range': createRangePair(); break;
      case 'multiple-ranges': createRangePair(); 
      addRangeBtn.classList.remove('hidden'); 
      break;
    }
  });

  addRangeBtn?.addEventListener('click', () => createRangePair(false));

  // **Remove the initial createFlatpickr('single') call**
}

function updateQuillPlaceholder(quill) {
  const editor = quill.root;
  editor.dataset.placeholder = t('descriptionPlaceholder');
}

function initQuillEditor() {
  let quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: t('descriptionPlaceholder')
  });
  return quill;
}

function initFileInput() {
  const fileInput = document.getElementById('fileInput');
  const fileText = document.getElementById('fileText');
  const removeBtn = document.getElementById('removeBtn');
  if (!fileInput || !fileText || !removeBtn) return;

  const defaultPlaceholder = fileText.textContent;

  fileInput.addEventListener('change', evt => {
    const files = Array.from(evt.target.files);
    if (!files.length) {
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
    fileInput.value = '';
    fileText.textContent = defaultPlaceholder;
    removeBtn.style.display = 'none';
  });
}

function initNumberValidation() {
  const numberInput = document.querySelector('input[type="number"]');
  numberInput?.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/[^\d.]/g, '');
  });
}

function closeLoadingSpinner(){
  const spinner = document.getElementById("loading-container");
  spinner.classList.add("hidden");
}

// -------------------- Form Submission --------------------

function showFieldError(fieldId, messageKey) {
  const field = document.getElementById(fieldId);
  const errorDiv = document.getElementById('error-' + fieldId);
  if (field && fieldId != 'dateInputs' && fieldId != 'fileText'){
    field.classList.add('input-invalid');
  } 
  if (errorDiv) {
    errorDiv.dataset.i18n = messageKey; 
    errorDiv.textContent = t(messageKey); // use i18n key
    errorDiv.style.display = 'block';
  }
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorDiv = document.getElementById('error-' + fieldId);
  if (field) field.classList.remove('input-invalid');
  if (errorDiv) errorDiv.style.display = 'none';
}

function validateForm() {
  let valid = true;

  // Title
  if (!document.getElementById('title').value.trim()) {
    showFieldError('title', 'errorTitleRequired');
    valid = false;
  } else clearFieldError('title');

  // Category
  if (!document.getElementById('category').value || document.getElementById('category').value === '') {
    showFieldError('category', 'errorCategoryRequired');
    valid = false;
  } else clearFieldError('category');

  // Type
  if (!document.getElementById('type').value || document.getElementById('type').value === '') {
    showFieldError('type', 'errorTypeRequired');
    valid = false;
  } else clearFieldError('type');

  // Audience
  if (!document.getElementById('audience').value || document.getElementById('audience').value === '') {
    showFieldError('audience', 'errorAudienceRequired');
    valid = false;
  } else clearFieldError('audience');

  // VIP Duration (only if VIP checked)
  const vipCheckbox = document.getElementById('vip');
  const vipDuration = document.getElementById('vipDuration');
  if (vipCheckbox.checked && (!vipDuration || !vipDuration.value || vipDuration.value === '')) {
    showFieldError('vipDuration', 'errorVIPDurationRequired');
    valid = false;
  } else clearFieldError('vipDuration');

  // Location
  if (!document.getElementById('location').value.trim()) {
    showFieldError('location', 'errorLocationRequired');
    valid = false;
  } else clearFieldError('location');

  // Price
  const priceInput = document.querySelector('input[type="number"]');
  if (!priceInput.value.trim() || Number(priceInput.value) < 0) {
    showFieldError('price', 'errorPriceRequired');
    valid = false;
  } else clearFieldError('price');

  // Description (Quill editor)
  const quillContent = quill.getText().trim();
  if (!quillContent) {
    showFieldError('description', 'errorDescriptionRequired');
    valid = false;
  } else clearFieldError('description');

  // Dates / Date Mode
  const dateInputsContainer = document.getElementById('dateInputs');
  const dateMode = document.getElementById('dateMode').value;

  clearFieldError('dateInputs'); // reset previous error

  if (!dateMode || dateMode === '') {
    showFieldError('dateMode', 'errorDateModeRequired'); // add this in i18n
    valid = false;
  } else {
    clearFieldError('dateMode');
  }

  if (dateMode && dateMode !== '') {
    if (dateMode === 'range' || dateMode === 'multiple-ranges') {
      const pairs = dateInputsContainer.querySelectorAll('.inline'); // each From/To wrapper
      pairs.forEach((pair) => {
        const from = pair.querySelector('input:nth-child(1)').value.trim();
        const to = pair.querySelector('input:nth-child(2)').value.trim();
        if (!from || !to) {
          showFieldError('dateInputs', 'errorDateRequired'); // i18n key
          valid = false;
        }
      });
    } else {
      // single or multiple mode
      const dateInputs = dateInputsContainer.querySelectorAll('input.date-picker');
      const hasDate = Array.from(dateInputs).some(input => input.value.trim() !== '');
      if (!hasDate) {
        showFieldError('dateInputs', 'errorDateRequired');
        valid = false;
      }
    }
  }

  // Image
  const fileInput = document.getElementById('fileInput');
  if (!fileInput.files.length) {
    showFieldError('fileText', 'errorImageRequired');
    valid = false;
  } else clearFieldError('fileText');

  // Website (optional, validate URL if filled)
  const websiteInput = document.getElementById('website');
  const websiteValue = websiteInput.value.trim();

  if (websiteValue) {
    // Regex: starts with www., then at least one character, then a dot, then 2-24 letters for domainv
    const websitePattern = /^(https?:\/\/)?www\.[\w-]+\.[a-zA-Z]{2,24}$/;
    if (!websitePattern.test(websiteValue)) {
      showFieldError('website', t('errorWebsiteInvalid'));
      valid = false;
    } else {
      clearFieldError('website');
      // Prepend https:// if missing
      if (!/^https?:\/\//i.test(websiteValue)) {
        websiteInput.value = 'https://' + websiteValue;
      }
    }
  } else {
    clearFieldError('website'); // optional field
  }

  // Organizer
  const createNewOrg = document.getElementById('createNewOrg');
  const organizerInput = document.getElementById('searchOrg');
  const orgNameInput = document.getElementById('orgName');
  const orgPhoneInput = document.getElementById('orgPhone');
  const orgEmailInput = document.getElementById('orgEmail');
  const orgAddressInput = document.getElementById('orgAddress');
  if (createNewOrg.checked) {
    clearFieldError('searchOrg');
    if (!orgNameInput.value.trim()) {
      showFieldError('orgName', 'errorOrganizerNameRequired');
      valid = false;
    } else clearFieldError('orgName');
    if (!orgPhoneInput.value.trim()) {
      showFieldError('orgPhone', 'errorOrganizerPhoneRequired');
      valid = false;
    } else clearFieldError('orgPhone');
    if (!orgEmailInput.value.trim()) {
      showFieldError('orgEmail', 'errorOrganizerEmailRequired');
      valid = false;
    } else clearFieldError('orgEmail');
    if (!orgAddressInput.value.trim()) {
      showFieldError('orgAddress', 'errorOrganizerAddressRequired');
      valid = false;
    } else clearFieldError('orgAddress');
  } else {
    if (!organizerInput.value.trim()) {
      showFieldError('searchOrg', 'errorOrganizerRequired');
      valid = false;
    } else clearFieldError('searchOrg');
  }

  return valid;
}


function initFormSubmission(quill) {
  const form = document.getElementById('eventForm');
  form?.addEventListener('submit', async e => {
    openLoadingSpinner();
    e.preventDefault();

    // --- Gather Values ---
    const title = document.getElementById('title').value.trim();
    const category = document.getElementById('category').value;
    const type = document.getElementById('type').value;
    const audience = document.getElementById('audience').value;
    const location = document.getElementById('location').value.trim();
    const lat = document.getElementById('lat').value;
    const lng = document.getElementById('lng').value;
    const description = quill.root.innerHTML;
    const price = parseFloat(document.querySelector('input[type="number"]').value) || 0;
    const vip = document.getElementById('vip').checked;
    const vipDuration = vip ? document.getElementById('vipDuration').value : null;

    // --- Validation ---
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll to top to see errors
      return;
    }

    // --- Organizer ---
    const createNewOrg = document.getElementById('createNewOrg');
    const organizerInput = document.getElementById('searchOrg');
    const organizer = { 
      Name: '', 
      BillingStreet: '', 
      Phone: '', 
      Email: '', 
      VIP: vip 
    };
    if (createNewOrg.checked) {
      organizer.Name = document.getElementById('orgName').value.trim();
      organizer.BillingStreet = document.getElementById('orgAddress').value.trim();
      organizer.Phone = document.getElementById('orgPhone').value.trim();
      organizer.Email = document.getElementById('orgEmail').value.trim();
    } else {
      organizer.Name = organizerInput.value.trim();
    }

    // --- Dates (first input for simplicity) ---
    const dateInput = document.getElementById('dateInputs')?.querySelector('input');
    const dateValue = dateInput ? dateInput.value : '';

    // --- File Upload ---
    const fileInput = document.getElementById('fileInput');
    let imageUrl = '';
    // if (fileInput?.files.length) {
    //   const file = fileInput.files[0];
    //   const formData = new FormData();
    //   formData.append('file', file);

    //   try {
    //     const uploadResponse = await fetch('https://your-cloudflare-r2-endpoint/upload', {
    //       method: 'POST',
    //       body: formData
    //     });
    //     const uploadData = await uploadResponse.json();
    //     imageUrl = uploadData.url;
    //   } catch(err) {
    //     console.error(err);
    //     alert('Image upload failed');
    //     return;
    //   }
    // }

    // --- Build JSON ---
    const eventData = {
      eventName: title,
      eventDate: dateValue,
      eventDescription: description,
      eventLocation_Name: location,
      eventLongitude: parseFloat(lng),
      eventLatitude: parseFloat(lat),
      eventCategory: category,
      eventType: type,
      eventAudience: audience,
      eventPrice: price,
      eventDuration: vipDuration ? parseInt(vipDuration) : null,
      eventImage: imageUrl,
      eventWebsite: document.getElementById('website').value.trim(),
      eventOrganizer: organizer
    };

    console.log("Event JSON:", eventData);

    // --- Send to backend ---
    try {
      const response = await fetch('https://thessivity.onrender.com/createEvent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });

      const result = await response.json();
      alert(result.success ? "Event submitted!" : "Submission failed!");
    } catch(err) {
      console.error(err);
      alert("Submission error");
    }
    closeLoadingSpinner();

  });
}

// -------------------- Main Initialization --------------------
async function initForm() {
  buildSelectHTML('vipDurationContainer', 'vipDuration', vipDurationOptions);
  buildSelectHTML('categoryContainer', 'category', categoryOptions);
  buildSelectHTML('typeContainer', 'type', typeOptions);
  buildSelectHTML('audienceContainer', 'audience', audienceOptions);

  initVIPToggle();
  initOrganizerToggle();
  initDatePickers();
  initFileInput();
  initNumberValidation();
  closeLoadingSpinner();
  initLangListeners();
  initFormSubmission(quill);
}

// -------------------- DOM Ready --------------------
document.addEventListener('DOMContentLoaded', async () => {
  quill = initQuillEditor(); // assign to global
  await initForm();
  console.log('Form initialized successfully');
});
