# GitHub Release Oluşturma - Adım Adım Talimat

## 📋 Adım 1: Exe Dosyasını Hazırlayın

```bash
# Python'da PyInstaller kurulu olmalı
pip install pyinstaller

# Exe oluşturun
pyinstaller --onefile --windowed --name="pbazgold_hack" pbazgold_hack_gui.py

# Exe dosyası şu konumda olacak:
# dist\pbazgold_hack.exe
```

## 📋 Adım 2: GitHub'a Git

1. Tarayıcınızda şu URL'e gidin:
   ```
   https://github.com/AliMammadli-PB/pb/releases
   ```

2. Sağ üstte **"Create a new release"** veya **"Draft a new release"** butonuna tıklayın.

## 📋 Adım 3: Release Bilgilerini Doldurun

### Tag
```
v1.1.0
```
**Önemli:** Tag'i yazdıktan sonra **"Create new tag: v1.1.0 on publish"** seçeneğini işaretleyin!

### Release Title
```
v1.1.0 - Auto-update System
```

### Description (Açıklama)
```markdown
# v1.1.0 - Auto-update System

## 🎉 Yeni Özellikler
- ✅ Auto-update sistemi eklendi
- ✅ Otomatik güncelleme desteği
- ✅ Güncellemeleri kontrol et butonu
- ✅ Yeni versiyon bildirimi

## 🐛 Bug Fixes
- ✅ Tarih parse hatası düzeltildi
- ✅ Subscription süre gösterimi iyileştirildi
- ✅ API response kontrolü eklendi

## 📝 Kullanım
Bu sürüm otomatik güncellenir. Yeni sürümler varsa "Güncelle" butonuna basın.
```

## 📋 Adım 4: Exe Dosyasını Ekleyin

1. **"Attach binaries by dropping them here or clicking to browse"** alanına gelin.

2. **dist** klasöründen `pbazgold_hack.exe` dosyasını:
   - Sürükleyip bırakın, VEYA
   - "choose your files" butonuna tıklayıp seçin

3. Dosya yüklendiğinde görünecek: ✅ `pbazgold_hack.exe (X MB)`

## 📋 Adım 5: Release'i Yayınlayın

1. Sayfanın en altında **"Publish release"** butonuna tıklayın.

2. Tebrikler! ✅ Release oluşturuldu!

## 📋 Adım 6: Test Edin

1. Python script'i çalıştırın: `python pbazgold_hack_gui.py`

2. "Güncelle" butonuna tıklayın.

3. Update mevcut mesajı göreceksiniz!

## 🔗 Faydalı Linkler

- **Repo:** https://github.com/AliMammadli-PB/pb
- **Release Sayfası:** https://github.com/AliMammadli-PB/pb/releases
- **Direct Download URL:** https://github.com/AliMammadli-PB/pb/releases/download/v1.1.0/pbazgold_hack.exe

## ⚠️ Önemli Notlar

1. **Tag Format:** Her zaman `v` ile başlamalı (örn: `v1.1.0`)
2. **Dosya Adı:** Exe dosyası `pbazgold_hack.exe` olarak kaydedilmeli
3. **Version:** `server.js` dosyasındaki version ile uyumlu olmalı
4. **Public Repo:** Release'e herkesten erişilebilmesi için repo **public** olmalı

## 🎯 Sonraki Versiyonlar İçin

Yeni versiyon yaparken:

1. `server.js`'de version'ı artırın: `"1.2.0"`
2. Tag'i değiştirin: `v1.2.0`
3. Yeni exe'yi yükleyin
4. Publish edin

## 🐛 Sorun Giderme

### "404 Not Found" hatası
- ✅ Release oluşturulmalı
- ✅ Exe dosyası eklenmeli
- ✅ Tag doğru olmalı (v1.1.0)

### "Already exists" hatası
- ✅ Tag zaten var, yeni tag oluşturun (örn: v1.2.0)

### "Permission denied"
- ✅ Repo'ya write yetkiniz olmalı

