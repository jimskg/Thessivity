// Helper to parse a single date in format DD-MM-YYYY
  function parseDate(d) {
    const [day, month, year] = d.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // Helper to format a date
  function formatDate(d) {
    return d.toLocaleDateString(currentLanguage, {day: 'numeric', month: 'short', year: 'numeric'});
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

  function getCurrentDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '-' + mm + '-' + yyyy;
    return today;
  }
