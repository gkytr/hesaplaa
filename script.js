// Hesaplama araçlarının bilgileri
const hesaplamalar = {
    vat: {
        baslik: "KDV Hesaplama",
    aciklama: "Hesaplama türünü, tutarı ve KDV oranını gir.",
    alanlar: [
        ["type", "Hesaplama türü", "select", [
            { value: "ekle", label: "KDV Hariç → KDV Dahil" },
            { value: "cikar", label: "KDV Dahil → KDV Hariç" }
        ]],
        ["amount", "Tutar (₺)", "number", "1000"],
        ["rate", "KDV oranı (%)", "number", "20"]
    ]
    },

    discount: {
        baslik: "İndirim Hesaplama",
        aciklama: "Ürün fiyatını ve indirim oranını gir.",
        alanlar: [
            ["amount", "Ürün fiyatı (₺)", "number", "1500"],
            ["rate", "İndirim oranı (%)", "number", "25"]
        ]
    },

    percent: {
        baslik: "Yüzde Hesaplama",
        aciklama: "Bir sayının yüzdesini hesapla.",
        alanlar: [
            ["amount", "Sayı", "number", "500"],
            ["rate", "Yüzde (%)", "number", "15"]
        ]
    },

    age: {
        baslik: "Yaş Hesaplama",
        aciklama: "Doğum tarihini seç.",
        alanlar: [
            ["birth", "Doğum tarihi", "date", ""]
        ]
    }
};

// Seçili hesaplama aracı
let seciliArac = "vat";

// HTML elemanlarını seçiyoruz
const alanlar = document.getElementById("calc-fields");
const sonuc = document.getElementById("result");

// Türkçe para formatı
function paraFormatla(sayi) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY"
    }).format(sayi);
}

// Hesaplama aracını ekrana getir
function aracGoster(arac) {

    seciliArac = arac;

    const bilgi = hesaplamalar[arac];

    document.getElementById("calc-title").textContent =
        bilgi.baslik;

    document.getElementById("calc-desc").textContent =
        bilgi.aciklama;

    alanlar.innerHTML = bilgi.alanlar.map(
        ([id, etiket, tur, deger]) => {

            let input;

            if (tur === "select") {

                input = `
                    <select id="${id}">
                        ${deger.map(secenek =>
                            `<option value="${secenek.value}">
                                ${secenek.label}
                            </option>`
                        ).join("")}
                    </select>
                `;

            } else {
                input = `
                    <input
                        id="${id}"
                        type="${tur}"
                        placeholder="${deger}"
                        ${tur === "number" ? 'min="0" step="any"' : ""}
                    >
                `;
            }

            return `
                <label class="field">
                    <span>${etiket}</span>
                    ${input}
                </label>
            `;
        }
    ).join("");

    sonuc.textContent = "Sonucun burada görünecek.";
}

// Sonucu ekrana yazdır
function sonucuGoster(mesaj) {
    sonuc.textContent = mesaj;
}

// Hesaplama işlemleri
function hesapla() {

    // Yaş hesaplama
    if (seciliArac === "age") {

        const dogum = document.getElementById("birth").value;

        if (!dogum) {
            sonucuGoster("Lütfen doğum tarihini seç.");
            return;
        }

        const tarih = new Date(dogum + "T00:00:00");
        const bugun = new Date();

        if (tarih > bugun) {
            sonucuGoster("Geçerli bir doğum tarihi gir.");
            return;
        }

        let yas = bugun.getFullYear() - tarih.getFullYear();

        const dogumGunuGeldi =
            bugun.getMonth() > tarih.getMonth() ||
            (bugun.getMonth() === tarih.getMonth() &&
             bugun.getDate() >= tarih.getDate());

        if (!dogumGunuGeldi) {
            yas--;
        }

        sonucuGoster(`Yaşın: ${yas}`);

        return;
    }

    // Diğer hesaplamalar
    const tutar = document.getElementById("amount").value;
    const oran = document.getElementById("rate").value;

    if (tutar.trim() === "" || oran.trim() === "") {
        sonucuGoster("Lütfen bütün alanları doldur.");
        return;
    }

    const sayi = Number(tutar);
    const yuzde = Number(oran);

    if (!Number.isFinite(sayi) ||
        !Number.isFinite(yuzde) ||
        sayi < 0 || yuzde < 0) {

        sonucuGoster("Lütfen geçerli değerler gir.");
        return;
    }

    // KDV hesaplama
    if (seciliArac === "vat") {

        const islem = document.getElementById("type").value;

        let kdv;
        let toplam;
        let anaTutar;

        if (islem === "ekle") {

            // KDV hariç tutara KDV ekle
            kdv = sayi * yuzde / 100;
            anaTutar = sayi;
            toplam = sayi + kdv;

        } else {

            // KDV dahil tutardan KDV'yi ayır
            anaTutar = sayi / (1 + yuzde / 100);
            kdv = sayi - anaTutar;
            toplam = sayi;

        }

        sonucuGoster(
            `KDV Hariç: ${paraFormatla(anaTutar)} | ` +
            `KDV Tutarı: ${paraFormatla(kdv)} | ` +
            `KDV Dahil: ${paraFormatla(toplam)}`
        );

}

    // İndirim hesaplama
    else if (seciliArac === "discount") {

        const indirim = sayi * yuzde / 100;
        const yeniFiyat = sayi - indirim;

        sonucuGoster(
            `İndirim: ${paraFormatla(indirim)} | Yeni fiyat: ${paraFormatla(yeniFiyat)}`
        );
    }

    // Yüzde hesaplama
    else if (seciliArac === "percent") {

        const sonuc = sayi * yuzde / 100;

        sonucuGoster(
            `%${yuzde} sonucu: ${sonuc}`
        );
    }
}

// Hesaplama kartlarına tıklama
document.querySelectorAll(".arac-kart").forEach(kart => {

    kart.addEventListener("click", function() {

        const arac = this.dataset.tool;

        aracGoster(arac);

        document.querySelector(".hesaplama").scrollIntoView({
            behavior: "smooth"
        });
    });

});

// Hesapla butonu
document.getElementById("calculate").addEventListener(
    "click",
    hesapla
);

// Site açıldığında KDV hesaplaması göster
aracGoster("vat");