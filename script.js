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
  // 3. FŐOLDAL: TEVÉKENYSÉGEK KÉPCSERÉLŐJE (A és B verzió)
  // =========================================

  // --- "A" VERZIÓ ---
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

  // --- "B" VERZIÓ (ÚJ) ---
  const tevekenysegElemekB = document.querySelectorAll(".tevekenyseg-elem-b");
  const tevekenysegKepekB = document.querySelectorAll(".tevekenyseg-kep-b");

  if (tevekenysegElemekB.length > 0 && tevekenysegKepekB.length > 0) {
    tevekenysegElemekB.forEach(function (elem) {
      ["mouseenter", "click", "touchstart"].forEach(function (esemeny) {
        elem.addEventListener(esemeny, function (e) {
          if (esemeny === "touchstart") e.preventDefault();

          tevekenysegElemekB.forEach((el) =>
            el.classList.remove("aktiv-elem-b"),
          );
          tevekenysegKepekB.forEach((kep) =>
            kep.classList.remove("aktiv-kep-b"),
          );

          this.classList.add("aktiv-elem-b");
          const kepId = this.getAttribute("data-kep");
          const aktivKep = document.querySelector(
            `.tevekenyseg-kep-b[data-kep="${kepId}"]`,
          );

          if (aktivKep) aktivKep.classList.add("aktiv-kep-b");
        });
      });
    });
  }

  // =========================================
  // 4. MUNKÁINK: AUTOMATIKUS SZŰRŐ MOTOR
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

    projektKartyak.forEach((kartya) => {
      const badgeElem = kartya.querySelector(".kartya-badge");
      const tipus = badgeElem ? badgeElem.textContent : "";
      const ev = kartya.getAttribute("data-ev");
      const helyszin = kartya.getAttribute("data-helyszin");

      if (tipus && tipus.trim() !== "") tipusokHalmaza.add(tipus.trim());
      if (ev && ev.trim() !== "") evekHalmaza.add(ev.trim());
      if (helyszin && helyszin.trim() !== "")
        helyszinekHalmaza.add(helyszin.trim());
    });

    tipusSelect.innerHTML = '<option value="osszes">Összes típus</option>';
    Array.from(tipusokHalmaza)
      .sort()
      .forEach((tipus) => {
        const opcio = document.createElement("option");
        opcio.value = tipus;
        opcio.textContent = tipus;
        tipusSelect.appendChild(opcio);
      });

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
  // 6. TÖBB LEGÖRDÜLŐ MENÜ KEZELÉSE
  // =========================================
  const lenyiloTarolok = document.querySelectorAll(".lenyilomenu-tarolo");

  if (lenyiloTarolok.length > 0) {
    lenyiloTarolok.forEach((tarolo) => {
      const lenyiloGomb = tarolo.querySelector(".lenyilo-gomb");

      if (lenyiloGomb) {
        lenyiloGomb.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();

          lenyiloTarolok.forEach((masikTarolo) => {
            if (masikTarolo !== tarolo) {
              masikTarolo.classList.remove("kattintva");
            }
          });

          tarolo.classList.toggle("kattintva");
        });
      }
    });

    document.addEventListener("click", function (e) {
      lenyiloTarolok.forEach((tarolo) => {
        if (!tarolo.contains(e.target)) {
          tarolo.classList.remove("kattintva");
        }
      });
    });
  }

  // =========================================
  // 7. SÜTI (COOKIE) KEZELŐ
  // =========================================
  const sutiSav = document.getElementById("suti-sav");
  const sutiElfogad = document.getElementById("suti-elfogad-gomb");
  const sutiAlap = document.getElementById("suti-alap-gomb");
  const sutiMegnyito = document.getElementById("suti-megnyito");

  if (sutiSav) {
    if (!localStorage.getItem("karolyhazSutiKezeles")) {
      setTimeout(() => {
        sutiSav.classList.add("lathato");
        sutiSav.classList.remove("rejtett");
      }, 1500);
    }

    if (sutiElfogad) {
      sutiElfogad.addEventListener("click", function () {
        localStorage.setItem("karolyhazSutiKezeles", "minden_elfogadva");
        sutiSav.classList.remove("lathato");
      });
    }

    if (sutiAlap) {
      sutiAlap.addEventListener("click", function () {
        localStorage.setItem("karolyhazSutiKezeles", "csak_alap");
        sutiSav.classList.remove("lathato");
      });
    }

    if (sutiMegnyito) {
      sutiMegnyito.addEventListener("click", function (e) {
        e.preventDefault();
        sutiSav.classList.add("lathato");
      });
    }
  }
});

