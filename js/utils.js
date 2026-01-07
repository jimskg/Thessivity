// Helper to parse a single date in format DD-MM-YYYY
  function parseDate(d) {
    const [day, month, year] = d.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // Helper to format a date
  function formatDate(d) {
    return d.toLocaleDateString(currentLanguage, {day: 'numeric', month: 'short', year: 'numeric'});
  }

  function normalizeI18n(text) {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '')
      .toLowerCase();
  }

  function normalizeTonesLowerCase(text) {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  function getValidImage(url, fallbackImage) {
    return new Promise((resolve) => {
      if (!url) {
        resolve(fallbackImage);
        return;
      }

      const testImg = new Image();
      testImg.onload = () => resolve(url);
      testImg.onerror = () => resolve(fallbackImage);
      testImg.src = url;
    });
  }

  function getGoogleAPI(){
    return "AIzaSyDuJGX7mZ45UxWwctaRSfa6LNq7qPM7_fM";
  }

  function getCurrentDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '-' + mm + '-' + yyyy;
    return today;
  }
