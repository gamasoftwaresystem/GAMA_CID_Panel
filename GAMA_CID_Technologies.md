# GAMA CID YAZILIM TEKNOLOJİLERİ VE MİMARİ ENVANTERİ

Bu belge, **GAMA Fleet Control Center (Otonom İHA Kontrol Merkezi)** projesinin temelinde yatan modern yazılım bileşenlerini, kütüphaneleri ve bu teknolojilerin sistemin hangi parçalarında nasıl kullanıldığını detaylandırmak amacıyla hazırlanmıştır.

Proje, temelde **Modern Web Teknolojilerinin** bir araya getirilip, donanım hızlandırmalı bir işletim sistemi çekirdeğine (**Tauri**) entegre edilmesiyle profesyonel bir Masaüstü Yazılımı olarak çalışmaktadır.

---

## 1. Çekirdek ve Masaüstü Altyapısı (Desktop Engine)

### **Tauri (Rust & C++)**
*   **Kullanım Yeri:** `/src-tauri/` klasörü, uygulamanın ana işletim sistemi kabuğu.
*   **Görevleri:** 
    *   Web platformu (HTML/JS/CSS) olarak yazılan bu arayüzü paketleyip gerçek bir MacOS/Windows uygulaması `.app` formatına dönüştürmek.
    *   Chromium veya Electron'un hantal V8 motoru yerine, macOS'in kendi yerel "WKWebView" motorunu kullanarak projenin boyutunu küçültmek ve uygulamayı uçurmak.
    *   Tam ekran (Fullscreen HUD) modunda, sistem pencere ayarlarının yapılandırılması (`tauri.conf.json`).

---

## 2. Arayüz ve UI Çatısı (Frontend Framework)

### **React.js 19**
*   **Kullanım Yeri:** Web tabanlı arayüzün her noktası, özellikle `src/App.tsx` ve `/src/components/` klasöründeki tüm modüller.
*   **Görevleri:** 
    *   "UAV Hub", "Control Panel", "DroneMap" gibi bağımsız parçaların (Component) DOM üzerine çizilmesi ve birbirinden haberdar bir şekilde çalışması.
    *   `useState` ve `useEffect` hook'ları sayesinde sistem verisi (örneğin seçili dron, harita modu veya gelen hava durumu) değiştiği anda sadece ilgili ekran alanını anında yeniden çizmek (Re-render).

### **TypeScript**
*   **Kullanım Yeri:** Proje kodlamasının tamamında, `.tsx` uzantılı dosyalar ve `src/types.ts`.
*   **Görevleri:**
    *   Sistem bir askeri donanım paneli olduğu için sahte verilerde veya canlı yayınlarda oluşabilecek tip/çökme hatalarını en aza indirmek. 
    *   `Drone` objesinin (batarya, lat, lon, heading vs.) kurallarını projenin en başından belirleyerek hatasız yazılım gelişimi sağlamak.

---

## 3. Görsel Tasarım ve Şekillendirme (Styling & CSS)

### **Tailwind CSS v4**
*   **Kullanım Yeri:** Bütün `.tsx` dosyalarındaki HTML elementlerinin `className` niteliklerinde, `index.css` dosyasındaki tema tanımlamalarında.
*   **Görevleri:**
    *   Sayfaya özel HUD (Heads Up Display) temalı cam efektlerini (`backdrop-blur`, `rgba`), parlayan animasyonları (`animate-pulse`) ve panel ölçülerini CSS dosyası açmadan satır içinden yazmak.
    *   Yazılımın Cyberpunk/Mil-Tech görünümlü "neon, karanlık" atmosfer paletini (Örn: `text-hud-accent`, `bg-hud-warning`) sağlamak.

### **Lucide React**
*   **Kullanım Yeri:** Arayüzün tüm köşelerindeki küçük simgelerde. (Örneğin `DroneCard.tsx`, `Sidebar.tsx`).
*   **Görevleri:** HUD temasına olağanüstü uyum sağlayan, vektörel (SVG) ve piksellenmeyen modern ikonlar sunmak. Rüzgar simgesi, batarya durumu, uyarı ikonları, kapatma butonları vb.

---

## 4. Harita ve Navigasyon Motoru (GIS & Mapping)

### **Mapbox GL JS & react-map-gl**
*   **Kullanım Yeri:** `src/components/DroneMap.tsx`
*   **Görevleri:** 
    *   Ekranda İstanbul merkezli pürüzsüz gece haritasını renderlamak ve haritayı sağa/sola çekilebilir kılmak (`mapbox://styles/mapbox/navigation-night-v1`).
    *   İçerisindeki `MapRef.flyTo()` apisi sayesinde drone hedefleme anında veya Sidebar tetiklemelerinde kameranın 3D boyutta şık açılarla otomatik uçmasını / hedefe kilitlenmesini sağlamak.
    *   Sürekli güncellenen GPS Koordinatlarını `Marker` ve özel Drone SVG logolarıyla haritada gerçek zamanlı oynatmak.

---

## 5. Yapay Zeka ve Görüntü İşleme (Computer Vision)

### **TensorFlow.js (@tensorflow/tfjs)** & **COCO-SSD**
*   **Kullanım Yeri:** Sadece `src/components/DroneDetailPanel.tsx` (Drone Kamerasının İçinde).
*   **Görevleri:** 
    *   Canlı kamera `video` yayınından aldığı kareleri (Frame), saniyede defalarca analiz edip nesne/insan algılaması yapmak.
    *   Bulduğu nesnelerin X, Y koordinatlarında bir Hedef Kutusu (BBox) ve % Oranlı Güven Puanı (Confidence Score) oluşturup bunu, videonun üzerine binilmiş bir Canvas katmanına canlı olarak çizmek.
    *   Donanım hızlandırma için `webgl` (Graifk kartı API'si) ayarı yaparak CPU'nun değil GPU'nun kullanılmasını hedefler, yüksek performans sağlar.

---

## 6. Yayın ve Veri Akışı (Data Streams)

### **HLS.js (HTTP Live Streaming)**
*   **Kullanım Yeri:** `src/components/DroneDetailPanel.tsx` (Kamera Yayını).
*   **Görevleri:** Modern dronların (DJI, Baykar vb.) göndereceği segmentli m3u8 tabanlı güvenli canlı kamera verisini parçalar halinde indirtip tarayıcının yerel video oynatıcısına izletmek. *Mockup esnasında statik kalmıştır ancak altyapısı mevcuttur.*

### **Open-Meteo REST API**
*   **Kullanım Yeri:** `src/App.tsx` (Panelin Üst Kısmı - Header Weather Widget).
*   **Görevleri:** Sistemin sadece simülasyon değil dış dünyaya entegre olması için, `fetch()` komutuyla Open-Meteo açık kaynak sunucularından koordinatların anlık sıcaklık, rüzgar ve atmosfer hadisi durumunu çekmek.

### **JavaScript Timing Events (setInterval & Math)**
*   **Kullanım Yeri:** `src/App.tsx` (Ana Simülasyon Döngüsü).
*   **Görevleri:** IoT (MQTT / WebSockets) üzerinden gelen gerçek cihaz verilerini taklit etmek için, saniyede bir çalışan bir zamanlayıcı kurmak. Drone hızı ve pusula yörüngesi üzerinden X/Y eksen matematik algoritması (`Math.cos / Math.sin`) çalıştırarak dronların anlık olarak İstanbul üzerinde otonom uçuş fizikleri üretmesini sağlamak. 