// =========================================
// OKOS MENÜ (Felfelé görgetésre előcsúszik)
// =========================================
document.addEventListener("DOMContentLoaded", function () {
  const fejlec = document.querySelector(".fejlec");
  if (!fejlec) return;

  let utolsoGorgetes = window.pageYOffset || document.documentElement.scrollTop;

  window.addEventListener("scroll", function () {
    const aktualisGorgetes =
      window.pageYOffset || document.documentElement.scrollTop;

    if (fejlec.classList.contains("mobil-nyitva")) return;

    if (aktualisGorgetes > 50) {
      fejlec.classList.add("gorgetve");
    } else {
      fejlec.classList.remove("gorgetve");
    }

    if (aktualisGorgetes > utolsoGorgetes && aktualisGorgetes > 100) {
      fejlec.classList.add("rejtve");
    } else if (aktualisGorgetes < utolsoGorgetes) {
      fejlec.classList.remove("rejtve");
    }

    utolsoGorgetes = aktualisGorgetes;
  });
});

// =========================================
// ANIMÁCIÓK MEGJELENÍTÉSE (Intersection Observer)
// =========================================
document.addEventListener("DOMContentLoaded", function () {
  const megfigyelo = new IntersectionObserver(
    (bejegyzesek) => {
      bejegyzesek.forEach((bejegyzes) => {
        if (bejegyzes.isIntersecting) {
          bejegyzes.target.classList.add("megjelent");
        }
      });
    },
    { threshold: 0.2 },
  );

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
          const animacioHossz = 2000;
          let kezdoIdo = null;

          const frissitSzamlalo = (aktualisIdo) => {
            if (!kezdoIdo) kezdoIdo = aktualisIdo;
            const elteltIdo = aktualisIdo - kezdoIdo;
            const haladas = Math.min(elteltIdo / animacioHossz, 1);
            const lassuloHaladas = haladas * (2 - haladas);

            szamlalo.innerText = Math.floor(lassuloHaladas * celSzam);

            if (haladas < 1) {
              requestAnimationFrame(frissitSzamlalo);
            } else {
              szamlalo.innerText = celSzam;
            }
          };

          requestAnimationFrame(frissitSzamlalo);
          figyelo.unobserve(szamlalo);
        }
      });
    },
    { threshold: 0.1 },
  );

  szamlalok.forEach((sz) => szamlaloFigyelo.observe(sz));
});

