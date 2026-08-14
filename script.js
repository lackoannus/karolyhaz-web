document.addEventListener("DOMContentLoaded", function () {
  // =========================================
  // 1. FŐOLDALI KÉPCSERÉLŐ (HERO)
  // =========================================
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

  // =========================================
  // 2. INTERAKTÍV TEVÉKENYSÉG LISTA
  // =========================================
  const szolgaltatasElemek = document.querySelectorAll(".szolgaltatas-elem");
  const szolgaltatasKepek = document.querySelectorAll(".szolg-kep");

  if (szolgaltatasElemek.length > 0 && szolgaltatasKepek.length > 0) {
    szolgaltatasElemek.forEach(function (elem) {
      ["mouseenter", "click", "touchstart"].forEach(function (esemeny) {
        elem.addEventListener(esemeny, function (e) {
          if (esemeny === "touchstart") {
            e.preventDefault();
          }

          szolgaltatasElemek.forEach((e) => e.classList.remove("aktiv-elem"));
          szolgaltatasKepek.forEach((k) => k.classList.remove("aktiv-kep"));

          this.classList.add("aktiv-elem");

          const kepId = this.getAttribute("data-kep");
          const aktivKep = document.querySelector(
            `.szolg-kep[data-kep="${kepId}"]`,
          );

          if (aktivKep) {
            aktivKep.classList.add("aktiv-kep");
          }
        });
      });
    });
  }

  // =========================================
  // 3. MOBIL MENÜ (HAMBURGER) LOGIKÁJA
  // =========================================
  const lenyilomenuGomb = document.querySelector(".lenyilomenu");
  const fejlec = document.querySelector(".fejlec");

  if (lenyilomenuGomb && fejlec) {
    lenyilomenuGomb.addEventListener("click", function () {
      fejlec.classList.toggle("mobil-nyitva");
    });
  }
}); // <-- EZ ZÁRJA LE AZ EGÉSZET!
