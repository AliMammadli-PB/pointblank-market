# GitHub Release Oluşturma Talimatları

## Adım 1: Exe Dosyasını Hazırlayın

```bash
# PyInstaller kurun (yoksa)
pip install pyinstaller

# Exe oluşturun
pyinstaller --onefile --windowed --name="pbazgold_hack" pbazgold_hack_gui.py

# Dosya şu konumda olacak:
# dist\pbazgold_hack.exe
```

## Adım 2: GitHub Release Oluşturun

1. **GitHub'a gidin:**
   - https://github.com/AliMammadli-PB/pb

2. **Release sekmesine gidin:**
   - Sağ üstte "Releases" linkine tıklayın
   - veya doğrudan: https://github.com/AliMammadli-PB/pb/releases

3. **New release butonuna tıklayın**

4. **Tag oluşturun:**
   - "Choose tag" → "v1.1.0" yazın
   - "Create new tag: v1.1.0 on publish" seçeneğini işaretleyin

5. **Release bilgilerini doldurun:**
   - **Release title:** `v1.1.0 - Auto-update Update`
   - **Description:**
   ```
   # v1.1.0 - Auto-update Update

   ## 🎉 Yeni Özellikler
   - Auto-update sistemi eklendi
   - Otomatik güncelleme desteği
   - Daha hızlı başlatma
   
   ## 🐛 Bug Fixes
   - Tarih parse hatası düzeltildi
   - Subscription süre gösterimi iyileştirildi
   
   ## 📝 Notlar
   - Bu sürüm otomatik güncellenir
   - Eski sürümü kullanan kullanıcılar otomatik güncelleme alacak
   ```

6. **Exe dosyasını ekleyin:**
   - "Attach binaries by dropping them here" alanına
   - `dist\pbazgold_hack.exe` dosyasını sürükleyin

7. **"Publish release" butonuna tıklayın**

## Adım 3: Test Edin

1. Eski sürümlü exe'yi çalıştırın (v1.0.0)
2. Update mevcut mesajı görecek
3. "Evet" deyin
4. Yeni exe indirilecek ve çalıştırılacak

## Adım 4: Yeni Versiyon Oluştururken

Yeni sürüm yapmak için:

1. `server.js` dosyasında version'ı değiştirin:
   ```javascript
   const currentVersion = "1.2.0"; // Yeni versiyon
   ```

2. Download URL'i güncelleyin:
   ```javascript
   const downloadUrl = "https://github.com/AliMammadli-PB/pb/releases/download/v1.2.0/pbazgold_hack.exe";
   ```

3. Changelog güncelleyin

4. Yeni exe'yi `server.js`'deki version ile hazırlayın:
   ```python
   # pbazgold_hack_gui.py dosyasında
   self.version = "1.1.0"  # Eski sürüm
   ```

5. GitHub release oluşturun (v1.2.0)

6. Deploy edin

