var galItems = [
    { l: 'Obrázok 1', src: 'images/images1.jpg', c: 'web' },
    { l: 'Obrázok 2', src: 'images/images2.jpg', c: 'app' },
    { l: 'Obrázok 3', src: 'images/images3.png', c: 'web' },
    { l: 'Obrázok 4', src: 'images/images4.jpg', c: 'logo' },
    { l: 'Obrázok 5', src: 'images/images5.jpg', c: 'app' },
    { l: 'Obrázok 6', src: 'images/images6.jpg', c: 'web' },
    { l: 'Obrázok 7', src: 'images/images7.jpg', c: 'logo' },
    { l: 'Obrázok 8', src: 'images/images8.jpg', c: 'app' },
    { l: 'Obrázok 9', src: 'images/images9.jpg', c: 'web' }
];

function buildGal(filter) {
    var grid = document.getElementById('galGrid');
    if (!grid) return;

    grid.innerHTML = '';

    for (var i = 0; i < galItems.length; i++) {
        var item = galItems[i];

        if (filter !== 'all' && item.c !== filter) continue;

        var div = document.createElement('div');
        div.className = 'gal-item';
        div.innerHTML = '<img src="' + item.src + '" alt="' + item.l + '" style="width:100%;">' +
            '<div class="overlay-label">' + item.l + '</div>';

        grid.appendChild(div);
    }
}

function filterGal(filter, btn) {
    var buttons = document.querySelectorAll('.gf-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    if (btn) btn.classList.add('active');
    buildGal(filter);
}

document.addEventListener('DOMContentLoaded', function() {
    buildGal('all');
});

function doSubmit() {
    var valid = true;
    var meno = document.getElementById('f-name').value.trim();
    if (meno.length < 3) {
        document.getElementById('fr-name').classList.add('err');
        valid = false;
    } else {
        document.getElementById('fr-name').classList.remove('err');
    }

    var email = document.getElementById('f-email').value.trim();
    if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
        document.getElementById('fr-email').classList.add('err');
        valid = false;
    } else {
        document.getElementById('fr-email').classList.remove('err');
    }

    var predmet = document.getElementById('f-subject').value;
    if (predmet === '') {
        document.getElementById('fr-subject').classList.add('err');
        valid = false;
    } else {
        document.getElementById('fr-subject').classList.remove('err');
    }

    var pohlavie = document.querySelector('input[name="g"]:checked');
    if (pohlavie === null) {
        document.getElementById('fr-gender').classList.add('err');
        valid = false;
    } else {
        document.getElementById('fr-gender').classList.remove('err');
    }

    var suhlas = document.getElementById('f-agree').checked;
    if (!suhlas) {
        document.getElementById('fr-agree').classList.add('err');
        valid = false;
    } else {
        document.getElementById('fr-agree').classList.remove('err');
    }

    var sprava = document.getElementById('f-msg').value.trim();
    if (sprava.length < 10) {
        document.getElementById('fr-msg').classList.add('err');
        valid = false;
    } else {
        document.getElementById('fr-msg').classList.remove('err');
    }

    if (valid) {
        var toast = document.getElementById('toast');
        toast.style.display = 'block';
        setTimeout(function() {
            toast.style.display = 'none';
        }, 3000);
    }
}

function loadTable(filter, btn) {
    var tabs = document.querySelectorAll('.dtab');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    if (btn) btn.classList.add('active');

    document.getElementById('dataWrap').innerHTML = '<div class="load-bar">Načítavam dáta...</div>';

    fetch('data.json')
        .then(function(response) {
            if (!response.ok) throw new Error('Subor sa nepodarilo nacitat');
            return response.json();
        })
        .then(function(data) {
            var rows = '';
            for (var i = 0; i < data.projekty.length; i++) {
                var p = data.projekty[i];
                if (filter !== 'all' && p.kat !== filter) continue;

                var hviezdy = '';
                for (var k = 0; k < p.hodnotenie; k++) hviezdy += '★';
                for (var m = 0; m < 5 - p.hodnotenie; m++) hviezdy += '☆';

                rows += '<tr>' +
                    '<td>' + p.id + '</td>' +
                    '<td>' + p.name + '</td>' +
                    '<td>' + p.autor.meno + ' ' + p.autor.priezvisko + '</td>' +
                    '<td>' + p.rok + '</td>' +
                    '<td><span class="pill ' + p.kat + '">' + p.kat + '</span></td>' +
                    '<td class="stars">' + hviezdy + '</td>' +
                    '</tr>';
            }

            document.getElementById('dataWrap').innerHTML =
                '<table class="data-table"><thead><tr><th>#</th><th>Projekt</th><th>Autor</th><th>Rok</th><th>Kategória</th><th>Hodnotenie</th></tr></thead>' +
                '<tbody>' + rows + '</tbody></table>';
        })
        .catch(function(error) {
            document.getElementById('dataWrap').innerHTML = '<div>Chyba: ' + error.message + '</div>';
        });
}