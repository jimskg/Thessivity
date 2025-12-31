const LABELS = {
  gr: {
    description: 'Περιγραφή',
    price: 'Τιμή',
    duration: 'Διάρκεια',
    people: 'Αριθμός Ατόμων',
    location: 'Τοποθεσία',
    organizer: 'Διοργανωτής',
    website: 'Ιστότοπος',
    usefulInfo: 'Χρήσιμες Πληροφορίες',
    stayConnected: 'Μείνετε Συνδεδεμένοι',
    phoneReservations: 'Τηλεφωνικές κρατήσεις',
    workingHours: 'Δευ - Παρ 10:00 - 18:00',
    ourLocation: 'Θεσσαλονίκη, Ελλάδα',
    information: 'Πληροφορίες',
    support: 'Υποστήριξη',
    privacyPolicy: 'Πολιτική Απορρήτου',
    accessibility: 'Δήλωση Προσβασιμότητας',
    terms: 'Όροι & Προϋποθέσεις',
    refund: 'Πολιτική Επιστροφών',
    country: 'Ελλάδα',
    address: 'Διεύθυνση',
    phone: 'Τηλέφωνο',
    email: 'E-mail',
    minutes: 'λεπτά',
    viewMore: 'Προβολή περισσότερων',
    showLess: 'Λιγότερα',
    homeTab: 'Αρχική',
    activitiesTab: 'Δραστηριότητες',
    grLanguage: 'Ελληνικά',
    enLanguage: 'Αγγλικά'

  },
  en: {
    description: 'Description',
    price: 'Price',
    duration: 'Duration',
    people: 'Number of People',
    location: 'Location',
    organizer: 'Organizer',
    website: 'Website',
    usefulInfo: 'Useful Information',
    stayConnected: 'Stay Connected',
    phoneReservations: 'Phone reservations',
    workingHours: 'Mon - Fri 10:00 - 18:00',
    ourLocation: 'Thessaloniki, Greece',
    information: 'Information',
    support: 'Support',
    privacyPolicy: 'Privacy Policy',
    accessibility: 'Accessibility Statement',
    terms: 'Terms & Conditions',
    refund: 'Refund Policy',
    country: 'Greece',
    address: 'Address',
    phone: 'Phone',
    email: 'Email',
    minutes: 'minutes',
    viewMore: 'View more',
    showLess: 'Show less',
    homeTab: 'Home',
    activitiesTab: 'Activities',
    grLanguage: 'Greek',
    enLanguage: 'English'
  }
};

// Current language, default to Greek
const DEFAULT_LANG = 'gr';
let currentLanguage = localStorage.getItem('lang') || DEFAULT_LANG;
translatePage(currentLanguage);

// Translation function
function t(key) {
  return LABELS[currentLanguage]?.[key] || key;
}

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('lang', lang);
  translatePage(lang);
}

function translatePage(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
}