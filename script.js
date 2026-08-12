document.addEventListener("DOMContentLoaded", function() {
    
    const kepek = document.querySelectorAll('.kep-slide');

    if (kepek.length < 2) {
        return; 
    }
    
    let aktualisKep = 0;

    function kepCsere() {
        
        kepek[aktualisKep].classList.remove('aktiv');
        
        aktualisKep = (aktualisKep + 1) % kepek.length;

        kepek[aktualisKep].classList.add('aktiv');
    }

    setInterval(kepCsere, 4000);
});