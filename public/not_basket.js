const yeniGorev = document.querySelector('.input-gorev');
const yeniGorevEkleBtn = document.querySelector('.btn-gorev-ekle');
const gorevListesi = document.querySelector('.gorev-listesi');
const tamamlananGorevListesi = document.querySelector('.tamamlanan-gorev-listesi');

yeniGorevEkleBtn.addEventListener('click', gorevEkle);
gorevListesi.addEventListener('click', gorevSilTamamlaDuzenle);
tamamlananGorevListesi.addEventListener('click', gorevSilTamamlaDuzenle);
document.addEventListener('DOMContentLoaded', localStorageOku);

function gorevSilTamamlaDuzenle(e) {
    const tiklanilanEleman = e.target.closest('.gorev-item'); // En yakın gorev-item'ı bul

    if (!tiklanilanEleman) return; // Eğer tıklanan eleman gorev-item değilse çık

    const btnTamamla = e.target.closest('.gorev-btn-tamamlandi');
    const btnSil = e.target.closest('.gorev-btn-sil');
    const btnDuzenle = e.target.closest('.gorev-btn-duzenle');

    if (btnTamamla) {
        // Tamamla işlemleri
        tiklanilanEleman.classList.toggle("gorev-tamamlandi");
        if (tiklanilanEleman.classList.contains("gorev-tamamlandi")) {
            tamamlananGorevListesi.appendChild(tiklanilanEleman);
            localStorageTamamla(tiklanilanEleman.children[0].innerText);
        } else {
            gorevListesi.appendChild(tiklanilanEleman);
            localStorageTamamlaGeriAl(tiklanilanEleman.children[0].innerText);
        }
    }
    if (btnSil) {
        // Silme işlemleri
        if (confirm('Emin misiniz?')) {
            tiklanilanEleman.classList.add('kaybol');
            const silinecekGorev = tiklanilanEleman.children[0].innerText;
            localStorageSil(silinecekGorev);
            tiklanilanEleman.addEventListener('transitionend', function() {
                tiklanilanEleman.remove();
            }, { once: true });
        }
    }
    if (btnDuzenle) {
        // Düzenleme işlemleri
        const gorevTanim = tiklanilanEleman.children[0];
        const yeniGorev = prompt('Görevi güncelle:', gorevTanim.innerText);
        if (yeniGorev) {
            const eskiGorev = gorevTanim.innerText;
            gorevTanim.innerText = yeniGorev;
            localStorageGuncelle(eskiGorev, yeniGorev);
        }
    }
}

function localStorageGuncelle(eskiGorev, yeniGorev) {
    const gorevler = localStorageGetGorevler();
    const gorevIndex = gorevler.indexOf(eskiGorev);
    if (gorevIndex > -1) {
        gorevler[gorevIndex] = yeniGorev;
        localStorage.setItem('gorevler', JSON.stringify(gorevler));
    }

    const tamamlananGorevler = localStorageGetTamamlananGorevler();
    const tamamlananGorevIndex = tamamlananGorevler.indexOf(eskiGorev);
    if (tamamlananGorevIndex > -1) {
        tamamlananGorevler[tamamlananGorevIndex] = yeniGorev;
        localStorage.setItem('tamamlananGorevler', JSON.stringify(tamamlananGorevler));
    }
}

function gorevEkle(e) {
    e.preventDefault();
    if (yeniGorev.value.length > 1) {
        gorevItemOlustur(yeniGorev.value);
        localStorageKaydet(yeniGorev.value);
        yeniGorev.value = '';
    } else {
        alert('Boş görev tanımı olmaz');
    }
}

function localStorageGetGorevler() {
    return localStorage.getItem('gorevler') ? JSON.parse(localStorage.getItem('gorevler')) : [];
}

function localStorageGetTamamlananGorevler() {
    return localStorage.getItem('tamamlananGorevler') ? JSON.parse(localStorage.getItem('tamamlananGorevler')) : [];
}

