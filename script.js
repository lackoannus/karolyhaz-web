// =========================================================
// GLOBÁLIS FÜGGVÉNYEK: MODAL ÉS LIGHTBOX (Mindenhonnan elérhető)
// =========================================================
let lightboxKepek = [];
let jelenlegiLightboxIndex = 0;

window.bezarProjektModalt = function () {
  const pModal = document.getElementById("projekt-modal");
  if (pModal) {
    pModal.classList.remove("aktiv");
    setTimeout(() => pModal.classList.add("rejtett"), 300);
  }
};

window.nyisdMegAProjektModalt = function (kartya) {
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

  let foKepUrl = "";
  const hatter = kartya.querySelector(".kartya-hatter");
  if (hatter && hatter.style.backgroundImage) {
    foKepUrl = hatter.style.backgroundImage.slice(4, -1).replace(/["']/g, "");
  }

  const kivitelezestAttr = kartya.getAttribute("data-kivitelezes");
  const keszAttr = kartya.getAttribute("data-kesz");
  const kivKepek = kivitelezestAttr
    ? kivitelezestAttr
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k !== "")
    : [];
  const keszKepek = keszAttr
    ? keszAttr
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k !== "")
    : [];

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
  let diakSzama = 0;

  if (track) {
    track.innerHTML = "";
    track.style.display = "flex";
    track.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
    track.style.transform = `translateX(0%)`;

    if (foKepUrl) {
      const dia1 = document.createElement("div");
      dia1.className = "modal-dia-blokk";
      dia1.innerHTML = `<img src="${foKepUrl}" class="modal-fokep">`;
      track.appendChild(dia1);
      diakSzama++;
    }

    if (kivKepek.length > 0) {
      const dia2 = document.createElement("div");
      dia2.className = "modal-dia-blokk";
      let gridHtml = `<h4 class="dia-cim">Kivitelezés közben</h4><div class="kep-racs-2x2">`;
      kivKepek.forEach((url, index) => {
        gridHtml += `<img src="${url}" class="racs-kep" onclick="window.nyisdMegALightboxot(${index}, this)">`;
      });
      gridHtml += `</div>`;
      dia2.innerHTML = gridHtml;
      dia2.dataset.kepek = JSON.stringify(kivKepek);
      track.appendChild(dia2);
      diakSzama++;
    }

    if (keszKepek.length > 0) {
      const dia3 = document.createElement("div");
      dia3.className = "modal-dia-blokk";
      let gridHtml = `<h4 class="dia-cim">Elkészült projekt</h4><div class="kep-racs-3x3">`;
      keszKepek.forEach((url, index) => {
        gridHtml += `<img src="${url}" class="racs-kep" onclick="window.nyisdMegALightboxot(${index}, this)">`;
      });
      gridHtml += `</div>`;
      dia3.innerHTML = gridHtml;
      dia3.dataset.kepek = JSON.stringify(keszKepek);
      track.appendChild(dia3);
      diakSzama++;
    }
  }

  let jelenlegiDiaIndex = 0;
  const gombElozo = document.getElementById("modal-elozo");
  const gombKovetkezo = document.getElementById("modal-kovetkezo");

  if (gombElozo && gombKovetkezo && track) {
    const ujElozo = gombElozo.cloneNode(true);
    const ujKovetkezo = gombKovetkezo.cloneNode(true);
    gombElozo.parentNode.replaceChild(ujElozo, gombElozo);
    gombKovetkezo.parentNode.replaceChild(ujKovetkezo, gombKovetkezo);

    ujElozo.style.display = diakSzama > 1 ? "flex" : "none";
    ujKovetkezo.style.display = diakSzama > 1 ? "flex" : "none";

    ujKovetkezo.addEventListener("click", () => {
      if (jelenlegiDiaIndex < diakSzama - 1) {
        jelenlegiDiaIndex++;
        track.style.transform = `translateX(-${jelenlegiDiaIndex * 100}%)`;
      }
    });

    ujElozo.addEventListener("click", () => {
      if (jelenlegiDiaIndex > 0) {
        jelenlegiDiaIndex--;
        track.style.transform = `translateX(-${jelenlegiDiaIndex * 100}%)`;
      }
    });
  }

  pModal.classList.remove("rejtett");
  setTimeout(() => pModal.classList.add("aktiv"), 10);
};

