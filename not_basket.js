const yeniGorev = document.querySelector('.input-gorev');
const yeniGorevEkleBtn = document.querySelector('.btn-gorev-ekle');
const gorevListesi = document.querySelector('.gorev-listesi');

yeniGorevEkleBtn.addEventListener('click', gorevEkle);
gorevListesi.addEventListener('click', gorevSilTamamla);
document.addEventListener('DOMContentLoaded', localStorageOku);

function gorevSilTamamla(e) {
    const tiklanilanEleman = e.target;

    if (tiklanilanEleman.classList.contains('gorev-btn-tamamlandi')) {
        tiklanilanEleman.parentElement.classList.toggle("gorev-tamamlandi");
    }
    if (tiklanilanEleman.classList.contains('gorev-btn-sil')) {
        if(confirm('Emin misiniz')){
            const gorevItem = tiklanilanEleman.parentElement;
            gorevItem.classList.add('kaybol'); 
            const silinecekGorev = gorevItem.children[0].innerText;
            localStorageSil(silinecekGorev);
            gorevItem.addEventListener('transitionend', function() {
                gorevItem.remove();
            }, { once: true }); 
        }
       
    }
}

function gorevEkle(e) {
    e.preventDefault();
    if(yeniGorev.value.length>1){
        gorevItemOlustur(yeniGorev.value);
        localStorageKaydet(yeniGorev.value);
        yeniGorev.value = '';
    }else{
        alert('Bos görev tanımı olmaz');
    }
  
}

function localStorageGetGorevler() {
    return localStorage.getItem('gorevler') ? JSON.parse(localStorage.getItem('gorevler')) : [];
}

function localStorageKaydet(yeniGorev) {
    const gorevler = localStorageGetGorevler();
    gorevler.push(yeniGorev);
    localStorage.setItem('gorevler', JSON.stringify(gorevler));
}

function localStorageOku() {
    const gorevler = localStorageGetGorevler();
    gorevler.forEach(gorevItemOlustur);
}

function localStorageSil(gorev) {
    const gorevler = localStorageGetGorevler();
    const silinecekElemanIndex = gorevler.indexOf(gorev);
    gorevler.splice(silinecekElemanIndex, 1);
    localStorage.setItem('gorevler', JSON.stringify(gorevler));
}

function gorevItemOlustur(gorev) {
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

    const gorevSilBtn = document.createElement('button');
    gorevSilBtn.classList.add('gorev-btn');
    gorevSilBtn.classList.add('gorev-btn-sil');
    gorevSilBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    gorevDiv.appendChild(gorevSilBtn);

    gorevListesi.appendChild(gorevDiv);
}
