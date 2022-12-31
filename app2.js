class Kisi{
    constructor(ad,soyad,email){
        this.ad = ad;
        this.soyad = soyad;
        this.email = email;
    }
};

class Ekran{
    constructor(){
        this.ad = document.getElementById('ad');
        this.soyad = document.getElementById('soyad');
        this.email = document.getElementById('email');
        this.form = document.getElementById('form').addEventListener('submit',this.kaydetGuncelle.bind(this));
        this.kisiListesi = document.querySelector('.tbody');
        this.kisiListesi.addEventListener('click',this.guncelleVeyaSil.bind(this));
        this.ekleGuncelleButton = document.querySelector('.form-btn');
        this.secilenSatir = undefined; 
        this.depo = new Depo();
        this.kisiyiEkranaYazdir();
    }
    alanlariTemizle() {
        this.ad.value = '';
        this.soyad.value = '';
        this.email.value = '';
    }
    guncelleVeyaSil(e){
        const tiklananYer = e.target;
        if (tiklananYer.classList.contains('btn--delete')) {
            this.secilenSatir = tiklananYer.parentElement.parentElement;
            this.kisiyiEkrandanSil();
        }
        else if(tiklananYer.classList.contains('btn--edit')){
            this.secilenSatir = tiklananYer.parentElement.parentElement;
            this.ekleGuncelleButton.value = 'Güncelle';
            this.ad.value = this.secilenSatir.cells[0].textContent; 
            this.soyad.value = this.secilenSatir.cells[1].textContent; 
            this.email.value = this.secilenSatir.cells[2].textContent; 
        }
    }

    kisiyiEkrandaGuncelle(kisi){
        this.depo.kisiGuncelle(kisi,this.secilenSatir.cells[2].textContent);
        this.secilenSatir.cells[0].textContent = kisi.ad;
        this.secilenSatir.cells[1].textContent = kisi.soyad;
        this.secilenSatir.cells[2].textContent = kisi.email;

        this.alanlariTemizle();
        this.secilenSatir = undefined;
        this.ekleGuncelleButton.value ='Kaydet';
    }

    kisiyiEkrandanSil(){
        this.secilenSatir.remove();
        const referansMail = this.secilenSatir.cells[2].textContent;

        this.depo.kisiSil(referansMail);
        this.alanlariTemizle();
        this.secilenSatir = undefined;
    }

    kisiyiEkranaYazdir(){
        this.depo.tumKisiler.forEach(kisi => {
            this.kisiyiEkranaEkle(kisi);

        })
    }

    kisiyiEkranaEkle(kisi){
        const olusturulanTr = document.createElement('tr');
        olusturulanTr.innerHTML =  `<td>${kisi.ad}</td>
        <td>${kisi.soyad}</td>
        <td>${kisi.email}</td>
        <td>
            <button class="btn btn--edit"><i class="far fa-edit"></i></button>
            <button class="btn btn--delete"><i class="far fa-trash-alt"></i></button>  
        </td>`;
        
        this.kisiListesi.appendChild(olusturulanTr);
       
    }

    kaydetGuncelle(e){
        e.preventDefault();
        const kisi = new Kisi(this.ad.value,this.soyad.value,this.email.value);
        const sonuc = Util.bosAlanKontrolu(this.ad,this.soyad,this.email);
        
        if (sonuc) {

            if (this.secilenSatir) {
                this.kisiyiEkrandaGuncelle(kisi);
            }
            else{
                this.kisiyiEkranaEkle(kisi);
                this.depo.kisiEkle(kisi);
                // locala ekleme
            }

            
            this.alanlariTemizle();
        }
        else{

        }
    }

};

class Util{
    static bosAlanKontrolu(...alanlar){
        let sonuc = true;
        alanlar.forEach(alan => {
            if (alan.lenght === 0) {
                sonuc = false;
                return false;
            }
        }
        );
        return sonuc;
    }
}

class Depo{
    constructor(){
        this.tumKisiler=this.kisileriGetir();
    }

    kisileriGetir(){
        let tumKisilerLocal;
        if (localStorage.getItem('tumKisiler')===null) {
            tumKisilerLocal = [];
        }else{
            tumKisilerLocal = JSON.parse(localStorage.getItem('tumKisiler'));
        }
        return tumKisilerLocal;
    }

    kisiEkle(kisi){
        this.tumKisiler.push(kisi);
        localStorage.setItem('tumKisiler',JSON.stringify(this.tumKisiler));
    }

    kisiSil(referansMail){
        this.tumKisiler.forEach((kisi,index)=>{
            if (kisi.email === referansMail) {
                this.tumKisiler.splice(index,1);
            }
        })
        localStorage.setItem('tumKisiler',JSON.stringify(this.tumKisiler));
    }

    kisiGuncelle(yeniBilgiler,referansMail){
        this.tumKisiler.forEach((kisi,index)=>{
            if (kisi.email === referansMail) {
                this.tumKisiler[index] = yeniBilgiler;
            }
        })
        localStorage.setItem('tumKisiler',JSON.stringify(this.tumKisiler));
    }


}

document.addEventListener('DOMContentLoaded',function (e) {
        const ekran = new Ekran();
});