window.nyisdMegALightboxot = function (induloIndex, kattintottKep) {
  const lightbox = document.getElementById("lightbox-overlay");
  const thumbsTarolo = document.getElementById("lightbox-thumbs");
  const szuloDia = kattintottKep.closest(".modal-dia-blokk");

  if (!szuloDia || !szuloDia.dataset.kepek) return;

  lightboxKepek = JSON.parse(szuloDia.dataset.kepek);
  jelenlegiLightboxIndex = induloIndex;

  lightbox.classList.remove("rejtett");
  thumbsTarolo.innerHTML = "";

  lightboxKepek.forEach((url, i) => {
    const img = document.createElement("img");
    img.src = url;
    img.className = "lb-thumb";
    img.onclick = () => window.frissitLightboxKepet(i);
    thumbsTarolo.appendChild(img);
  });

  window.frissitLightboxKepet(jelenlegiLightboxIndex);
};

window.frissitLightboxKepet = function (index) {
  jelenlegiLightboxIndex = index;
  const fokep = document.getElementById("lightbox-fokep");
  fokep.src = lightboxKepek[jelenlegiLightboxIndex];

  const thumbs = document.querySelectorAll(".lb-thumb");
  thumbs.forEach((t, i) => {
    if (i === jelenlegiLightboxIndex) {
      t.classList.add("aktiv-thumb");
      t.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    } else {
      t.classList.remove("aktiv-thumb");
    }
  });
};

