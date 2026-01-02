document.addEventListener("DOMContentLoaded", async function () {
  
  const urlParams = new URLSearchParams(window.location.search);
  const pageId = urlParams.get('page');

  async function fetchSalesforceInfoData() {
    const response = await fetch(`https://thessivity.onrender.com/getInfo?lang=${currentLanguage}&page=${pageId}`);

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

  async function fetchGoogleSheetsInfoData() {
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
    
    openLoadingSpinner();
    /*
    const divToShow = document.getElementById(pageId);
    if (divToShow){
      divToShow.classList.remove('hidden');
    }
    */
    let data = databaseSource === 'SF' ? await fetchSalesforceInfoData() : await fetchGoogleSheetsInfoData();

    if (data.error == undefined){
      buildInfo(data);
    } else {
      buildErrorScreen(data.error);
    }

    openHomeBody();
    closeLoadingSpinner();
  } 

  await fetchData();

  function buildInfo(data){
    const infoBody = document.getElementById('info-body');
    infoBody.innerHTML = '';
    infoBody.classList.remove('hidden');
    const h1 = el('h1', 'info-main-title');
    const div = el('div', null);
    
    h1.innerHTML = data.Subject;
    div.innerHTML = data.HtmlValue
    infoBody.appendChild(h1);
    infoBody.appendChild(div);
  }

  function buildErrorScreen(errorMessage){
    const infoBody = document.getElementById('info-body');
    infoBody.innerHTML = '';
    infoBody.classList.remove('hidden');

    const errorContainer = el('div', 'error-container');
    const errorH2 = el('h2', 'description-main');
    errorH2.innerHTML = errorMessage;
    infoBody.appendChild(errorContainer);
    errorContainer.appendChild(errorH2);
  }
  
  document.getElementById('gr-li')?.addEventListener('click', () => {
      fetchData();
  });

  document.getElementById('en-li')?.addEventListener('click', () => {
      fetchData();
  });
  
  function el(tag, className, text, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    if (html !== undefined && html !== null) node.innerHTML = html;
    return node;
  }
  
});
