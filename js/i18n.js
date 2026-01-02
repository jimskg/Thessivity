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
    enLanguage: 'Αγγλικά',
    filterTagKids: 'Παιδιά',
    filterTagOffers: 'Προσφορές',
    filterTagFestivals: 'Φεστιβάλς',
    filterCategoryTitle: 'ΕΙΔΟΣ / ΚΑΤΗΓΟΡΙΑ',
    filterCategoryAll: 'Όλες',
    filterWhereTitle: 'ΠΟΥ',
    filterWhereEverywhere: 'Οπουδήποτε',
    filterWhenTitle: 'ΠΟΤΕ',
    filterWhenAnytime: 'Οποτεδήποτε',
    filterWhenToday: 'Σήμερα',
    filterWhenTomorrow: 'Αύριο',
    filterWhenWeekend: 'Το σαββατοκύριακο',
    filterWhenNextWeek: 'Την επόμενη εβδομάδα',
    filterWhenCustom: 'Συγκεκριμένο διάστημα',
    filterDescriptionActivities: 'Δραστηριότητες στη Θεσσαλονίκη',
    filterSearchPlaceholder: 'Αναζήτηση',
    sortedBy: 'Ταξινόμηση κατά:',
    sortedByDefault: 'Προεπιλογή',
    sortedByDate: 'Ηρεμονηνία',
    sortedByPopularity: 'Δημοτικότητα'

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
    enLanguage: 'English',
    filterTagKids: 'Kids',
    filterTagOffers: 'Offers',
    filterTagFestivals: 'Festivals',
    filterCategoryTitle: 'TYPE / CATEGORY',
    filterCategoryAll: 'Everything',
    filterWhereTitle: 'WHERE',
    filterWhereEverywhere: 'Everywhere',
    filterWhenTitle: 'WHEN',
    filterWhenAnytime: 'Anytime', 
    filterWhenToday: 'Today',
    filterWhenTomorrow: 'Tomorrow',
    filterWhenWeekend: 'This weekend',
    filterWhenNextWeek: 'Next week',
    filterWhenCustom: 'Custom',
    filterDescriptionActivities: 'Activities in Thessaloniki',
    filterSearchPlaceholder: 'Search',
    sortedBy: 'Sorted by:',
    sortedByDefault: 'Default',
    sortedByDate: 'Date',
    sortedByPopularity: 'Popularity'
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