// =========================================================
// ESEMÉNYEK INDÍTÁSA BIZTONSÁGOS BLOKKOKBAN
// =========================================================
document.addEventListener("DOMContentLoaded", function () {
  // 1. MOBIL MENÜ
  try {
    const lenyilomenuGomb = document.querySelector(".lenyilomenu");
    const fejlec = document.querySelector(".fejlec");
    if (lenyilomenuGomb && fejlec) {
      lenyilomenuGomb.addEventListener("click", () =>
        fejlec.classList.toggle("mobil-nyitva"),
      );
    }
  } catch (e) {
    console.log(e);
  }

  // 2. HERO KÉPCSERE
  try {
    const kepek = document.querySelectorAll(".kep-slide");
    if (kepek.length >= 2) {
      let aktualisKep = 0;
      setInterval(() => {
        kepek[aktualisKep].classList.remove("aktiv");
        aktualisKep = (aktualisKep + 1) % kepek.length;
        kepek[aktualisKep].classList.add("aktiv");
      }, 4000);
    }
  } catch (e) {
    console.log(e);
  }

  // 3. TEVÉKENYSÉGEK KÉPCSERE (A és B)
  try {
    const tevekenysegElemek = document.querySelectorAll(".tevekenyseg-elem");
    const tevekenysegKepek = document.querySelectorAll(".tevekenyseg-kep");
    if (tevekenysegElemek.length > 0) {
      tevekenysegElemek.forEach((elem) => {
        ["mouseenter", "click", "touchstart"].forEach((esemeny) => {
          elem.addEventListener(esemeny, function (e) {
            if (esemeny === "touchstart") e.preventDefault();
            tevekenysegElemek.forEach((el) =>
              el.classList.remove("aktiv-elem"),
            );
            tevekenysegKepek.forEach((kep) =>
              kep.classList.remove("aktiv-kep"),
            );
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
  } catch (e) {
    console.log(e);
  }

  // 4. ANIMÁCIÓK MEGJELENÍTÉSE (Miben segíthetünk)
  try {
    const megfigyelo = new IntersectionObserver(
      (bejegyzesek) => {
        bejegyzesek.forEach((bejegyzes) => {
          if (bejegyzes.isIntersecting)
            bejegyzes.target.classList.add("megjelent");
        });
      },
      { threshold: 0.2 },
    );

    const animalandoElemek = document.querySelectorAll(
      ".animacio-balrol, .animacio-fade, .animacio-jobbrol, .animacio-jobbrol-alap, .animacio-alulrol",
    );
    animalandoElemek.forEach((elem) => megfigyelo.observe(elem));
  } catch (e) {
    console.log(e);
  }

  // 5. MUNKÁINK SZŰRŐ MOTOR
  try {
    const tipusSelect = document.getElementById("szuro-tipus");
    const evSelect = document.getElementById("szuro-ev");
    const helyszinSelect = document.getElementById("szuro-helyszin");
    const torlesGomb = document.getElementById("szuro-torles");
    const projektKartyak = document.querySelectorAll(".projekt-kartya");

    if (tipusSelect && projektKartyak.length > 0) {
      function szuresFuttatasa() {
        const kTipus = tipusSelect.value;
        const kEv = evSelect.value;
        const kHelyszin = helyszinSelect.value;

        projektKartyak.forEach((kartya) => {
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
        torlesGomb.addEventListener("click", () => {
          tipusSelect.value = "osszes";
          evSelect.value = "osszes";
          helyszinSelect.value = "osszes";
          szuresFuttatasa();
        });
      }
    }
  } catch (e) {
    console.log(e);
  }

  // 6. LEGÖRDÜLŐ MENÜ MOTOR ÉS KATTINTÁS (Kijavítva!)
  try {
    const lenyiloTarolok = document.querySelectorAll(".lenyilomenu-tarolo");
    lenyiloTarolok.forEach((tarolo) => {
      const nyilKattinto = tarolo.querySelector(".nyil-kattinto");
      const regiGomb = tarolo.querySelector(".lenyilo-gomb");

      const vezerloElem = nyilKattinto ? nyilKattinto : regiGomb;

      if (vezerloElem) {
        vezerloElem.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          lenyiloTarolok.forEach((m) => {
            if (m !== tarolo) m.classList.remove("kattintva");
          });
          tarolo.classList.toggle("kattintva");
        });
      }
    });
    document.addEventListener("click", (e) => {
      lenyiloTarolok.forEach((t) => {
        if (!t.contains(e.target)) t.classList.remove("kattintva");
      });
    });
  } catch (e) {
    console.log(e);
  }

  // 7. SÜTI KEZELŐ
  try {
    const sutiSav = document.getElementById("suti-sav");
    if (sutiSav && !localStorage.getItem("karolyhazSutiKezeles")) {
      setTimeout(() => {
        sutiSav.classList.add("lathato");
        sutiSav.classList.remove("rejtett");
      }, 1500);
    }
    document
      .getElementById("suti-elfogad-gomb")
      ?.addEventListener("click", () => {
        localStorage.setItem("karolyhazSutiKezeles", "ok");
        sutiSav.classList.remove("lathato");
      });
    document.getElementById("suti-alap-gomb")?.addEventListener("click", () => {
      localStorage.setItem("karolyhazSutiKezeles", "ok");
      sutiSav.classList.remove("lathato");
    });
    document.getElementById("suti-megnyito")?.addEventListener("click", (e) => {
      e.preventDefault();
      sutiSav.classList.add("lathato");
    });
  } catch (e) {
    console.log(e);
  }

  // 8. TÉRKÉP MOTOR
  try {
    const osszesOldaliKartya = document.querySelectorAll(".projekt-kartya");
    const terkepTarolo = document.getElementById("terkep-pontok-tarolo");

    if (terkepTarolo && osszesOldaliKartya.length > 0) {
      const mapTaroloDiv = document.querySelector(".terkep-gorgeto");
      const mapHatterDiv = document.getElementById("magyarorszag-terkep");
      const kategoriaSzuro = document.getElementById("terkep-kategoria");

      // Térkép méretezés és Zoom
      if (mapTaroloDiv && mapHatterDiv) {
        let jelenlegiZoom = 1;
        let dinamikusMinZoom = 1;

        const alkalmazZoom = () => {
          const as = jelenlegiZoom * 1000;
          const am = jelenlegiZoom * 600;
          mapHatterDiv.style.width = as + "px";
          mapHatterDiv.style.minWidth = as + "px";
          mapHatterDiv.style.maxWidth = as + "px";
          mapHatterDiv.style.height = am + "px";
          mapHatterDiv.style.minHeight = am + "px";
          mapHatterDiv.style.maxHeight = am + "px";
        };

        const initTerkepMeret = () => {
          if (mapTaroloDiv.clientWidth === 0)
            return setTimeout(initTerkepMeret, 50);
          dinamikusMinZoom = Math.min(
            mapTaroloDiv.clientWidth / 1000,
            mapTaroloDiv.clientHeight / 600,
          );
          jelenlegiZoom = dinamikusMinZoom;
          alkalmazZoom();
        };
        initTerkepMeret();
        window.addEventListener("resize", initTerkepMeret);

        document.getElementById("zoom-in")?.addEventListener("click", () => {
          jelenlegiZoom = Math.min(jelenlegiZoom + 0.3, 4.5);
          alkalmazZoom();
        });
        document.getElementById("zoom-out")?.addEventListener("click", () => {
          jelenlegiZoom = Math.max(dinamikusMinZoom, jelenlegiZoom - 0.3);
          alkalmazZoom();
        });

        // Mozgatás egérrel
        let egerLent = false,
          kx,
          ky,
          gb,
          gf;
        mapTaroloDiv.addEventListener("mousedown", (e) => {
          egerLent = true;
          mapTaroloDiv.classList.add("huzas-aktiv");
          kx = e.pageX - mapTaroloDiv.offsetLeft;
          ky = e.pageY - mapTaroloDiv.offsetTop;
          gb = mapTaroloDiv.scrollLeft;
          gf = mapTaroloDiv.scrollTop;
        });
        mapTaroloDiv.addEventListener("mouseleave", () => {
          egerLent = false;
          mapTaroloDiv.classList.remove("huzas-aktiv");
        });
        mapTaroloDiv.addEventListener("mouseup", () => {
          egerLent = false;
          mapTaroloDiv.classList.remove("huzas-aktiv");
        });
        mapTaroloDiv.addEventListener("mousemove", (e) => {
          if (!egerLent) return;
          e.preventDefault();
          mapTaroloDiv.scrollLeft =
            gb - (e.pageX - mapTaroloDiv.offsetLeft - kx) * 1.5;
          mapTaroloDiv.scrollTop =
            gf - (e.pageY - mapTaroloDiv.offsetTop - ky) * 1.5;
        });
      }

      // Pöttyök generálása
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

      const vModal = document.getElementById("varos-modal");
      const vModalCim = document.getElementById("varos-modal-cim");
      const vModalLista = document.getElementById("varos-projekt-lista");

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
            if (!statisztika[hely])
              statisztika[hely] = { darab: 0, kartyak: [] };
            statisztika[hely].darab++;
            statisztika[hely].kartyak.push(kartya);
          }
        });

        Object.keys(statisztika).forEach((varosNev) => {
          if (statisztika[varosNev].darab > 0 && varosKoordinatak[varosNev]) {
            const pont = document.createElement("div");
            pont.className = "terkep-pont";
            pont.style.top = varosKoordinatak[varosNev].top + "%";
            pont.style.left = varosKoordinatak[varosNev].left + "%";
            pont.innerHTML = `<div class="terkep-szam">${statisztika[varosNev].darab}</div><div class="terkep-varos-nev">${varosNev}</div>`;

            pont.addEventListener("click", function () {
              vModalCim.innerText = `${varosNev} (${statisztika[varosNev].darab} projekt)`;
              vModalLista.innerHTML = "";
              statisztika[varosNev].kartyak.forEach((eredetiKartya) => {
                const klonKartya = eredetiKartya.cloneNode(true);
                klonKartya.classList.remove("rejtett");
                klonKartya.style.cursor = "pointer";
                klonKartya.addEventListener("click", (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.nyisdMegAProjektModalt(klonKartya);
                });
                vModalLista.appendChild(klonKartya);
              });
              vModal.classList.remove("rejtett");
            });
            terkepTarolo.appendChild(pont);
          }
        });
      }
      if (kategoriaSzuro)
        kategoriaSzuro.addEventListener("change", terkepFrissitese);
      terkepFrissitese();

      document
        .querySelector(".varos-bezar")
        ?.addEventListener("click", () => vModal.classList.add("rejtett"));
      vModal?.addEventListener("click", (e) => {
        if (e.target === vModal) vModal.classList.add("rejtett");
      });
    }
  } catch (e) {
    console.log(e);
  }

  // 9. LIGHTBOX ÉS MODAL BEZÁRÁS GOMBOK ESEMÉNYEI
  try {
    document
      .getElementById("lightbox-bezar")
      ?.addEventListener("click", () =>
        document.getElementById("lightbox-overlay").classList.add("rejtett"),
      );
    document
      .getElementById("lb-kovetkezo")
      ?.addEventListener("click", () =>
        window.frissitLightboxKepet(
          jelenlegiLightboxIndex < lightboxKepek.length - 1
            ? jelenlegiLightboxIndex + 1
            : 0,
        ),
      );
    document
      .getElementById("lb-elozo")
      ?.addEventListener("click", () =>
        window.frissitLightboxKepet(
          jelenlegiLightboxIndex > 0
            ? jelenlegiLightboxIndex - 1
            : lightboxKepek.length - 1,
        ),
      );

    const pModal = document.getElementById("projekt-modal");
    document
      .getElementById("modal-bezaras")
      ?.addEventListener("click", window.bezarProjektModalt);
    pModal?.addEventListener("click", (e) => {
      if (e.target === pModal) window.bezarProjektModalt();
    });
  } catch (e) {
    console.log(e);
  }
}); // DOMContentLoaded VÉGE

// =========================================
// KÖZPONTI KÁRTYA KATTINTÁS FIGYELŐ (A Főoldalhoz)
// =========================================
document.addEventListener("click", function (e) {
  const kattintottKartya = e.target.closest(".projekt-kartya");
  if (kattintottKartya && !kattintottKartya.closest(".varos-modal")) {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window.nyisdMegAProjektModalt === "function") {
      window.nyisdMegAProjektModalt(kattintottKartya);
    }
  }
});

// OKOS MENÜ (Felfelé görgetésre előcsúszik)
window.addEventListener("scroll", function () {
  const fejlec = document.querySelector(".fejlec");
  if (!fejlec || fejlec.classList.contains("mobil-nyitva")) return;
  const akGorgetes = window.pageYOffset || document.documentElement.scrollTop;
  if (akGorgetes > 50) fejlec.classList.add("gorgetve");
  else fejlec.classList.remove("gorgetve");
});
