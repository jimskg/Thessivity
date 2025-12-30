document.addEventListener("DOMContentLoaded", async function () {
  
  const urlParams = new URLSearchParams(window.location.search);
  const pageId = urlParams.get('page');
  const divToShow = document.getElementById(pageId);
  if (divToShow){
    divToShow.classList.remove('hidden');
  } else {
    document.getElementById('test').classList.remove('hidden');
  }
  openHomeBody();
  closeLoadingSpinner();
  
});
