document.addEventListener("DOMContentLoaded", function () {
    
    // =========================================
    // 1. LENYILOMENU
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

                    tevekenysegElemek.forEach(el => el.classList.remove("aktiv-elem"));
                    tevekenysegKepek.forEach(kep => kep.classList.remove("aktiv-kep"));

                    this.classList.add("aktiv-elem");
                    const kepId = this.getAttribute("data-kep");
                    const aktivKep = document.querySelector(`.tevekenyseg-kep[data-kep="${kepId}"]`);
                    
                    if (aktivKep) aktivKep.classList.add("aktiv-kep");
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
        
        const evekHalmaza = new Set();
        const helyszinekHalmaza = new Set();

        // Évek és helyszínek automatikus kigyűjtése
        projektKartyak.forEach(kartya => {
            const ev = kartya.getAttribute("data-ev");
            const helyszin = kartya.getAttribute("data-helyszin");
            if (ev && ev.trim() !== "") evekHalmaza.add(ev.trim());
            if (helyszin && helyszin.trim() !== "") helyszinekHalmaza.add(helyszin.trim());
        });

        // Évek betöltése (Csökkenő sorrendben)
        Array.from(evekHalmaza).sort().reverse().forEach(ev => {
            const opcio = document.createElement("option");
            opcio.value = ev;
            opcio.textContent = ev;
            evSelect.appendChild(opcio);
        });

        // Települések betöltése (Nagy kezdőbetűvel)
        Array.from(helyszinekHalmaza).sort().forEach(hely => {
            const opcio = document.createElement("option");
            opcio.value = hely;
            opcio.textContent = hely.charAt(0).toUpperCase() + hely.slice(1);
            helyszinSelect.appendChild(opcio);
        });

        // Szűrési logika
        function szuresFuttatasa() {
            const kTipus = tipusSelect.value;
            const kEv = evSelect.value;
            const kHelyszin = helyszinSelect.value;

            projektKartyak.forEach(function (kartya) {
                const kTipusVal = kartya.getAttribute("data-tipus") || "";
                const kEvVal = kartya.getAttribute("data-ev") || "";
                const kHelyszinVal = kartya.getAttribute("data-helyszin") || "";

                const tipusEgyezik = (kTipus === "osszes" || kTipusVal === kTipus);
                const evEgyezik = (kEv === "osszes" || kEvVal === kEv);
                const helyszinEgyezik = (kHelyszin === "osszes" || kHelyszinVal === kHelyszin);

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
                
                // Biztonságos adatkinyerés (Ha valami hiányzik, ne omoljon össze)
                const hatterDiv = this.querySelector(".kartya-hatter");
                const hatterKep = hatterDiv ? hatterDiv.style.backgroundImage : "";
                
                const badge = this.querySelector(".kartya-badge");
                const badgeSzoveg = badge ? badge.innerText : "";
                
                const cim = this.querySelector("h3");
                const cimSzoveg = cim ? cim.innerText : "";
                
                const meta = this.querySelector(".kartya-meta");
                const metaSzoveg = meta ? meta.innerText : "";
                
                const reszletek = this.querySelector(".kartya-rejtett-reszletek");
                const reszletesLeiras = reszletek ? reszletek.innerHTML : "<p>Nincs további információ.</p>";

                // Adatok betöltése
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

                // Ablak nyitása
                modal.classList.add("aktiv");
            });
        });

        // Ablak bezárása
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

});