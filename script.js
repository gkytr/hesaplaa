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
    },
    profit: {
        baslik: "Kâr – Zarar Hesaplama",
        aciklama: "Alış ve satış fiyatını girerek kârını veya zararını hesapla.",
        alanlar: [
            ["buy", "Alış fiyatı (₺)", "number", "1000"],
            ["sell", "Satış fiyatı (₺)", "number", "1500"]
        ]
    },
    unit: {
        baslik: "Birim Dönüştürücü",
        aciklama: "Uzunluk, ağırlık veya hacim birimlerini dönüştür.",
        alanlar: [
            ["category", "Birim kategorisi", "select", [
                { value: "length", label: "Uzunluk" },
                { value: "weight", label: "Ağırlık" },
                { value: "volume", label: "Hacim" }
            ]],
            ["fromUnit", "Başlangıç birimi", "select", []],
            ["toUnit", "Dönüştürülecek birim", "select", []],
            ["amount", "Miktar", "number", "10"]
        ]
    },
    bmi: {
        baslik: "VKİ Hesaplama",
        aciklama: "Boyunu ve kilonu girerek vücut kitle indeksini hesapla.",
        alanlar: [
            ["height", "Boy (cm)", "number", "175"],
            ["weight", "Kilo (kg)", "number", "70"]
        ]
    },
    currency: {
        baslik: "Para Birimi Dönüştürücü",
        aciklama: "Para birimleri arasında referans kurlarıyla dönüşüm yap.",
        alanlar: [
            ["amount", "Tutar", "number", "100"],
            ["fromCurrency", "Kaynak para birimi", "select", [
                { value: "TRY", label: "Türk Lirası (TRY)" },
                { value: "USD", label: "Amerikan Doları (USD)" },
                { value: "EUR", label: "Euro (EUR)" },
                { value: "GBP", label: "İngiliz Sterlini (GBP)" }
            ]],
            ["toCurrency", "Hedef para birimi", "select", [
                { value: "TRY", label: "Türk Lirası (TRY)" },
                { value: "USD", label: "Amerikan Doları (USD)" },
                { value: "EUR", label: "Euro (EUR)" },
                { value: "GBP", label: "İngiliz Sterlini (GBP)" }
            ]]
        ]
    }
};

const birimler = {
    length: {
        km: { label: "Kilometre (km)", factor: 1000 },
        m: { label: "Metre (m)", factor: 1 },
        cm: { label: "Santimetre (cm)", factor: 0.01 },
        mm: { label: "Milimetre (mm)", factor: 0.001 }
    },
    weight: {
        ton: { label: "Ton", factor: 1000 },
        kg: { label: "Kilogram (kg)", factor: 1 },
        g: { label: "Gram (g)", factor: 0.001 },
        mg: { label: "Miligram (mg)", factor: 0.000001 }
    },
    volume: {
        m3: { label: "Metreküp (m³)", factor: 1000 },
        litre: { label: "Litre (L)", factor: 1 },
        ml: { label: "Mililitre (mL)", factor: 0.001 }
    }
};

let seciliArac = "vat";

const alanlar = document.getElementById("calc-fields");
const sonuc = document.getElementById("result");

function paraFormatla(sayi) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY"
    }).format(sayi);
}

function sayiFormatla(sayi) {
    return new Intl.NumberFormat("tr-TR", {
        maximumFractionDigits: 4
    }).format(sayi);
}

function aracGoster(arac) {
    seciliArac = arac;

    const bilgi = hesaplamalar[arac];

    document.getElementById("calc-title").textContent = bilgi.baslik;
    document.getElementById("calc-desc").textContent = bilgi.aciklama;

    alanlar.innerHTML = bilgi.alanlar.map(([id, etiket, tur, deger]) => {
        let input;

        if (tur === "select") {
            input = `<select id="${id}">
                ${deger.map(secenek =>
                    `<option value="${secenek.value}">${secenek.label}</option>`
                ).join("")}
            </select>`;
        } else {
            input = `<input id="${id}" type="${tur}"
                placeholder="${deger}"
                ${tur === "number" ? 'min="0" step="any"' : ""}>`;
        }

        return `<label class="field">
            <span>${etiket}</span>
            ${input}
        </label>`;
    }).join("");

    sonuc.textContent = "Sonucun burada görünecek.";

    if (arac === "unit") {
        birimleriGuncelle();
        document.getElementById("category").addEventListener("change", birimleriGuncelle);
    }
}

function birimleriGuncelle() {
    const kategori = document.getElementById("category").value;
    const from = document.getElementById("fromUnit");
    const to = document.getElementById("toUnit");

    const secenekler = birimler[kategori];

    const secenekHTML = Object.entries(secenekler).map(([kod, bilgi]) =>
        `<option value="${kod}">${bilgi.label}</option>`
    ).join("");

    from.innerHTML = secenekHTML;
    to.innerHTML = secenekHTML;

    if (to.options.length > 1) {
        to.selectedIndex = 1;
    }
}

function sonucuGoster(mesaj) {
    sonuc.textContent = mesaj;
}

function sayiOku(id) {
    const alan = document.getElementById(id);
    if (!alan || alan.value.trim() === "") return null;

    const deger = Number(alan.value);

    if (!Number.isFinite(deger) || deger < 0) return null;

    return deger;
}