function localStorageKaydet(yeniGorev) {
    const gorevler = localStorageGetGorevler();
    gorevler.push(yeniGorev);
    localStorage.setItem('gorevler', JSON.stringify(gorevler));
}

function localStorageTamamla(tamamlananGorev) {
    const gorevler = localStorageGetGorevler();
    const silinecekElemanIndex = gorevler.indexOf(tamamlananGorev);
    gorevler.splice(silinecekElemanIndex, 1);
    localStorage.setItem('gorevler', JSON.stringify(gorevler));

    const tamamlananGorevler = localStorageGetTamamlananGorevler();
    tamamlananGorevler.push(tamamlananGorev);
    localStorage.setItem('tamamlananGorevler', JSON.stringify(tamamlananGorevler));
}

function localStorageTamamlaGeriAl(gorev) {
    const tamamlananGorevler = localStorageGetTamamlananGorevler();
    const silinecekElemanIndex = tamamlananGorevler.indexOf(gorev);
    tamamlananGorevler.splice(silinecekElemanIndex, 1);
    localStorage.setItem('tamamlananGorevler', JSON.stringify(tamamlananGorevler));

    const gorevler = localStorageGetGorevler();
    gorevler.push(gorev);
    localStorage.setItem('gorevler', JSON.stringify(gorevler));
}

function localStorageOku() {
    const gorevler = localStorageGetGorevler();
    gorevler.forEach(gorev => gorevItemOlustur(gorev, false));

    const tamamlananGorevler = localStorageGetTamamlananGorevler();
    tamamlananGorevler.forEach(gorev => gorevItemOlustur(gorev, true));
}

function localStorageSil(gorev) {
    const gorevler = localStorageGetGorevler();
    const silinecekElemanIndex = gorevler.indexOf(gorev);
    if (silinecekElemanIndex > -1) {
        gorevler.splice(silinecekElemanIndex, 1);
        localStorage.setItem('gorevler', JSON.stringify(gorevler));
    }

    const tamamlananGorevler = localStorageGetTamamlananGorevler();
    const silinecekTamamlananElemanIndex = tamamlananGorevler.indexOf(gorev);
    if (silinecekTamamlananElemanIndex > -1) {
        tamamlananGorevler.splice(silinecekTamamlananElemanIndex, 1);
        localStorage.setItem('tamamlananGorevler', JSON.stringify(tamamlananGorevler));
    }
}

function gorevItemOlustur(gorev, tamamlandi = false) {
    const gorevDiv = document.createElement('div');
    gorevDiv.classList.add('gorev-item');

    const gorevLi = document.createElement('li');
    gorevLi.classList.add('gorev-tanim');
    gorevLi.innerText = gorev;
    gorevDiv.appendChild(gorevLi);

    const gorevTamamaBtn = document.createElement('button');
    gorevTamamaBtn.classList.add('gorev-btn');
    gorevTamamaBtn.classList.add('gorev-btn-tamamlandi');
    gorevTamamaBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    gorevDiv.appendChild(gorevTamamaBtn);

    const gorevDuzenleBtn = document.createElement('button');
    gorevDuzenleBtn.classList.add('gorev-btn');
    gorevDuzenleBtn.classList.add('gorev-btn-duzenle');
    gorevDuzenleBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    gorevDiv.appendChild(gorevDuzenleBtn);

    const gorevSilBtn = document.createElement('button');
    gorevSilBtn.classList.add('gorev-btn');
    gorevSilBtn.classList.add('gorev-btn-sil');
    gorevSilBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    gorevDiv.appendChild(gorevSilBtn);

    if (tamamlandi) {
        gorevDiv.classList.add("gorev-tamamlandi");
        tamamlananGorevListesi.appendChild(gorevDiv);
    } else {
        gorevListesi.appendChild(gorevDiv);
    }
}
