# GAMA CID (Command Interface Dashboard) Sistem Mimarisi ve Teknoloji Yol Haritası

## 1. Sistemin Genel İşleyişi (Data Flow)
Sistem, uçtan uca otonom veri akışı sağlayan yüksek performanslı ve gecikmesiz üç ana katmandan oluşmaktadır:
**Drone (Edge) ➔ Merkezi Sunucu (Backend) ➔ CID Desktop Panel (Frontend)**

1.  **Drone Katmanı:** Telemetri ve durum verilerini hücresel ağlar (4G/5G) üzerinden düşük bant genişliği ve yüksek güvenilirlikle (MQTT) sunucuya iletir. Kamera stream'i gecikmesiz (WebRTC) olarak panel aktarılır.
2.  **Server Katmanı:** Gelen verileri işler, veritabanına kaydeder ve bağlı olan CID panellerine düşük gecikmeyle (WebSocket / MQTT) dağıtır.
3.  **CID Panel Katmanı:** Filo yönetimini sağlar, harita üzerinde drone'ları gerçek zamanlı takip eder ve donanım hızlandırmalı video akışı ile seçilen drone'un detaylarını gösterir. Çevrimdışı durumlara karşı yerel önbellek (Cache) barındırır.

---

## 2. Teknoloji Yığını (Tech Stack)

### A. Frontend: CID Desktop App
*   **Framework:** `Tauri` (Rust + React/TypeScript) - Native hızında, düşük RAM tüketimine sahip, güvenlik odaklı modern masaüstü altyapısı.
*   **Harita Motoru:** `Mapbox GL JS` - Anlık GPS takibi ve özel karanlık/neon HUD temaları için donanım hızlandırmalı (WebGL) harita render motoru.
*   **Video Render:** Native `WebRTC` dekoderi - CPU'yu yormadan 0'a yakın gecikmeli H.264/H.265 stream oynatma imkanı.
*   **UI/UX:** `Tailwind CSS` / Özel CSS animasyonları - Gelişmiş, akıcı, yarı saydam ve interaktif komuta merkezi estetiği.
*   **Çevrimdışı & Yerel Depolama (Local State):** `SQLite` - Harita parçaları (tiles), son bilinen konumlar ve bağlantı koptuğunda kritik logları kaydetmek için yerel veritabanı.

### B. Backend: Central Relay Server
*   **Dil/Runtime:** `Go` (Yüksek eşzamanlılık - concurrency) veya `Python` (FastAPI).
*   **Edge - Sunucu İletişimi (IoT):** `MQTT` (Mosquitto/EMQX) - Bağlantı kopmalarına dirençli ve paket kayıplarını engelleyen QoS (Quality of Service) mimarisi.
*   **Sunucu - Masaüstü İletişimi:** `WebSockets` - Anlık dashboard güncellemeleri için.
*   **Video Streaming:** `WebRTC` (Olası relay/turn server ihtiyacı için).
*   **Veritabanı:** `PostgreSQL` (Uçuş logları, kullanıcı rolleri ve görev geçmişi) + `Redis` (Saniyelik değişen telemetri/konum verileri için in-memory cache).

### C. Drone (Edge Computing)
*   **Kontrol & Haberleşme:** `MAVSDK` veya `PyMAVLink`.
*   **Yapay Zeka (AI):** `YOLOv11` - NVIDIA Jetson gibi cihazlar üzerinde TensorRT optimizasyonu ile gerçek zamanlı nesne tespiti ve hedef takibi.
*   **Veri Protokolü:** Telemetri ve sensör durumları için `MQTT`, video akışı için `WebRTC`.

---

## 3. Özellikler ve Modüller

### 🗺️ Filo Yönetim Modülü (Global View)
*   Tüm drone'ların harita üzerinde gerçek zamanlı ve yumuşak animasyonlarla (`Marker`) takibi.
*   Drone bazlı genişletilebilir durum kartları (Batarya, Ağ Sinyali, Uçuş Modu, Hedef).
*   Merkezi uyarı sistemi (Çarpışma önleme bildirimleri, Geofence / İhlal durumu uyarıları).

### 🎯 Odaklanmış Kontrol Modülü (Focus Mode)
*   **Live Stream:** Seçilen drone'un kamerasından gelen AI destekli video akışı (Bounding box işaretlemeleriyle).
*   **Telemetry HUD:** Video veya ekranın kenarlarına bindirilmiş irtifa, hız, otonom yönelme verileri.
*   **Remote Control:** Harita üzerinden hedef (Waypoint) atama veya acil durum / RTL (Return to Launch) manuel komutları.

---

## 4. Güvenlik Protokolleri ve İletişim Stratejisi
*   **Encryption:** Tüm veri trafiğinin (MQTT ve WebSocket dahil) `TLS/AES-256` ile şifrelenmesi.
*   **Authentication:** Drone ve Panel bağlantıları, kullanıcı oturumları için `JWT` tabanlı yetkilendirme mimarisi.
*   **Siber Dayanıklılık:** MQTT QoS 1/2 kuralları ile 4G/5G kopmalarında telemetri verisi kaybının önlenmesi.

---
*Hazırlayan: GAMA Geliştirme Ekibi & AI Asistanı*