async function hesapla() {
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

        if (!dogumGunuGeldi) yas--;

        sonucuGoster(`Yaşın: ${yas}`);
        return;
    }

    if (seciliArac === "profit") {
        const alis = sayiOku("buy");
        const satis = sayiOku("sell");

        if (alis === null || satis === null || alis === 0) {
            sonucuGoster("Lütfen geçerli alış ve satış fiyatları gir. Alış fiyatı sıfırdan büyük olmalı.");
            return;
        }

        const fark = satis - alis;
        const oran = (fark / alis) * 100;

        if (fark > 0) {
            sonucuGoster(`Kâr: ${paraFormatla(fark)} | Kâr oranı: %${sayiFormatla(oran)}`);
        } else if (fark < 0) {
            sonucuGoster(`Zarar: ${paraFormatla(Math.abs(fark))} | Zarar oranı: %${sayiFormatla(Math.abs(oran))}`);
        } else {
            sonucuGoster("Kâr veya zarar yok. Alış ve satış fiyatları eşit.");
        }
        return;
    }

    if (seciliArac === "unit") {
        const miktar = sayiOku("amount");

        if (miktar === null) {
            sonucuGoster("Lütfen geçerli bir miktar gir.");
            return;
        }

        const kategori = document.getElementById("category").value;
        const from = document.getElementById("fromUnit").value;
        const to = document.getElementById("toUnit").value;

        const temelDeger = miktar * birimler[kategori][from].factor;
        const donusum = temelDeger / birimler[kategori][to].factor;

        sonucuGoster(`${sayiFormatla(miktar)} ${from} = ${sayiFormatla(donusum)} ${to}`);
        return;
    }

    if (seciliArac === "bmi") {
        const boy = sayiOku("height");
        const kilo = sayiOku("weight");

        if (boy === null || kilo === null || boy === 0 || kilo === 0) {
            sonucuGoster("Lütfen geçerli boy ve kilo değerleri gir.");
            return;
        }

        const metre = boy / 100;
        const vki = kilo / (metre * metre);

        let yorum;

        if (vki < 18.5) {
            yorum = "Zayıf";
        } else if (vki < 25) {
            yorum = "Normal aralık";
        } else if (vki < 30) {
            yorum = "Fazla kilolu";
        } else {
            yorum = "Obezite aralığı";
        }

        sonucuGoster(`Vücut kitle indeksin: ${sayiFormatla(vki)} | Genel değerlendirme: ${yorum}. Bu sınıflandırma yetişkinler içindir; tek başına sağlık değerlendirmesi değildir.`);
        return;
    }

    if (seciliArac === "currency") {
        const miktar = sayiOku("amount");
        const kaynak = document.getElementById("fromCurrency").value;
        const hedef = document.getElementById("toCurrency").value;

        if (miktar === null) {
            sonucuGoster("Lütfen geçerli bir tutar gir.");
            return;
        }

        if (kaynak === hedef) {
            sonucuGoster(`${sayiFormatla(miktar)} ${kaynak} = ${sayiFormatla(miktar)} ${hedef}`);
            return;
        }

        sonucuGoster("Kur bilgisi alınıyor...");

        try {
            const cevap = await fetch(
                `https://api.frankfurter.dev/v2/rate/${kaynak}/${hedef}`
            );

            if (!cevap.ok) {
                throw new Error("Kur bilgisi alınamadı.");
            }

            const veri = await cevap.json();
            const donusum = miktar * veri.rate;

            sonucuGoster(
                `${sayiFormatla(miktar)} ${kaynak} = ${sayiFormatla(donusum)} ${hedef} | Referans kuru: 1 ${kaynak} = ${sayiFormatla(veri.rate)} ${hedef} | Kur tarihi: ${veri.date}`
            );
        } catch (hata) {
            sonucuGoster("Döviz kuru alınamadı. İnternet bağlantını kontrol edip tekrar dene.");
        }

        return;
    }

    const tutar = sayiOku("amount");
    const oran = sayiOku("rate");

    if (tutar === null || oran === null) {
        sonucuGoster("Lütfen bütün alanlara geçerli değerler gir.");
        return;
    }

    if (seciliArac === "vat") {
        const islem = document.getElementById("type").value;

        let kdv, toplam, anaTutar;

        if (islem === "ekle") {
            kdv = tutar * oran / 100;
            anaTutar = tutar;
            toplam = tutar + kdv;
        } else {
            anaTutar = tutar / (1 + oran / 100);
            kdv = tutar - anaTutar;
            toplam = tutar;
        }

        sonucuGoster(
            `KDV Hariç: ${paraFormatla(anaTutar)} | KDV Tutarı: ${paraFormatla(kdv)} | KDV Dahil: ${paraFormatla(toplam)}`
        );

    } else if (seciliArac === "discount") {
        const indirim = tutar * oran / 100;
        const yeniFiyat = tutar - indirim;

        sonucuGoster(
            `İndirim: ${paraFormatla(indirim)} | Yeni fiyat: ${paraFormatla(yeniFiyat)}`
        );

    } else if (seciliArac === "percent") {
        const yuzdeSonucu = tutar * oran / 100;

        sonucuGoster(
            `%${sayiFormatla(oran)} sonucu: ${sayiFormatla(yuzdeSonucu)}`
        );
    }
}

document.querySelectorAll(".arac-kart").forEach(kart => {
    kart.addEventListener("click", function() {
        const arac = this.dataset.tool;

        aracGoster(arac);

        document.querySelector(".hesaplama").scrollIntoView({
            behavior: "smooth"
        });
    });
});

document.getElementById("calculate").addEventListener("click", hesapla);

aracGoster("vat");
