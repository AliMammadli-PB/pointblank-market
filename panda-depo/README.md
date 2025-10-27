# 🐼 Panda Depo

Bu klasör Python hack için exe dosyalarını saklamak için kullanılır.

## 📁 Klasör Yapısı

```
panda-depo/
├── v1.5.0/
│   └── pbazgold_hack.exe  ← Buraya exe dosyasını koyun
├── v1.6.0/
│   └── pbazgold_hack.exe
└── v2.0.0/
    └── pbazgold_hack.exe
```

## 🚀 Kullanım

### 1. Yeni versiyon oluşturmak

```bash
# Yeni klasör oluştur
mkdir panda-depo\v2.0.0

# Exe dosyasını kopyala
copy dist\pbazgold_hack.exe panda-depo\v2.0.0\pbazgold_hack.exe
```

### 2. `server.js` güncellemesi

```javascript
// server.js'de version'ı güncelle
const currentVersion = "2.0.0";
const downloadUrl = "/panda/depo/v2.0.0/pbazgold_hack.exe";
```

### 3. Erişim URL'si

```
https://pointblank-market.onrender.com/panda/depo/v2.0.0/pbazgold_hack.exe
```

## 📝 Notlar

- ✅ Exe dosyaları Git'e commit edilir
- ✅ Python source kodu commit edilmez (gizli kalır)
- ✅ Version klasörleri otomatik oluşturulmalı
- ✅ Her version için ayrı klasör kullan
