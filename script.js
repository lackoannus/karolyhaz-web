document.addEventListener("DOMContentLoaded", function () {
  // =========================================
  // 1. LENYILOMENU (Mobil menü)
  // =========================================
  const lenyilomenuGomb = document.querySelector(".lenyilomenu");
  const fejlec = document.querySelector(".fejlec");

  if (lenyilomenuGomb && fejlec) {
    lenyilomenuGomb.addEventListener("click", function () {
      fejlec.classList.toggle("mobil-nyitva");
    });
  }

  // =========================================
  // 2. FŐOLDALI KÉPCSERÉLŐ (HERO)
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
  // 3. FŐOLDAL: TEVÉKENYSÉGEK KÉPCSERÉLŐJE
  // =========================================
  const tevekenysegElemek = document.querySelectorAll(".tevekenyseg-elem");
  const tevekenysegKepek = document.querySelectorAll(".tevekenyseg-kep");

  if (tevekenysegElemek.length > 0 && tevekenysegKepek.length > 0) {
    tevekenysegElemek.forEach(function (elem) {
      ["mouseenter", "click", "touchstart"].forEach(function (esemeny) {
        elem.addEventListener(esemeny, function (e) {
          if (esemeny === "touchstart") e.preventDefault();

          tevekenysegElemek.forEach((el) => el.classList.remove("aktiv-elem"));
          tevekenysegKepek.forEach((kep) => kep.classList.remove("aktiv-kep"));

          this.classList.add("aktiv-elem");
          const kepId = this.getAttribute("data-kep");
          const aktivKep = document.querySelector(
            `.tevekenyseg-kep[data-kep="${kepId}"]`,
          );

          if (aktivKep) aktivKep.classList.add("aktiv-kep");
        });
      });
    });
  }

  // =========================================
  // 4. MUNKÁINK: AUTOMATIKUS SZŰRŐ MOTOR (Badge-alapú, ékezethelyes)
  // =========================================
  const tipusSelect = document.getElementById("szuro-tipus");
  const evSelect = document.getElementById("szuro-ev");
  const helyszinSelect = document.getElementById("szuro-helyszin");
  const torlesGomb = document.getElementById("szuro-torles");
  const projektKartyak = document.querySelectorAll(".projekt-kartya");

  if (tipusSelect && evSelect && helyszinSelect && projektKartyak.length > 0) {
    const tipusokHalmaza = new Set();
    const evekHalmaza = new Set();
    const helyszinekHalmaza = new Set();

    // Adatok kigyűjtése közvetlenül a kártyákról
    projektKartyak.forEach((kartya) => {
      // A típust mostantól a kártya látható badge-éből (címkéjéből) olvassuk ki!
      const badgeElem = kartya.querySelector(".kartya-badge");
      const tipus = badgeElem ? badgeElem.textContent : "";

      const ev = kartya.getAttribute("data-ev");
      const helyszin = kartya.getAttribute("data-helyszin");

      if (tipus && tipus.trim() !== "") tipusokHalmaza.add(tipus.trim());
      if (ev && ev.trim() !== "") evekHalmaza.add(ev.trim());
      if (helyszin && helyszin.trim() !== "")
        helyszinekHalmaza.add(helyszin.trim());
    });

    // 1. Típusok betöltése (Pontosan úgy, ahogy a kártyán ki van írva)
    tipusSelect.innerHTML = '<option value="osszes">Összes típus</option>';
    Array.from(tipusokHalmaza)
      .sort()
      .forEach((tipus) => {
        const opcio = document.createElement("option");
        opcio.value = tipus; // A szűréshez is ezt a pontos szöveget használjuk
        opcio.textContent = tipus;
        tipusSelect.appendChild(opcio);
      });

    // 2. Évek betöltése (Csökkenő sorrendben)
    evSelect.innerHTML = '<option value="osszes">Összes év</option>';
    Array.from(evekHalmaza)
      .sort()
      .reverse()
      .forEach((ev) => {
        const opcio = document.createElement("option");
        opcio.value = ev;
        opcio.textContent = ev;
        evSelect.appendChild(opcio);
      });

    // 3. Települések betöltése (ABC sorrendben)
    helyszinSelect.innerHTML =
      '<option value="osszes">Összes település</option>';
    Array.from(helyszinekHalmaza)
      .sort()
      .forEach((hely) => {
        const opcio = document.createElement("option");
        opcio.value = hely;
        opcio.textContent = hely;
        helyszinSelect.appendChild(opcio);
      });

    // Szűrési logika
    function szuresFuttatasa() {
      const kTipus = tipusSelect.value;
      const kEv = evSelect.value;
      const kHelyszin = helyszinSelect.value;

      projektKartyak.forEach(function (kartya) {
        const badgeElem = kartya.querySelector(".kartya-badge");
        const kTipusVal = badgeElem ? badgeElem.textContent.trim() : "";

        const kEvVal = kartya.getAttribute("data-ev") || "";
        const kHelyszinVal = kartya.getAttribute("data-helyszin") || "";

        const tipusEgyezik = kTipus === "osszes" || kTipusVal === kTipus;
        const evEgyezik = kEv === "osszes" || kEvVal === kEv;
        const helyszinEgyezik =
          kHelyszin === "osszes" || kHelyszinVal === kHelyszin;

        if (tipusEgyezik && evEgyezik && helyszinEgyezik) {
          kartya.classList.remove("rejtett");
        } else {
          kartya.classList.add("rejtett");
        }
      });
    }

    tipusSelect.addEventListener("change", szuresFuttatasa);
    evSelect.addEventListener("change", szuresFuttatasa);
    helyszinSelect.addEventListener("change", szuresFuttatasa);

    if (torlesGomb) {
      torlesGomb.addEventListener("click", function () {
        tipusSelect.value = "osszes";
        evSelect.value = "osszes";
        helyszinSelect.value = "osszes";
        szuresFuttatasa();
      });
    }
  }

  // =========================================
  // 5. MUNKÁINK: FELUGRÓ ABLAK (MODAL)
  // =========================================
  const modal = document.getElementById("projekt-modal");
  const modalBezaras = document.getElementById("modal-bezaras");

  if (modal && projektKartyak.length > 0) {
    projektKartyak.forEach(function (kartya) {
      kartya.addEventListener("click", function () {
        const hatterDiv = this.querySelector(".kartya-hatter");
        const hatterKep = hatterDiv ? hatterDiv.style.backgroundImage : "";

        const badge = this.querySelector(".kartya-badge");
        const badgeSzoveg = badge ? badge.innerText : "";

        const cim = this.querySelector("h3");
        const cimSzoveg = cim ? cim.innerText : "";

        const meta = this.querySelector(".kartya-meta");
        const metaSzoveg = meta ? meta.innerText : "";

        const reszletek = this.querySelector(".kartya-rejtett-reszletek");
        const reszletesLeiras = reszletek
          ? reszletek.innerHTML
          : "<p>Nincs további információ.</p>";

        document.getElementById("modal-kep").style.backgroundImage = hatterKep;

        const modalBadge = document.getElementById("modal-badge-szoveg");
        modalBadge.innerText = badgeSzoveg;
        modalBadge.className = "kartya-badge";
        modalBadge.style.position = "relative";
        modalBadge.style.top = "0";
        modalBadge.style.left = "0";

        document.getElementById("modal-cim").innerText = cimSzoveg;
        document.getElementById("modal-meta-szoveg").innerText = metaSzoveg;
        document.getElementById("modal-leiras").innerHTML = reszletesLeiras;

        modal.classList.add("aktiv");
      });
    });

    if (modalBezaras) {
      modalBezaras.addEventListener("click", function () {
        modal.classList.remove("aktiv");
      });
    }

    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.classList.remove("aktiv");
      }
    });
  }

  // =========================================
  // 6. CÉGINFORMÁCIÓK LEGÖRDÜLŐ MENÜ (Fixálva)
  // =========================================
  const lenyiloTarolo = document.querySelector(".lenyilomenu-tarolo");
  const lenyiloGomb = document.querySelector(".lenyilo-gomb");

  if (lenyiloGomb && lenyiloTarolo) {
    lenyiloGomb.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      lenyiloTarolo.classList.toggle("kattintva");
    });

    document.addEventListener("click", function (e) {
      if (!lenyiloTarolo.contains(e.target)) {
        lenyiloTarolo.classList.remove("kattintva");
      }
    });
  }
  // =========================================
  // 7. SÜTI (COOKIE) KEZELŐ
  // =========================================
  const sutiSav = document.getElementById("suti-sav");
  const sutiElfogad = document.getElementById("suti-elfogad-gomb");
  const sutiAlap = document.getElementById("suti-alap-gomb");

  // A lenyíló menüben lévő "Sütik beállítása" link megkeresése
  // Ehhez adj a HTML-ben a linknek egy id="suti-megnyito" azonosítót!
  const sutiMegnyito = document.getElementById("suti-megnyito");

  if (sutiSav) {
    // 1. Ellenőrizzük a böngésző memóriáját (ha nincs még elmentve döntés, megmutatjuk)
    if (!localStorage.getItem("karolyhazSutiKezeles")) {
      // Kis késleltetéssel úszik be, elegánsabb!
      setTimeout(() => {
        sutiSav.classList.add("lathato");
        sutiSav.classList.remove("rejtett");
      }, 1500);
    }

    // 2. Ha rányom, hogy "Mindent elfogadok"
    if (sutiElfogad) {
      sutiElfogad.addEventListener("click", function () {
        localStorage.setItem("karolyhazSutiKezeles", "minden_elfogadva");
        sutiSav.classList.remove("lathato");
        // Ide lehet majd betenni a Google Analytics indító kódját később!
      });
    }

    // 3. Ha rányom, hogy "Csak a szükségesek"
    if (sutiAlap) {
      sutiAlap.addEventListener("click", function () {
        localStorage.setItem("karolyhazSutiKezeles", "csak_alap");
        sutiSav.classList.remove("lathato");
      });
    }

    // 4. Bónusz: A lenyíló menüből bármikor újra megnyitható!
    if (sutiMegnyito) {
      sutiMegnyito.addEventListener("click", function (e) {
        e.preventDefault(); // Ne ugorjon új oldalra
        sutiSav.classList.add("lathato");
      });
    }
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const projektKartyak = document.querySelectorAll(".projekt-kartya");
  const modal = document.getElementById("projekt-modal");

  if (!modal || projektKartyak.length === 0) return;

  const modalBezaras = document.getElementById("modal-bezaras");
  const modalKepTrack = document.getElementById("modal-kep-track");
  const gombElozo = document.getElementById("modal-elozo");
  const gombKovetkezo = document.getElementById("modal-kovetkezo");

  let aktualisKepek = [];
  let aktualisKepIndex = 0;

  // A CSÚSZÁS MOTORJA
  function modalKepFrissit() {
    if (modalKepTrack) {
      // Eltoljuk a filmszalagot X * 100%-kal balra!
      modalKepTrack.style.transform = `translateX(-${aktualisKepIndex * 100}%)`;
    }

    if (aktualisKepek.length <= 1) {
      gombElozo.classList.add("rejtett");
      gombKovetkezo.classList.add("rejtett");
    } else {
      gombElozo.classList.remove("rejtett");
      gombKovetkezo.classList.remove("rejtett");
    }
  }

  projektKartyak.forEach(function (kartya) {
    kartya.addEventListener("click", function () {
      // 1. SZÖVEGEK KINYERÉSE
      const badgeSzoveg = this.querySelector(".kartya-badge")
        ? this.querySelector(".kartya-badge").innerText
        : "";
      const cimSzoveg = this.querySelector("h3")
        ? this.querySelector("h3").innerText
        : "";
      const metaSzoveg = this.querySelector(".kartya-meta")
        ? this.querySelector(".kartya-meta").innerText
        : "";
      const reszletesLeiras = this.querySelector(".kartya-rejtett-reszletek")
        ? this.querySelector(".kartya-rejtett-reszletek").innerHTML
        : "";

      const modalBadge = document.getElementById("modal-badge-szoveg");
      if (modalBadge) {
        modalBadge.innerText = badgeSzoveg;
        modalBadge.style.display = badgeSzoveg ? "inline-block" : "none";
      }
      if (document.getElementById("modal-cim"))
        document.getElementById("modal-cim").innerText = cimSzoveg;
      if (document.getElementById("modal-meta-szoveg"))
        document.getElementById("modal-meta-szoveg").innerText = metaSzoveg;
      if (document.getElementById("modal-leiras"))
        document.getElementById("modal-leiras").innerHTML = reszletesLeiras;

      // 2. KÉPEK KINYERÉSE
      const galeriaAdat = this.getAttribute("data-galeria");
      if (galeriaAdat) {
        aktualisKepek = galeriaAdat.split(",");
      } else {
        const hatterDiv = this.querySelector(".kartya-hatter");
        if (hatterDiv && hatterDiv.style.backgroundImage) {
          aktualisKepek = [
            hatterDiv.style.backgroundImage
              .replace(/^url\(["']?/, "")
              .replace(/["']?\)$/, ""),
          ];
        } else {
          aktualisKepek = [];
        }
      }

      // 3. A FILMSZALAG FELÉPÍTÉSE
      if (modalKepTrack) {
        modalKepTrack.innerHTML = ""; // Kipucoljuk a régi képeket
        aktualisKepek.forEach(function (kepUrl) {
          const slide = document.createElement("div");
          slide.className = "modal-kep-slide";
          slide.style.backgroundImage = `url('${kepUrl.trim()}')`;
          modalKepTrack.appendChild(slide);
        });
      }

      aktualisKepIndex = 0; // Mindig az első képpel nyitunk

      // Trükk: Kikapcsoljuk az animációt nyitáskor, hogy ne csússzon be furcsán a legelső kép
      modalKepTrack.style.transition = "none";
      modalKepFrissit();

      // 10 milliszekundum múlva visszakapcsoljuk az animációt a lapozáshoz
      setTimeout(() => {
        modalKepTrack.style.transition =
          "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      }, 10);

      modal.classList.add("aktiv");
    });
  });

  // JOBBRA LAPOZÁS
  if (gombKovetkezo) {
    gombKovetkezo.addEventListener("click", function (e) {
      e.stopPropagation();
      aktualisKepIndex = (aktualisKepIndex + 1) % aktualisKepek.length; // Végtelenítés (modulo matek)
      modalKepFrissit();
    });
  }

  // BALRA LAPOZÁS
  if (gombElozo) {
    gombElozo.addEventListener("click", function (e) {
      e.stopPropagation();
      aktualisKepIndex =
        (aktualisKepIndex - 1 + aktualisKepek.length) % aktualisKepek.length;
      modalKepFrissit();
    });
  }

  // BEZÁRÁS KATTINTÁSRA
  if (modalBezaras) {
    modalBezaras.addEventListener("click", function () {
      modal.classList.remove("aktiv");
    });
  }
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.remove("aktiv");
    }
  });
});
// =========================================
// OKOS MENÜ (Felfelé görgetésre előcsúszik)
// =========================================
document.addEventListener("DOMContentLoaded", function () {
  const fejlec = document.querySelector(".fejlec");

  // Ha véletlenül nincs fejléc az oldalon, ne csináljon semmit
  if (!fejlec) return;

  // Eltároljuk, hol voltunk legutóbb
  let utolsoGorgetes = window.pageYOffset || document.documentElement.scrollTop;

  window.addEventListener("scroll", function () {
    const aktualisGorgetes =
      window.pageYOffset || document.documentElement.scrollTop;

    // BIZTONSÁGI FÉK: Ha a mobil menü le van nyitva, tilos eltüntetni a fejlécet!
    if (fejlec.classList.contains("mobil-nyitva")) {
      return;
    }

    // 1. SÖTÉTÍTÉS: Ha lementünk legalább 50 pixelt, kapjon sötétebb hátteret a fejléc
    if (aktualisGorgetes > 50) {
      fejlec.classList.add("gorgetve");
    } else {
      fejlec.classList.remove("gorgetve");
    }

    // 2. ELTŰNÉS LEFELÉ: Ha lefelé görgetünk ÉS már lementünk legalább 100 pixelt
    if (aktualisGorgetes > utolsoGorgetes && aktualisGorgetes > 100) {
      fejlec.classList.add("rejtve");
    }
    // 3. ELŐBUKKANÁS FELFELÉ: Ha megindultunk visszafelé
    else if (aktualisGorgetes < utolsoGorgetes) {
      fejlec.classList.remove("rejtve");
    }

    // Frissítjük a pozíciót a következő lépéshez
    utolsoGorgetes = aktualisGorgetes;
  });
});
document.addEventListener("DOMContentLoaded", function () {
  // 1. Létrehozzuk a figyelőt
  const megfigyelo = new IntersectionObserver(
    (bejegyzesek) => {
      bejegyzesek.forEach((bejegyzes) => {
        // Ha az elem beér a képernyőre (legalább 20%-a látszik)
        if (bejegyzes.isIntersecting) {
          // Rátesszük a CSS-ben megírt .megjelent osztályt
          bejegyzes.target.classList.add("megjelent");

          // Opcionális: Ha azt akarod, hogy csak egyszer fusson le (ne ismétlődjön, ha fel-le görgetnek),
          // akkor vedd le a kommentet a következő sorról:
          // megfigyelo.unobserve(bejegyzes.target);
        }
      });
    },
    {
      threshold: 0.2, // Az elem 20%-ának látszódnia kell a képernyőn, hogy induljon
    },
  );

  // 2. Megkeressük az összes animálandó elemet az oldalon, és ráküldjük a figyelőt
  const animalandoElemek = document.querySelectorAll(
    ".animacio-balrol, .animacio-fade, .animacio-jobbrol, .animacio-jobbrol-alap, .animacio-alulrol",
  );
  animalandoElemek.forEach((elem) => {
    megfigyelo.observe(elem);
  });
});
// =========================================
// DINAMIKUS SZÁMLÁLÓ MOTOR (Lassuló Ease-Out verzió)
// =========================================
document.addEventListener("DOMContentLoaded", function () {
  const szamlalok = document.querySelectorAll(".stat-szam, .badge-szam");
  if (szamlalok.length === 0) return;

  const szamlaloFigyelo = new IntersectionObserver(
    (bejegyzesek, figyelo) => {
      bejegyzesek.forEach((bejegyzes) => {
        if (bejegyzes.isIntersecting) {
          const szamlalo = bejegyzes.target;

          if (szamlalo.classList.contains("befejezve")) return;
          szamlalo.classList.add("befejezve");

          const celSzam = parseInt(szamlalo.getAttribute("data-cel"), 10);

          // Az animáció hossza milliszekundumban (2000 = 2 másodperc)
          const animacioHossz = 2000;
          let kezdoIdo = null;

          const frissitSzamlalo = (aktualisIdo) => {
            if (!kezdoIdo) kezdoIdo = aktualisIdo;
            const elteltIdo = aktualisIdo - kezdoIdo;

            // Kiszámoljuk, hol tartunk az időben 0.0 és 1.0 között
            const haladas = Math.min(elteltIdo / animacioHossz, 1);

            // A "Varázslat": Ease-Out matematikai képlet, amitől a végén lelassul
            const lassuloHaladas = haladas * (2 - haladas);

            // Kiszámoljuk és kiírjuk a pillanatnyi értéket
            szamlalo.innerText = Math.floor(lassuloHaladas * celSzam);

            if (haladas < 1) {
              // Ha még nem telt le a 2 másodperc, kérjük a következő képkockát
              requestAnimationFrame(frissitSzamlalo);
            } else {
              // A legvégén kőbe véssük a pontos célszámot
              szamlalo.innerText = celSzam;
            }
          };

          // Elindítjuk a hardveresen gyorsított animációt
          requestAnimationFrame(frissitSzamlalo);

          figyelo.unobserve(szamlalo);
        }
      });
    },
    {
      threshold: 0.1,
    },
  );

  szamlalok.forEach((sz) => szamlaloFigyelo.observe(sz));
});
// =========================================================
// KÖZPONTI PROJEKT MODAL & TÉRKÉP RENDSZER
// =========================================================
document.addEventListener("DOMContentLoaded", function () {
  // =========================================================
  // 1. MODAL MEGNYITÁSA ÉS SLIDER FELTÖLTÉSE
  // =========================================================
  function nyisdMegAProjektModalt(kartya) {
    const pModal = document.getElementById("projekt-modal");
    if (!pModal) return;

    const cim = kartya.querySelector("h3")
      ? kartya.querySelector("h3").innerText
      : "";
    const badge = kartya.querySelector(".kartya-badge")
      ? kartya.querySelector(".kartya-badge").innerText
      : "";
    const meta = kartya.querySelector(".kartya-meta")
      ? kartya.querySelector(".kartya-meta").innerHTML
      : "";
    const leiras = kartya.querySelector(".kartya-rejtett-reszletek")
      ? kartya.querySelector(".kartya-rejtett-reszletek").innerHTML
      : "";

    let kepek = [];
    const hatter = kartya.querySelector(".kartya-hatter");
    if (hatter && hatter.style.backgroundImage) {
      let alapKep = hatter.style.backgroundImage
        .slice(4, -1)
        .replace(/["']/g, "");
      if (alapKep) kepek.push(alapKep);
    }
    const galeriaAttr = kartya.getAttribute("data-galeria");
    if (galeriaAttr) {
      const galeriaKepek = galeriaAttr
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k !== "");
      kepek = kepek.concat(galeriaKepek);
    }

    const modalCim = document.getElementById("modal-cim");
    const modalBadge = document.getElementById("modal-badge-szoveg");
    const modalMeta = document.getElementById("modal-meta-szoveg");
    const modalLeiras = document.getElementById("modal-leiras");

    if (modalCim) modalCim.innerText = cim;
    if (modalMeta) modalMeta.innerHTML = meta;
    if (modalLeiras) modalLeiras.innerHTML = leiras;
    if (modalBadge) {
      modalBadge.innerText = badge;
      modalBadge.style.display = badge ? "inline-block" : "none";
    }

    // Slider mechanika
    const track = document.getElementById("modal-kep-track");
    let jelenlegiKepIndex = 0;

    if (track) {
      track.innerHTML = "";
      track.style.display = "flex";
      track.style.transition = "transform 0.3s ease-in-out";

      kepek.forEach((url) => {
        const img = document.createElement("img");
        img.src = url;
        img.style.width = "100%";
        img.style.flexShrink = "0";
        img.style.objectFit = "cover";
        track.appendChild(img);
      });
      track.style.transform = `translateX(0%)`;
    }

    const gombElozo = document.getElementById("modal-elozo");
    const gombKovetkezo = document.getElementById("modal-kovetkezo");

    if (gombElozo && gombKovetkezo && track) {
      const ujElozo = gombElozo.cloneNode(true);
      const ujKovetkezo = gombKovetkezo.cloneNode(true);
      gombElozo.parentNode.replaceChild(ujElozo, gombElozo);
      gombKovetkezo.parentNode.replaceChild(ujKovetkezo, gombKovetkezo);

      ujElozo.style.display = kepek.length > 1 ? "block" : "none";
      ujKovetkezo.style.display = kepek.length > 1 ? "block" : "none";

      ujKovetkezo.addEventListener("click", () => {
        if (jelenlegiKepIndex < kepek.length - 1) {
          jelenlegiKepIndex++;
          track.style.transform = `translateX(-${jelenlegiKepIndex * 100}%)`;
        }
      });

      ujElozo.addEventListener("click", () => {
        if (jelenlegiKepIndex > 0) {
          jelenlegiKepIndex--;
          track.style.transform = `translateX(-${jelenlegiKepIndex * 100}%)`;
        }
      });
    }

    // Modal megjelenítése a stílus felülírása nélkül
    pModal.classList.remove("rejtett");
    pModal.style.zIndex = "99999";
  }

  // =========================================================
  // 2. KÁRTYÁK RÁKÖTÉSE (A rejtetteket is beleértve)
  // =========================================================
  const osszesOldaliKartya = document.querySelectorAll(".projekt-kartya");
  osszesOldaliKartya.forEach((kartya) => {
    const gomb = kartya.querySelector(".reszletek-gomb");
    if (gomb) {
      gomb.addEventListener("click", (e) => {
        e.stopPropagation();
        nyisdMegAProjektModalt(kartya);
      });
    }
  });

  const pModal = document.getElementById("projekt-modal");
  const pModalBezar = document.getElementById("modal-bezaras");

  if (pModal) {
    if (pModalBezar) {
      pModalBezar.addEventListener("click", () => {
        pModal.classList.add("rejtett");
      });
    }
    pModal.addEventListener("click", (e) => {
      if (e.target === pModal) pModal.classList.add("rejtett");
    });
  }

  // =========================================================
  // 3. TÉRKÉP MOTOR
  // =========================================================
  const terkepTarolo = document.getElementById("terkep-pontok-tarolo");
  const kategoriaSzuro = document.getElementById("terkep-kategoria");

  // Ha nincs kártya és nincs térkép, ne csináljon semmit
  if (!terkepTarolo || osszesOldaliKartya.length === 0) return;

  const varosKoordinatak = {
    Szolnok: { top: 58, left: 63 },
    Budapest: { top: 40, left: 47 },
    Jászberény: { top: 45, left: 56 },
  };

  if (kategoriaSzuro) {
    const tipusok = new Set();
    osszesOldaliKartya.forEach((k) => {
      const badge = k.querySelector(".kartya-badge");
      if (badge) tipusok.add(badge.textContent.trim());
    });

    kategoriaSzuro.innerHTML = '<option value="osszes">Minden projekt</option>';
    Array.from(tipusok)
      .sort()
      .forEach((t) => {
        const opc = document.createElement("option");
        opc.value = t;
        opc.textContent = t;
        kategoriaSzuro.appendChild(opc);
      });
  }

  const vModal = document.getElementById("varos-modal");
  const vModalCim = document.getElementById("varos-modal-cim");
  const vModalLista = document.getElementById("varos-projekt-lista");
  const vModalBezar = document.querySelector(".varos-bezar");

  function terkepFrissitese() {
    const kategoria = kategoriaSzuro ? kategoriaSzuro.value : "osszes";
    terkepTarolo.innerHTML = "";
    let statisztika = {};

    osszesOldaliKartya.forEach((kartya) => {
      const hely = kartya.getAttribute("data-helyszin");
      const badge = kartya.querySelector(".kartya-badge");
      const tipus = badge ? badge.textContent.trim() : "";

      if (!hely) return;

      if (kategoria === "osszes" || tipus === kategoria) {
        if (!statisztika[hely]) {
          statisztika[hely] = { darab: 0, kartyak: [] };
        }
        statisztika[hely].darab++;
        statisztika[hely].kartyak.push(kartya);
      }
    });

    Object.keys(statisztika).forEach((varosNev) => {
      if (statisztika[varosNev].darab > 0 && varosKoordinatak[varosNev]) {
        const koord = varosKoordinatak[varosNev];

        const pont = document.createElement("div");
        pont.className = "terkep-pont";
        pont.style.top = koord.top + "%";
        pont.style.left = koord.left + "%";

        const szam = document.createElement("div");
        szam.className = "terkep-szam";
        szam.innerText = statisztika[varosNev].darab;
        pont.appendChild(szam);

        const cimke = document.createElement("div");
        cimke.className = "terkep-varos-nev";
        cimke.innerText = varosNev;
        pont.appendChild(cimke);

        pont.addEventListener("click", function () {
          vModalCim.innerText = `${varosNev} (${statisztika[varosNev].darab} projekt)`;
          vModalLista.innerHTML = "";

          statisztika[varosNev].kartyak.forEach((eredetiKartya) => {
            const klonKartya = eredetiKartya.cloneNode(true);
            klonKartya.classList.remove("rejtett");

            // Közvetlenül az eredeti kártyát küldjük a modalnak,
            // aminek a CSS/JS rétegződése már kényszeríti, hogy a város ablak felett nyíljon meg!
            const triggereles = (e) => {
              e.stopPropagation();
              nyisdMegAProjektModalt(eredetiKartya);
            };

            klonKartya.style.cursor = "pointer";
            klonKartya.addEventListener("click", triggereles);

            const klonGomb = klonKartya.querySelector(".reszletek-gomb");
            if (klonGomb) {
              klonGomb.addEventListener("click", triggereles);
            }

            vModalLista.appendChild(klonKartya);
          });

          vModal.classList.remove("rejtett");
        });

        terkepTarolo.appendChild(pont);
      }
    });
  }

  if (vModalBezar && vModal) {
    vModalBezar.addEventListener("click", () =>
      vModal.classList.add("rejtett"),
    );
    vModal.addEventListener("click", (e) => {
      if (e.target === vModal) vModal.classList.add("rejtett");
    });
  }

  if (kategoriaSzuro)
    kategoriaSzuro.addEventListener("change", terkepFrissitese);

  terkepFrissitese();
});
