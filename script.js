document.addEventListener("DOMContentLoaded", function () {
  /* FOOLDAL KEPCSERELO */

  const kepek = document.querySelectorAll(".kep-slide");

  if (kepek.length >= 2) {
    let aktualisKep = 0;

    function kepCsere() {
      kepek[aktualisKep].classList.remove("aktiv");
      aktualisKep = (aktualisKep + 1) % kepek.length;
      kepek[aktualisKep].classList.add("aktiv");
    }

    setInterval(kepCsere, 4000);
  }

  /* FOOLDAL TEVEKENYSEGEK KEPCSERELO */
  const tevekenysegElemek = document.querySelectorAll(".tevekenyseg-elem");
  const tevekenysegKepek = document.querySelectorAll(".tevekenyseg-kep");

  if (tevekenysegElemek.length > 0 && tevekenysegKepek.length > 0) {
    tevekenysegElemek.forEach(function (elem) {
      // Egér rávinny, kattintás vagy mobilos érintés események
      ["mouseenter", "click", "touchstart"].forEach(function (esemeny) {
        elem.addEventListener(esemeny, function (e) {
          if (esemeny === "touchstart") {
            e.preventDefault();
          }

          tevekenysegElemek.keys().forEach((i) => {
            tevekenysegElemek[i].classList.remove("aktiv-elem");
          });
          tevekenysegKepek.forEach(function (kep) {
            kep.classList.remove("aktiv-kep");
          });

          this.classList.add("aktiv-elem");
          const kepId = this.getAttribute("data-kep");

          const aktivKep = document.querySelector(
            `.tevekenyseg-kep[data-kep="${kepId}"]`,
          );
          if (aktivKep) {
            aktivKep.classList.add("aktiv-kep");
          }
        });
      });
    });
  }

  /* LENYILÓ MENÜ */
  const lenyilomenuGomb = document.querySelector(".lenyilomenu");
  const fejlec = document.querySelector(".fejlec");

  if (lenyilomenuGomb && fejlec) {
    lenyilomenuGomb.addEventListener("click", function () {
      fejlec.classList.toggle("mobil-nyitva");
    });
  }

  // =========================================
  // FEJLETT KOMBINÁLT SZŰRŐ MOTOR (Munkáink)
  // =========================================
  const tipusSelect = document.getElementById("szuro-tipus");
  const evSelect = document.getElementById("szuro-ev");
  const helyszinSelect = document.getElementById("szuro-helyszin");
  const torlesGomb = document.getElementById("szuro-torles");
  const projektKartyak = document.querySelectorAll(".projekt-kartya");

  if (tipusSelect && evSelect && helyszinSelect && projektKartyak.length > 0) {
    function szuresFuttatasa() {
      const kivalasztottTipus = tipusSelect.value;
      const kivalasztottEv = evSelect.value;
      const kivalasztottHelyszin = helyszinSelect.value;

      projektKartyak.forEach(function (kartya) {
        const kartyaTipus = kartya.getAttribute("data-tipus");
        const kartyaEv = kartya.getAttribute("data-ev");
        const kartyaHelyszin = kartya.getAttribute("data-helyszin");

        // Feltételek vizsgálata (egyezik-e mindhárom szűrővel)
        const tipusEgyezik =
          kivalasztottTipus === "osszes" || kartyaTipus === kivalasztottTipus;
        const evEgyezik =
          kivalasztottEv === "osszes" || kartyaEv === kivalasztottEv;
        const helyszinEgyezik =
          kivalasztottHelyszin === "osszes" ||
          kartyaHelyszin === kivalasztottHelyszin;

        if (tipusEgyezik && evEgyezik && helyszinEgyezik) {
          kartya.classList.remove("rejtett");
        } else {
          kartya.classList.add("rejtett");
        }
      });
    }

    // Eseményfigyelők a legördülő menükre
    tipusSelect.addEventListener("change", szuresFuttatasa);
    evSelect.addEventListener("change", szuresFuttatasa);
    helyszinSelect.addEventListener("change", szuresFuttatasa);

    // Szűrők törlése gomb eseménye
    if (torlesGomb) {
      torlesGomb.addEventListener("click", function () {
        tipusSelect.value = "osszes";
        evSelect.value = "osszes";
        helyszinSelect.value = "osszes";
        szuresFuttatasa();
      });
    }
  }
});