// =========================================================
// KÖZPONTI PROJEKT MODAL & TÉRKÉP RENDSZER
// =========================================================
document.addEventListener("DOMContentLoaded", function () {
  // 1. MODAL MEGNYITÁSA ÉS SLIDER FELTÖLTÉSE
  function nyisdMegAProjektModalt(kartya) {
    const pModal = document.getElementById("projekt-modal");
    if (!pModal) return;

    const cim = kartya.querySelector("h3")
      ? kartya.querySelector("h3").textContent
      : "";
    const badge = kartya.querySelector(".kartya-badge")
      ? kartya.querySelector(".kartya-badge").textContent
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
      if (alapKep && alapKep !== "") kepek.push(alapKep);
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

    const track = document.getElementById("modal-kep-track");
    let jelenlegiKepIndex = 0;

    if (track) {
      track.innerHTML = "";
      track.style.display = "flex";
      track.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";

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

      ujElozo.style.display = kepek.length > 1 ? "flex" : "none";
      ujKovetkezo.style.display = kepek.length > 1 ? "flex" : "none";

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

    pModal.classList.remove("rejtett");
    setTimeout(() => {
      pModal.classList.add("aktiv");
    }, 10);
  }

  function bezarProjektModalt() {
    const pModal = document.getElementById("projekt-modal");
    if (pModal) {
      pModal.classList.remove("aktiv");
      setTimeout(() => {
        pModal.classList.add("rejtett");
      }, 300);
    }
  }

  // 2. NORMÁL KÁRTYÁK RÁKÖTÉSE
  const osszesOldaliKartya = document.querySelectorAll(".projekt-kartya");
  osszesOldaliKartya.forEach((kartya) => {
    const gomb = kartya.querySelector(".reszletek-gomb");
    if (gomb) {
      gomb.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        nyisdMegAProjektModalt(kartya);
      });
    }
  });

  const pModal = document.getElementById("projekt-modal");
  const pModalBezar = document.getElementById("modal-bezaras");

  if (pModal) {
    if (pModalBezar) {
      pModalBezar.addEventListener("click", bezarProjektModalt);
    }
    pModal.addEventListener("click", (e) => {
      if (e.target === pModal) bezarProjektModalt();
    });
  }

  // 3. TÉRKÉP MOTOR
  const terkepTarolo = document.getElementById("terkep-pontok-tarolo");
  const kategoriaSzuro = document.getElementById("terkep-kategoria");

  if (!terkepTarolo || osszesOldaliKartya.length === 0) return;

  const varosKoordinatak = {
    Budapest: { top: 38.5, left: 47.0 },
    Jászberény: { top: 41.0, left: 56.5 },
    Szolnok: { top: 49.2, left: 61.8 },
    Tiszapüspöki: { top: 45.5, left: 65.5 },
    Fegyvernek: { top: 41.2, left: 68.3 },
    Zamárdi: { top: 60, left: 28.65 },
    Nyárlőrinc: { top: 59.3, left: 56 },
    Mezőtúr: { top: 55, left: 67.6 },
    Tiszanána: { top: 34.9, left: 67 },
    Rákóczifalva: { top: 51.5, left: 62.5 },
    Cserkeszőlő: { top: 59.5, left: 61.3 },
    Kisújszállás: { top: 47.2, left: 72.7 },
    Szajol: { top: 48.7, left: 65.1 },
    Törökszentmiklós: { top: 48.5, left: 67.3 },
    Tiszafüred: { top: 34, left: 69.7 },
    Visonta: { top: 29, left: 60 },
    Abony: { top: 47.4, left: 57.3 },
    Nagyhegyes: { top: 33.5, left: 80.6 },
    Csömör: { top: 38.4, left: 47.1 },
    Mogyoród: { top: 35.5, left: 47.9 },
    Pilis: { top: 44.5, left: 52.4 },
    Gyömrő: { top: 40.3, left: 51.1 },
    Őrbottyán: { top: 31.9, left: 48.5 },
    Újhartyán: { top: 47.4, left: 49.2 },
    Karcag: { top: 45.2, left: 76.5 },
    Szada: { top: 34.3, left: 49.5 },
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

        pont.style.zIndex = statisztika[varosNev].darab + 10;

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

            const triggereles = (e) => {
              e.preventDefault();
              e.stopPropagation();
              nyisdMegAProjektModalt(klonKartya);
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

  // =========================================================
  // 4. PRÉMIUM GOOGLE MAPS MOTOR (GOMBOS ZOOM)
  // =========================================================
  {
    const mapTaroloDiv = document.querySelector(".terkep-gorgeto");
    const mapHatterDiv = document.getElementById("magyarorszag-terkep");

    // Zoom Gombok
    const zoomInGomb = document.getElementById("zoom-in");
    const zoomOutGomb = document.getElementById("zoom-out");

    if (mapTaroloDiv && mapHatterDiv) {
      let jelenlegiZoom = 1;
      let dinamikusMinZoom = 1;
      const MAX_ZOOM = 4.5;
      const ZOOM_LEPES = 0.3; // Ennyivel nagyít a gomb kattintásonként

      const alkalmazZoom = () => {
        const aktualisSzelesseg = jelenlegiZoom * 1000;
        const aktualisMagassag = jelenlegiZoom * 600;

        mapHatterDiv.style.width = aktualisSzelesseg + "px";
        mapHatterDiv.style.minWidth = aktualisSzelesseg + "px";
        mapHatterDiv.style.maxWidth = aktualisSzelesseg + "px";

        mapHatterDiv.style.height = aktualisMagassag + "px";
        mapHatterDiv.style.minHeight = aktualisMagassag + "px";
        mapHatterDiv.style.maxHeight = aktualisMagassag + "px";

        mapHatterDiv.style.margin = "0px";

        const ZONA_HATAR = 1.8;
        if (jelenlegiZoom >= ZONA_HATAR) {
          mapHatterDiv.classList.add("reszletes-nezet");
          mapHatterDiv.classList.remove("zona-nezet");
        } else {
          mapHatterDiv.classList.add("zona-nezet");
          mapHatterDiv.classList.remove("reszletes-nezet");
        }
      };

      const initTerkepMeret = () => {
        const taroloSzelesseg = mapTaroloDiv.clientWidth;
        const taroloMagassag = mapTaroloDiv.clientHeight;

        if (taroloSzelesseg === 0 || taroloMagassag === 0) {
          setTimeout(initTerkepMeret, 50);
          return;
        }

        const zoomX = taroloSzelesseg / 1000;
        const zoomY = taroloMagassag / 600;

        dinamikusMinZoom = Math.min(zoomX, zoomY);
        jelenlegiZoom = Math.max(
          dinamikusMinZoom,
          Math.min(jelenlegiZoom, MAX_ZOOM),
        );
        alkalmazZoom();
      };

      // Felesleges másolatok törölve
      initTerkepMeret();
      window.addEventListener("resize", initTerkepMeret);

      // --- ZOOM GOMBOK ESEMÉNYEI (A képernyő közepe felé nagyítanak) ---
      function gombZoom(irany) {
        const regiZoom = jelenlegiZoom;
        if (irany === "be") {
          jelenlegiZoom += ZOOM_LEPES;
        } else {
          jelenlegiZoom -= ZOOM_LEPES;
        }

        jelenlegiZoom = Math.max(
          dinamikusMinZoom,
          Math.min(jelenlegiZoom, MAX_ZOOM),
        );

        if (regiZoom !== jelenlegiZoom) {
          // Kiszámítjuk a képernyő (konténer) mértani közepét
          const rect = mapTaroloDiv.getBoundingClientRect();
          const kozepX = rect.width / 2;
          const kozepY = rect.height / 2;

          // A térkép pontos közepe görgetéssel együtt
          const mapX = kozepX + mapTaroloDiv.scrollLeft;
          const mapY = kozepY + mapTaroloDiv.scrollTop;
          const arany = jelenlegiZoom / regiZoom;

          alkalmazZoom();

          // Pontosan középre fókuszálva görgetjük vissza
          mapTaroloDiv.scrollLeft = mapX * arany - kozepX;
          mapTaroloDiv.scrollTop = mapY * arany - kozepY;
        }
      }

      if (zoomInGomb)
        zoomInGomb.addEventListener("click", () => gombZoom("be"));
      if (zoomOutGomb)
        zoomOutGomb.addEventListener("click", () => gombZoom("ki"));

      // --- EGÉRREL TÖRTÉNŐ HÚZÁS (Görgős zoom eltávolítva) ---
      let egerLentVan = false;
      let kezdoX, kezdoY, gorgetesBal, gorgetesFent;

      mapTaroloDiv.addEventListener("mousedown", (e) => {
        egerLentVan = true;
        mapTaroloDiv.classList.add("huzas-aktiv");
        kezdoX = e.pageX - mapTaroloDiv.offsetLeft;
        kezdoY = e.pageY - mapTaroloDiv.offsetTop;
        gorgetesBal = mapTaroloDiv.scrollLeft;
        gorgetesFent = mapTaroloDiv.scrollTop;
      });
      mapTaroloDiv.addEventListener("mouseleave", () => {
        egerLentVan = false;
        mapTaroloDiv.classList.remove("huzas-aktiv");
      });
      mapTaroloDiv.addEventListener("mouseup", () => {
        egerLentVan = false;
        mapTaroloDiv.classList.remove("huzas-aktiv");
      });
      mapTaroloDiv.addEventListener("mousemove", (e) => {
        if (!egerLentVan) return;
        e.preventDefault();
        const x = e.pageX - mapTaroloDiv.offsetLeft;
        const y = e.pageY - mapTaroloDiv.offsetTop;
        mapTaroloDiv.scrollLeft = gorgetesBal - (x - kezdoX) * 1.5;
        mapTaroloDiv.scrollTop = gorgetesFent - (y - kezdoY) * 1.5;
      });

      // --- MOBIL KÉT UJJAS ZOOM (Érintőképernyőre meghagyva) ---
      let elozoTavolsag = 0;
      let elozoFokuszX = 0;
      let elozoFokuszY = 0;

      mapTaroloDiv.addEventListener(
        "touchstart",
        (e) => {
          if (e.touches.length === 2) {
            e.preventDefault();
            elozoTavolsag = Math.hypot(
              e.touches[0].pageX - e.touches[1].pageX,
              e.touches[0].pageY - e.touches[1].pageY,
            );
            const rect = mapTaroloDiv.getBoundingClientRect();
            elozoFokuszX =
              (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
            elozoFokuszY =
              (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
          }
        },
        { passive: false },
      );

      mapTaroloDiv.addEventListener(
        "touchmove",
        (e) => {
          if (e.touches.length === 2) {
            e.preventDefault();
            const rect = mapTaroloDiv.getBoundingClientRect();
            const ujTavolsag = Math.hypot(
              e.touches[0].pageX - e.touches[1].pageX,
              e.touches[0].pageY - e.touches[1].pageY,
            );
            const ujFokuszX =
              (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
            const ujFokuszY =
              (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;

            mapTaroloDiv.scrollLeft -= ujFokuszX - elozoFokuszX;
            mapTaroloDiv.scrollTop -= ujFokuszY - elozoFokuszY;

            const regiZoom = jelenlegiZoom;
            jelenlegiZoom = regiZoom * (ujTavolsag / elozoTavolsag);
            jelenlegiZoom = Math.max(
              dinamikusMinZoom,
              Math.min(jelenlegiZoom, MAX_ZOOM),
            );

            if (regiZoom !== jelenlegiZoom) {
              const mapX = ujFokuszX + mapTaroloDiv.scrollLeft;
              const mapY = ujFokuszY + mapTaroloDiv.scrollTop;
              const arany = jelenlegiZoom / regiZoom;
              alkalmazZoom();
              mapTaroloDiv.scrollLeft = mapX * arany - ujFokuszX;
              mapTaroloDiv.scrollTop = mapY * arany - ujFokuszY;
            }
            elozoTavolsag = ujTavolsag;
            elozoFokuszX = ujFokuszX;
            elozoFokuszY = ujFokuszY;
          }
        },
        { passive: false },
      );
    }
  }
});
