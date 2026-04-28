// zoznam obrazkov pre galeriu
// kazdy obrazok ma nazov, kategoriu a farbu pozadia
var galItems = [
    { l: 'Obrazok 1', c: 'priroda',  bg: '#7c3aed' },
    { l: 'Obrazok 2', c: 'priroda',  bg: '#0891b2' },
    { l: 'Obrazok 3', c: 'priroda',  bg: '#0284c7' },
    { l: 'Obrazok 4', c: 'priroda',  bg: '#db2777' },
    { l: 'Obrazok 5', c: 'mesto',    bg: '#1d4ed8' },
    { l: 'Obrazok 6', c: 'mesto',    bg: '#374151' },
    { l: 'Obrazok 7', c: 'mesto',    bg: '#6b7280' },
    { l: 'Obrazok 8', c: 'zvierata', bg: '#b45309' },
    { l: 'Obrazok 9', c: 'zvierata', bg: '#7c3aed' },
];

// vykresli galerii podla filtra
function buildGal(filter) {
    var grid = document.getElementById('galGrid');

    // ak sme nie na stranke galerie, skonci
    if (!grid) return;

    // vycisti mriezku
    grid.innerHTML = '';

    // prejdi vsetky obrazky a pridaj len tie co pasuju
    for (var i = 0; i < galItems.length; i++) {
        var item = galItems[i];

        // preskoc obrazok ak nepatri do filtra
        if (filter !== 'all' && item.c !== filter) continue;

        // vytvor odkaz pre GLightbox
        var a = document.createElement('a');
        a.href = '#';
        a.className = 'gal-item glightbox';
        a.setAttribute('data-gallery', 'galeria');
        a.setAttribute('data-title', item.l);
        a.setAttribute('data-description', 'Kategoria: ' + item.c);
        a.style.backgroundColor = item.bg;
        a.innerHTML = '<div class="overlay-label">' + item.l + '</div>';

        grid.appendChild(a);
    }

    // spusti GLightbox kniznicu
    GLightbox({ selector: '.glightbox' });
}

// zmeni aktivny filter a znovu vykresli galerii
function filterGal(filter, btn) {
    // odstran active zo vsetkych tlacidiel
    var buttons = document.querySelectorAll('.gf-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }

    // oznac kliknute tlacidlo ako aktivne
    btn.classList.add('active');
    buildGal(filter);
}

// zobrazi galerii hned po nacitani stranky
buildGal('all');


/* --------------------
   VALIDACIA FORMULARA
   -------------------- */

function doSubmit() {
    // true = formular je ok, false = nieco nie je vyplnene
    var valid = true;

    // kontrola mena - musi mat aspon 3 znaky
    var meno = document.getElementById('f-name').value.trim();
    if (meno.length < 3) {
        document.getElementById('fr-name').classList.add('err');
        valid = false;
    } else {
        document.getElementById('fr-name').classList.remove('err');
    }

    // kontrola emailu - musi obsahovat @ a bodku
    var email = document.getElementById('f-email').value.trim();
    if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
        document.getElementById('fr-email').classList.add('err');
        valid = false;
    } else {
        document.getElementById('fr-email').classList.remove('err');
    }

    // kontrola predmetu - musi byt nieco vybrate
    var predmet = document.getElementById('f-subject').value;
    if (predmet === '') {
        document.getElementById('fr-subject').classList.add('err');
        valid = false;
    } else {
        document.getElementById('fr-subject').classList.remove('err');
    }

    // kontrola pohlavia - musi byt zaskrtnute radio tlacidlo
    var pohlavie = document.querySelector('input[name="g"]:checked');
    if (pohlavie === null) {
        document.getElementById('fr-gender').classList.add('err');
        valid = false;
    } else {
        document.getElementById('fr-gender').classList.remove('err');
    }

    // kontrola suhlasu - checkbox musi byt zaskrtnuty
    var suhlas = document.getElementById('f-agree').checked;
    if (!suhlas) {
        document.getElementById('fr-agree').classList.add('err');
        valid = false;
    } else {
        document.getElementById('fr-agree').classList.remove('err');
    }

    // kontrola spravy - musi mat aspon 10 znakov
    var sprava = document.getElementById('f-msg').value.trim();
    if (sprava.length < 10) {
        document.getElementById('fr-msg').classList.add('err');
        valid = false;
    } else {
        document.getElementById('fr-msg').classList.remove('err');
    }

    // ak je vsetko spravne, zobraz zelenou oznamenie
    if (valid) {
        var toast = document.getElementById('toast');
        toast.style.display = 'block';

        // skry oznamenie po 3 sekundach
        setTimeout(function() {
            toast.style.display = 'none';
        }, 3000);
    }
}


/* --------------------
   AJAX - nacitanie projektov
   -------------------- */

// nacita data.json a zobrazi tabulku projektov
function loadTable(filter, btn) {
    // nastav aktivny tab
    var tabs = document.querySelectorAll('.dtab');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    if (btn) btn.classList.add('active');

    // zobraz nacitavaci text kym sa data nenacitaju
    document.getElementById('dataWrap').innerHTML = '<div class="load-bar">Načítavam dáta...</div>';

    // nacitaj subor data.json
    fetch('data.json')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Subor sa nepodarilo nacitat');
            }
            return response.json();
        })
        .then(function(data) {
            // zostavaj riadky tabulky
            var rows = '';
            for (var i = 0; i < data.projekty.length; i++) {
                var p = data.projekty[i];

                // preskoc projekt ak nepatri do filtra
                if (filter !== 'all' && p.kat !== filter) continue;

                // hviezdicke hodnotenie
                var hviezdy = '';
                for (var k = 0; k < p.hodnotenie; k++) hviezdy += '★';
                for (var m = 0; m < 5 - p.hodnotenie; m++) hviezdy += '☆';

                rows += '<tr>';
                rows += '<td style="color:#888">' + p.id + '</td>';
                rows += '<td>' + p.name + '</td>';
                rows += '<td style="color:#888">' + p.autor.meno + ' ' + p.autor.priezvisko + '</td>';
                rows += '<td>' + p.rok + '</td>';
                rows += '<td><span class="pill ' + p.kat + '">' + p.kat + '</span></td>';
                rows += '<td class="stars">' + hviezdy + '</td>';
                rows += '</tr>';
            }

            // vloz hotovu tabulku do stranky
            document.getElementById('dataWrap').innerHTML =
                '<table class="data-table">' +
                '<thead><tr>' +
                '<th>#</th><th>Projekt</th><th>Autor</th>' +
                '<th>Rok</th><th>Kategória</th><th>Hodnotenie</th>' +
                '</tr></thead>' +
                '<tbody>' + rows + '</tbody>' +
                '</table>';
        })
        .catch(function(error) {
            // zobraz chybu ak sa nieco pokazilo
            document.getElementById('dataWrap').innerHTML = '<div class="load-bar">Chyba: ' + error.message + '</div>';
        });
}