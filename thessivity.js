(function ($) {
  $(function () {

    let currentLanguage = 'gr';
    let breakIfDownForMaintenance = false;
    let testEnvironment = window.location.href.includes('Thessivity/index.html');
    let outputData = {};
    const apiKey = 'AIzaSyDuJGX7mZ45UxWwctaRSfa6LNq7qPM7_fM'; // Your API key from Google Developer Console
    //https://console.cloud.google.com/apis/credentials?inv=1&invt=AbxvKg&project=thessivity //jimskgg@gmail.com 
    const sheetId = '1LPjh1COe8CRUiLgGqf2wQA64IbOx4q2vuZcTJtwATFs'; // Google Sheet ID
    //https://drive.google.com/drive/folders/1Firv30_I1x6b5ENz3MLu31ZxpDNLcTdE

    
    async function fetchSheetData(sheetId, apiKey) {
      try {
        // Define the gids for each sheet (Category, Products, Translations)
        const gids = {
          First: '413577439'
        };
    
        // Create an object to store the categories, products, and translations
        const categories = [];
        const products = [];
        const translations = { 
          gr: { categories: {}, offers: {}, products: {}, offerProducts: {} }, 
          en: { categories: {}, offers: {}, products: {}, offerProducts: {} } 
        };
        const offers = [];
        const offerProducts = [];

        // Fetch data for Categories, Products, and Translations sheets
        for (let sheetName in gids) {
          if (breakIfDownForMaintenance) break;
          const gid = gids[sheetName];
          const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

          const response = await fetch(sheetUrl);
          const json = await response.json();

          // Skip headers by starting from the second row
          const rows = json.values.slice(1);
          // Process each sheet based on its name (maintenance, categories, products, translations)
          if (sheetName === "First") {
            rows.forEach(row => {
              const [value] = row; // Map columns based on the sheet structure
              console.log('dimitris2: ' + value);
                if (testEnvironment){
                  console.log('here');
                }
            });
          }
        }
        
      } catch (error) {
        console.log('error: ' + error);
      }
    }

    fetchSheetData(sheetId, apiKey);

    var slidePosition = 1;
    const events = [
      { id:"event--1", name: '', title:"", date: "", photo: "", text: "" },
      { id:"event-0", name: '', title:"", date: "2023", photo: "", text: "" },
      { id:"event-1", name: 'Bucharest', title:"Bucharest", date: "June", photo: "images/Bucharest.jpg", text: "Here, I got to know you 😊" },
      { id:"event-2", name: 'Corfu', title:"Corfu", date: "August", photo: "images/Corfu.jpg", text: "And here, I understood you 😇" },
      { id:"event-3", name: 'Crete', title:"Crete", date: "August", photo: "images/Crete.jpg", text: "Well here, I enjoyed every moment with you 😁" },
      { id:"event-4", name: 'Patras', title:"Patras", date: "October", photo: "images/Patra.jpg", text: "Let\'s not talk about this one 😅" },
      { id:"event-5", name: 'Bratislava', title:"Bratislava", date: "October", photo: "images/Bratislava.jpg", text: "Here, I loved you ❤️" },
      { id:"event-6", name: 'Paris', title:"Paris", date: "December", photo: "images/Paris.jpg", text: "Here, I fell in love with you 😍" },
      { id:"event-7", name: '', title:"", date: "", photo: "", text: "" },
      { id:"event-8", name: '', title:"", date: "2024", photo: "", text: "" },
      { id:"event-9", name: 'Strasbourg', title:"Strasbourg", date: "February", photo: "images/Strasbourg.jpg", text: "Heeeere, I felt lucky that I have you 🤞" },
      { id:"event-10", name: 'Budapest', title:"Budapest", date: "March", photo: "images/Budapest.jpg", text: "Here, I appreciated everything that you are doing for me 🤗" },
      { id:"event-11", name: 'Barcelona / Sevilla', title:"Barcelona / Sevilla", date: "May", photo: "images/BarcelonaSevilla.jpg", text: "Here, I felt like we were \"Ohana\" 👩‍❤️‍💋‍👨. Ohana means family and we are doing everything for our family" },
      { id:"event-12", name: 'Valletta / Mdina', title:"Valletta / Mdina", date: "July", photo: "images/VallettaMdina.jpg", text: "It was just a weekend, but you made it feel like a real vacation 🏝" },
      { id:"event-13", name: 'Skopelos', title:"Skopelos", date: "August", photo: "images/Skopelos.jpg", text: "Sometimes we have our ups and downs, but we will get through everything together 🤜🤛" },
      { id:"event-14", name: 'NOT THE END 😁', title:"NOT THE END", date: "December", photo: "images/theend.jpg", text: "We all make mistakes and take some things for granted, but there are some people who are worth fighting for 💪" },
      { id:"event-15", name: 'Warsaw / Kraków / Gdańsk', title:"Warsaw / Kraków / Gdańsk", date: "April", photo: "images/WarsawKrakowGdansk.jpg", text: "Here, everything felt better, even with both of us a little sick 🤒" },
    ];

    const slidesCarousel = new Map([
      ["event-1", [{title: "", imageSrc: "images/Bucharest1.jpg", caption: ""},
                  {title: "", imageSrc: "images/Bucharest2.jpg", caption: ""},
                  {title: "", imageSrc: "images/Bucharest3.jpg", caption: ""},
                  {title: "", imageSrc: "images/Bucharest4.jpg", caption: ""},
                  {title: "", imageSrc: "images/Bucharest5.jpg", caption: ""}]],
      ["event-2", [{title: "", imageSrc: "images/Corfu1.jpg", caption: ""},
                  {title: "", imageSrc: "images/Corfu2.jpg", caption: ""},
                  {title: "", imageSrc: "images/Corfu3.jpg", caption: ""},
                  {title: "", imageSrc: "images/Corfu4.jpg", caption: ""},
                  {title: "", imageSrc: "images/Corfu5.jpg", caption: ""},
                  {title: "", imageSrc: "images/Corfu6.jpg", caption: ""}]],
      ["event-3", [{title: "", imageSrc: "images/Crete1.jpg", caption: ""},
                  {title: "", imageSrc: "images/Crete2.jpg", caption: ""},
                  {title: "", imageSrc: "images/Crete3.jpg", caption: ""},
                  {title: "", imageSrc: "images/Crete4.jpg", caption: ""},
                  {title: "", imageSrc: "images/Crete5.jpg", caption: ""}]],
      ["event-4", [{title: "", imageSrc: "images/Patra1.jpg", caption: ""},
                  {title: "", imageSrc: "images/Patra2.jpg", caption: ""},
                  {title: "", imageSrc: "images/Patra3.jpg", caption: ""},
                  {title: "", imageSrc: "images/Patra4.jpg", caption: ""},
                  {title: "", imageSrc: "images/Patra5.jpg", caption: ""}]],
      ["event-5", [{title: "", imageSrc: "images/Bratislava1.jpg", caption: ""},
                  {title: "", imageSrc: "images/Bratislava2.jpg", caption: ""},
                  {title: "", imageSrc: "images/Bratislava3.jpg", caption: ""},
                  {title: "", imageSrc: "images/Bratislava4.jpg", caption: ""},
                  {title: "", imageSrc: "images/Bratislava5.jpg", caption: ""},
                  {title: "", imageSrc: "images/Bratislava6.jpg", caption: ""},
                  {title: "", imageSrc: "images/Bratislava7.jpg", caption: ""},
                  {title: "", imageSrc: "images/Bratislava8.jpg", caption: ""},
                  {title: "", imageSrc: "images/Bratislava9.jpg", caption: ""},
                  {title: "", imageSrc: "images/Bratislava10.jpg", caption: ""}]],
      ["event-6", [{title: "", imageSrc: "images/Paris1.jpg", caption: ""},
                  {title: "", imageSrc: "images/Paris2.jpg", caption: ""},
                  {title: "", imageSrc: "images/Paris3.jpg", caption: ""},
                  {title: "", imageSrc: "images/Paris4.jpg", caption: ""},
                  {title: "", imageSrc: "images/Paris5.jpg", caption: ""},
                  {title: "", imageSrc: "images/Paris6.jpg", caption: ""},
                  {title: "", imageSrc: "images/Paris7.jpg", caption: ""},
                  {title: "", imageSrc: "images/Paris8.jpg", caption: ""},
                  {title: "", imageSrc: "images/Paris9.jpg", caption: ""},
                  {title: "", imageSrc: "images/Paris10.jpg", caption: ""},
                  {title: "", imageSrc: "images/Paris11.jpg", caption: ""},
                  {title: "", imageSrc: "images/Paris12.jpg", caption: ""},
                  {title: "", imageSrc: "images/Paris13.jpg", caption: ""},
                  {title: "", imageSrc: "images/Paris14.jpg", caption: ""},
                  {title: "", imageSrc: "images/Paris15.jpg", caption: ""},
                  {title: "", imageSrc: "images/Paris16.jpg", caption: ""},
                  {title: "", imageSrc: "images/Paris17.jpg", caption: ""},
                  {title: "", imageSrc: "images/Paris18.jpg", caption: ""},
                  {title: "", imageSrc: "images/Paris19.jpg", caption: ""}]],
      ["event-9", [{title: "", imageSrc: "images/Strasbourg1.jpg", caption: ""},
                  {title: "", imageSrc: "images/Strasbourg2.jpg", caption: ""},
                  {title: "", imageSrc: "images/Strasbourg3.jpg", caption: ""},
                  {title: "", imageSrc: "images/Strasbourg4.jpg", caption: ""},
                  {title: "", imageSrc: "images/Strasbourg5.jpg", caption: ""},
                  {title: "", imageSrc: "images/Strasbourg6.jpg", caption: ""},
                  {title: "", imageSrc: "images/Strasbourg7.jpg", caption: ""},
                  {title: "", imageSrc: "images/Strasbourg8.jpg", caption: ""},
                  {title: "", imageSrc: "images/Strasbourg9.jpg", caption: ""}]],
      ["event-10", [{title: "", imageSrc: "images/Budapest1.jpg", caption: ""},
                  {title: "", imageSrc: "images/Budapest2.jpg", caption: ""},
                  {title: "", imageSrc: "images/Budapest3.jpg", caption: ""},
                  {title: "", imageSrc: "images/Budapest4.jpg", caption: ""},
                  {title: "", imageSrc: "images/Budapest5.jpg", caption: ""},
                  {title: "", imageSrc: "images/Budapest6.jpg", caption: ""},
                  {title: "", imageSrc: "images/Budapest7.jpg", caption: ""},
                  {title: "", imageSrc: "images/Budapest8.jpg", caption: ""},
                  {title: "", imageSrc: "images/Budapest9.jpg", caption: ""},
                  {title: "", imageSrc: "images/Budapest10.jpg", caption: ""},
                  {title: "", imageSrc: "images/Budapest11.jpg", caption: ""},
                  {title: "", imageSrc: "images/Budapest12.jpg", caption: ""},
                  {title: "", imageSrc: "images/Budapest13.jpg", caption: ""},
                  {title: "", imageSrc: "images/Budapest14.jpg", caption: ""},
                  {title: "", imageSrc: "images/Budapest15.jpg", caption: ""},
                  {title: "", imageSrc: "images/Budapest16.jpg", caption: ""},
                  {title: "", imageSrc: "images/Budapest17.jpg", caption: ""},
                  {title: "", imageSrc: "images/Budapest18.jpg", caption: ""},
                  {title: "", imageSrc: "images/Budapest19.jpg", caption: ""}]],
      ["event-11", [{title: "", imageSrc: "images/BarcelonaSevilla1.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla2.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla3.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla4.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla5.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla6.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla7.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla8.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla9.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla10.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla11.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla12.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla13.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla14.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla15.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla16.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla17.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla18.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla19.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla20.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla21.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla22.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla23.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla24.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla25.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla26.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla27.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla28.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla29.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla30.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla31.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla32.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla33.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla34.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla35.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla36.jpg", caption: ""},
                  {title: "", imageSrc: "images/BarcelonaSevilla37.jpg", caption: ""},]],
      ["event-12", [{title: "", imageSrc: "images/VallettaMdina1.jpg", caption: ""},
                  {title: "", imageSrc: "images/VallettaMdina2.jpg", caption: ""},
                  {title: "", imageSrc: "images/VallettaMdina3.jpg", caption: ""},
                  {title: "", imageSrc: "images/VallettaMdina4.jpg", caption: ""},
                  {title: "", imageSrc: "images/VallettaMdina5.jpg", caption: ""},
                  {title: "", imageSrc: "images/VallettaMdina6.jpg", caption: ""},
                  {title: "", imageSrc: "images/VallettaMdina7.jpg", caption: ""},
                  {title: "", imageSrc: "images/VallettaMdina8.jpg", caption: ""},
                  {title: "", imageSrc: "images/VallettaMdina9.jpg", caption: ""},
                  {title: "", imageSrc: "images/VallettaMdina10.jpg", caption: ""},
                  {title: "", imageSrc: "images/VallettaMdina11.jpg", caption: ""}]],
      ["event-13", [{title: "", imageSrc: "images/Skopelos1.jpg", caption: ""},
                    {title: "", imageSrc: "images/Skopelos2.jpg", caption: ""},
                    {title: "", imageSrc: "images/Skopelos3.jpg", caption: ""},
                    {title: "", imageSrc: "images/Skopelos4.jpg", caption: ""},
                    {title: "", imageSrc: "images/Skopelos5.jpg", caption: ""},
                    {title: "", imageSrc: "images/Skopelos6.jpg", caption: ""},
                    {title: "", imageSrc: "images/Skopelos7.jpg", caption: ""},
                    {title: "", imageSrc: "images/Skopelos8.jpg", caption: ""},
                    {title: "", imageSrc: "images/Skopelos9.jpg", caption: ""},
                    {title: "", imageSrc: "images/Skopelos10.jpg", caption: ""},
                    {title: "", imageSrc: "images/Skopelos11.jpg", caption: ""},
                    {title: "", imageSrc: "images/Skopelos12.jpg", caption: ""}]],
      ["event-14", [{title: "", imageSrc: "videos/theendvideo.mp4", caption: ""},
                      {title: "", imageSrc: "images/theend1.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend2.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend3.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend4.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend5.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend6.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend7.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend8.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend9.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend10.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend11.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend12.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend13.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend14.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend15.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend16.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend17.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend18.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend19.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend20.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend21.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend22.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend23.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend24.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend25.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend26.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend27.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend28.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend29.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend30.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend31.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend32.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend33.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend34.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend35.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend36.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend37.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend38.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend39.jpg", caption: ""},
                      {title: "", imageSrc: "images/theend40.jpg", caption: ""}]],
      ["event-15", [{title: "", imageSrc: "images/WarsawKrakowGdansk1.jpg", caption: ""},
                      {title: "", imageSrc: "images/WarsawKrakowGdansk2.jpg", caption: ""},
                      {title: "", imageSrc: "images/WarsawKrakowGdansk3.jpg", caption: ""},
                      {title: "", imageSrc: "images/WarsawKrakowGdansk4.jpg", caption: ""},
                      {title: "", imageSrc: "images/WarsawKrakowGdansk5.jpg", caption: ""},
                      {title: "", imageSrc: "images/WarsawKrakowGdansk6.jpg", caption: ""},
                      {title: "", imageSrc: "images/WarsawKrakowGdansk7.jpg", caption: ""},
                      {title: "", imageSrc: "images/WarsawKrakowGdansk8.jpg", caption: ""},
                      {title: "", imageSrc: "images/WarsawKrakowGdansk9.jpg", caption: ""},
                      {title: "", imageSrc: "images/WarsawKrakowGdansk10.jpg", caption: ""},
                      {title: "", imageSrc: "images/WarsawKrakowGdansk11.jpg", caption: ""},
                      {title: "", imageSrc: "images/WarsawKrakowGdansk12.jpg", caption: ""},
                      {title: "", imageSrc: "images/WarsawKrakowGdansk13.jpg", caption: ""},
                      {title: "", imageSrc: "images/WarsawKrakowGdansk14.jpg", caption: ""}]],
    ]);

    createEvents();
    createDots();
    //fadeAway();

    function createDots(){
      const dotSpinners = document.getElementsByClassName('dot-spinner');
      for (element of dotSpinners) {
        const numberOfDots = 12;
        for (let i = 0; i < numberOfDots; i++) {
          const dot = document.createElement('div');
          dot.style.animationDelay = `-${i / numberOfDots}s`;
          dot.style.top = `${Math.sin((i / numberOfDots) * Math.PI * 2) * 40 + 50}%`;
          dot.style.left = `${Math.cos((i / numberOfDots) * Math.PI * 2) * 40 + 50}%`;
          element.appendChild(dot);
        }
      }
      
    }
    
    function createEvents() {
      let timeline = document.getElementById('content-events-id');
      let counter = 1;
      events.forEach(event => {
        let yearFlag = (event.date ==  "2023" || event.date == "2024") ? true : false;
        let skipFlag = (event.date == "") ? true : false;
        var timelineItem = document.createElement('div');
        timelineItem.className = yearFlag ? 'js-timeline_item ag-timeline_item-year' : 'js-timeline_item ag-timeline_item';
        if (skipFlag) timelineItem.className = "";

        var cardBox = document.createElement('div');
        cardBox.className = yearFlag ? 'ag-timeline-card_box-year' : 'ag-timeline-card_box';
        if (skipFlag) {
          cardBox.style.opacity = "0";
          cardBox.className = "";
        }
        
        var pointBox = document.createElement('div');
        pointBox.className = yearFlag ? 'js-timeline-card_point-box ag-timeline-card_point-box-year' : 'js-timeline-card_point-box ag-timeline-card_point-box';
        if (skipFlag) pointBox.className = "";

        var point = document.createElement('div');
        point.className = 'ag-timeline-card_point';
        point.textContent = event.date;
        if (skipFlag) point.className = "";

        var metaBox = document.createElement('div');
        metaBox.className = 'ag-timeline-card_meta-box';

        var meta = document.createElement('div');
        meta.className = 'ag-timeline-card_meta';
        meta.textContent = event.name;

        var cardItem = document.createElement('div');
        cardItem.className = 'ag-timeline-card_item';

        var cardInner = document.createElement('div');
        cardInner.className = 'ag-timeline-card_inner';

        var imgBox = document.createElement('div');
        imgBox.className = 'ag-timeline-card_img-box';
        imgBox.id = event.id;
        imgBox.onclick = function() { 
          parentPhotoElement = document.getElementById(event.id);
          createCarousel(parentPhotoElement.id);
          SlideShow(slidePosition);
        };

        var img = document.createElement('img');
        img.src = event.photo;
        img.className = 'ag-timeline-card_img';
        img.width = '640';
        img.height = '360';

        var imgEmptyDiv = document.createElement('div');
        imgEmptyDiv.className = 'dot-spinner';
        imgEmptyDiv.id = 'dotSpinner';
        
        var info = document.createElement('div');
        info.className = 'ag-timeline-card_info';

        var cardTitle = document.createElement('div');
        cardTitle.className = 'ag-timeline-card_title';
        cardTitle.textContent = event.title;

        var cardDesc = document.createElement('div');
        cardDesc.className = 'ag-timeline-card_desc';
        cardDesc.textContent = event.text;

        var arrow = document.createElement('div');
        arrow.className = 'ag-timeline-card_arrow';

        // Append elements to the DOM

        pointBox.appendChild(point);
        metaBox.appendChild(meta);
        if (counter%2==1){
          cardBox.appendChild(pointBox);
          cardBox.appendChild(metaBox);
        } else {
          cardBox.appendChild(metaBox);
          cardBox.appendChild(pointBox);
        }

        if (event.photo != null && event.photo != ''){
          imgBox.appendChild(img);
        } else {
          imgBox.appendChild(imgEmptyDiv);
        }
        info.appendChild(cardTitle);
        info.appendChild(cardDesc);

        cardInner.appendChild(imgBox);
        cardInner.appendChild(info);

        cardItem.appendChild(cardInner);
        cardItem.appendChild(arrow);
        
        timelineItem.appendChild(cardBox);

        if (!yearFlag && !skipFlag){
          timelineItem.appendChild(cardItem);
        }
        timeline.appendChild(timelineItem);
        if (!yearFlag && !skipFlag) counter++;
      });
    }

    $(window).on('scroll', function () {
      if (!isMobile()){
        fnOnScroll();
      }
    });

    $(document.body).on('touchmove', function () {
      if (isMobile()){
        fnOnScroll();
      }
    });

    function isMobile() {
      return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
    }


    $(window).on('resize', function () {
      fnOnResize();
    });

    var agTimeline = $('.js-timeline'),
      agTimelineLine = $('.js-timeline_line'),
      agTimelineLineProgress = $('.js-timeline_line-progress'),
      agTimelinePoint = $('.js-timeline-card_point-box'),
      agTimelineItem = $('.js-timeline_item'),
      agOuterHeight = $(window).outerHeight(),
      agHeight = $(window).height(),
      f = -1,
      agFlag = false;
 

    function fnOnScroll() {
      agPosY = $(window).scrollTop();

      fnUpdateFrame();
    }

    function fnOnResize() {
      agPosY = $(window).scrollTop();
      agHeight = $(window).height();

      fnUpdateFrame();
    }

    function fnUpdateWindow() {
      agFlag = false;

      agTimelineLine.css({
        top: agTimelineItem.first().find(agTimelinePoint).offset().top - agTimelineItem.first().offset().top,
        bottom: agTimeline.offset().top + agTimeline.outerHeight() - agTimelineItem.last().find(agTimelinePoint).offset().top
      });

      f !== agPosY && (f = agPosY, agHeight, fnUpdateProgress());
    }

    function fnUpdateProgress() {
      var agTop = agTimelineItem.last().find(agTimelinePoint).offset().top;

      i = agTop + agPosY - $(window).scrollTop();
      a = agTimelineLineProgress.offset().top + agPosY - $(window).scrollTop();
      n = agPosY - a + agOuterHeight / 2;
      i <= agPosY + agOuterHeight / 2 && (n = i - a);
      agTimelineLineProgress.css({height: n + "px"});

      agTimelineItem.each(function () {
        var agTop = $(this).find(agTimelinePoint).offset().top;

        (agTop + agPosY - $(window).scrollTop()) < agPosY + .5 * agOuterHeight ? $(this).addClass('js-ag-active') : $(this).removeClass('js-ag-active');
      })
    }

    function fnUpdateFrame() {
      agFlag || requestAnimationFrame(fnUpdateWindow);
      agFlag = true;
    }

    function navigateTo(tabId, buttonId) {
      const tabs = document.getElementsByClassName('tab');
      const buttons = document.getElementsByClassName('nav-item');
      // for (currentButtons of buttons) {
      //   currentButtons.style.display = 'none';
      //   // if (buttonId == 'birthday-id-li' && currentButtons.id == 'site-id-li'){
      //   //   currentButtons.style.display = 'block';
      //   // }
      //   if (currentButtons.id == buttonId){
      //     currentButtons.style.display = 'block';
      //   }
      // }
      for (currentButtons of buttons) {
        if (buttonId == 'back-id-li'){
          if (currentButtons.id == 'back-id-li') currentButtons.style.display = 'block';
          else currentButtons.style.display = 'none';
        } else {
          if (currentButtons.id == 'back-id-li') currentButtons.style.display = 'none';
          else currentButtons.style.display = 'block';
        }
      }

      for (currentTab of tabs) {
        currentTab.style.display = 'none';
        if (currentTab.id == tabId){
           if (currentTab.id == 'birthday-id') currentTab.style.display = 'flex';
           else currentTab.style.display = 'block';
        }
      }
    }
  
    $('#back-id-button').on('click', function () {
      navigateTo('timeline-id', 'birthday-id-li');
    });

    $('#birthday-id-button').on('click', function () {
      navigateTo('birthday-id', 'back-id-li'); 
    });

    $('#chat-id-button').on('click', function () {
      navigateTo('chat-id', 'back-id-li'); 
    });
    
    function togglePasswordVisibility() {
      const passwordInput = document.getElementById('password');
      const showPasswordBtn = document.getElementById('show-password-button-id');
      const enteredPassword = passwordInput.value;
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        showPasswordBtn.textContent = '🙉';
      } else {
        passwordInput.type = 'password';
        showPasswordBtn.textContent = '🙈';
      }
    }

    $('#check-password-button-id').on('click', function(){
      const passwordInput = document.getElementById('password');
      const showPasswordBtn = document.getElementById('show-password-button-id');
      const enteredPassword = passwordInput.value;
      var now = new Date().getTime();
      var distance = endDate - now;
      let cleanedEnteredPassword = enteredPassword.replaceAll(' ','');

      if (distance < 0 && (cleanedEnteredPassword.toLowerCase() == 'loveyou3000' || cleanedEnteredPassword.toLowerCase() == 'iloveyou3000')){
        //navigateTo('map-id', 'back-id-li'); 
        window.open('https://jimskg.github.io/menu/', '_blank')
        passwordInput.value = '';
      } else {
        passwordInput.classList.add('shake');
        showPasswordBtn.classList.add('shake');
        setTimeout(() => {
          passwordInput.classList.remove('shake');
          showPasswordBtn.classList.remove('shake');
        }, 500);
      }
    });

    // $('#excited-button-id').on('click', function(){
    //   window.open('https://jimskg.github.io/menu/', '_blank')
    // });

    $('#show-password-button-id').on('click', function () {
      togglePasswordVisibility();
    });

    function SlideShow(n) {
      var i;
      var slides = document.getElementsByClassName("Containers");
      var circles = document.getElementsByClassName("dots");
      if (n > slides.length) {slidePosition = 1}
      if (n < 1) {slidePosition = slides.length}
      for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
          if (slides[i].innerHTML.includes('.mp4')){
            const parser = new DOMParser();
            const doc = parser.parseFromString(slides[i].innerHTML, 'text/html');
            const videoElement = doc.querySelector('video');
            const videoId = videoElement.id;
            var video = document.getElementById(videoId); 
            video.pause();
          }
      }
      for (i = 0; i < circles.length; i++) {
          circles[i].className = circles[i].className.replace(" enable", "");
      }
      slides[slidePosition-1].style.display = "block";
      circles[slidePosition-1].className += " enable";
    } 

    function createCarousel(parentPhotoId){
      slidePosition = 1;
      const modalDiv = document.createElement('div');
      modalDiv.id = 'carousel-modal-id';
      modalDiv.classList.add('carousel-modal');

      // Create the modal content div
      const modalContentDiv = document.createElement('div');
      modalContentDiv.className = 'carousel-modal-content ag-carousel-modal-content-left';

      var slideshowContainer = document.createElement("div");
      slideshowContainer.className = "slideshow-container fade";

      var dotsDiv = document.createElement("div");
      dotsDiv.className = "dots-div";

      // Define slide data
      let slides = slidesCarousel.get(parentPhotoId);

      // Create slides dynamically
      slides.forEach(function (slide, index) {
        var container = document.createElement("div");
        container.className = "Containers fade";

        var title = document.createElement("div");
        title.className = "info";
        title.textContent = slide.title;

        var image;
        if (slide.imageSrc.includes('mp4')){
          image = document.createElement("div");
          image.className = 'img-carousel-video-box';
          image.innerHTML =  `
              <video id="${slide.imageSrc}" controls autoplay style="width:100%; height:100%; object-fit:cover;" >
                <source src="${slide.imageSrc}" type="video/mp4">
              </video> `;
        } else {
          image = document.createElement("img");
          image.src = slide.imageSrc;
          image.className = 'img-carousel-box';
        }

        var caption = document.createElement("div");
        caption.className = "caption-info";
        caption.textContent = slide.caption;

        container.appendChild(title);
        container.appendChild(image);
        container.appendChild(caption);

        slideshowContainer.appendChild(container);

        // Create dot dynamically
        var dot = document.createElement("span");
        dot.className = "dots";
        dot.id = "currentSlide" + (index + 1);
        dot.onclick = function() { 
          SlideShow(slidePosition = index + 1);
        };

        // Append dot to the dots container
        dotsDiv.appendChild(dot);
      });

      // Create Prev and Next buttons
      var backButton = document.createElement("a");
      backButton.className = "Back";
      backButton.id = "backSlide";
      backButton.innerHTML = "&#10094;";
      backButton.onclick = function() { 
        SlideShow(slidePosition += -1);
      };

      var forwardButton = document.createElement("a");
      forwardButton.className = "forward";
      forwardButton.id = "frontSlide";
      forwardButton.innerHTML = "&#10095;";
      forwardButton.onclick = function() { 
        SlideShow(slidePosition += 1);
      };

      slideshowContainer.appendChild(backButton);
      slideshowContainer.appendChild(forwardButton);

      modalContentDiv.appendChild(slideshowContainer);
      modalContentDiv.appendChild(dotsDiv);
      modalDiv.appendChild(modalContentDiv);

      // Append the slideshow container to the body
      document.body.appendChild(modalDiv);
    }

    document.addEventListener('keydown', function(event) {
      let carouselElement = document.getElementById("carousel-modal-id");
      if (carouselElement){
        switch (event.keyCode) {
          case 37:
              SlideShow(slidePosition += -1);
              break;
          case 39:
              SlideShow(slidePosition += +1);
              break;
        }
      }
    });
    
  });

  
  window.onclick = function(event) {
    var carouselModal = document.getElementById("carousel-modal-id");
    if (event.target == carouselModal) {
      carouselModal.remove();
      //carouselModal.style.display = "none";
    }
  } 
  
  function createConfetti(duration) {
    const confettiContainer = document.querySelector('#confetti-container');
    let confettiInterval;  // Declare a variable to store the interval ID
  
    const showConfetti = () => {
      const confetti = document.createElement('div');
      confetti.textContent = '🎉';
      confetti.classList.add('confetti');
      confetti.style.left = Math.random() * innerWidth + 'px';
      confettiContainer.appendChild(confetti);
  
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    };
  
    // Start the interval and store its ID in confettiInterval
    confettiInterval = setInterval(() => {
      showConfetti();
    }, 400);
  
    // Stop the interval after the specified duration
    setTimeout(() => {
      clearInterval(confettiInterval);
    }, duration);
  }

  // Set the date we're counting down to
  var endDate = new Date("Jan 1, 2025 00:00:00").getTime();
  // var endDate = new Date("Feb 6, 2023 00:00:00").getTime();
  
  var x = setInterval(function() {
      var now = new Date().getTime();
      var distance = endDate - now;
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      document.getElementById("days-id").innerHTML = days == 1 ? "DAY" : "DAYS";
      document.getElementById("daysNum").innerHTML = ("0" + days).slice(-2);  
      document.getElementById("hoursNum").innerHTML = ("0" + hours).slice(-2);
      document.getElementById("minsNum").innerHTML = ("0" + minutes).slice(-2);
      document.getElementById("secsNum").innerHTML = ("0" + seconds).slice(-2);
      if (distance < 0) {
          clearInterval(x);
          document.getElementById("daysNum").innerHTML = "00";  
          document.getElementById("hoursNum").innerHTML = "00";  
          document.getElementById("minsNum").innerHTML = "00";  
          document.getElementById("secsNum").innerHTML = "00";
          createConfetti(20000);
      }
  }, 1000);

  // function fadeAway() {
  //   const startDate = new Date('2024-12-19');
  //   const endDate = new Date('2025-02-19');
  //   const today = new Date();

  //   // Calculate progress
  //   const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
  //   const elapsedDays = (today - startDate) / (1000 * 60 * 60 * 24);
  //   const progress = Math.min(1, elapsedDays / totalDays); // Clamp between 0 and 1

  //   const body = document.body;
  //   const loadingBar = document.getElementById('loading-bar');

  //   // Update loading bar width
  //   loadingBar.style.width = `${progress * 100}%`;

  //   // Update opacity
  //   body.style.opacity = 1 - progress;
  // }
  
})(jQuery);
