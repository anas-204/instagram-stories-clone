# 📸 Instagram Stories Clone

A lightweight, responsive, frontend-only web application that replicates the core functionality of Instagram Stories. Built with performance and clean UI in mind, this project allows users to upload, view, and delete fleeting stories that are persisted directly on the device.

![Live Demo Deploy](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)

## ✨ Features

* **Single-Page Architecture:** A seamless, unified interface without page reloads.
* **Media Uploads:** Supports image and video uploads directly from the user's device.
* **Automatic Image Resizing:** Client-side processing via HTML5 Canvas scales large images down to a maximum of `1080px x 1920px` before saving, optimizing performance and local storage limits.
* **Persistent Storage:** Utilizes `localStorage` to ensure stories remain on the device even after a page refresh.
* **Full-Screen Viewer:** Immersive viewing experience with built-in controls (Close, Delete).
* **Delete Protections:** Integrated confirmation modals prevent accidental story deletions.
* **Toast Notifications:** Real-time feedback for successful uploads and deletions.
* **Responsive Dark UI:** Fully fluid layout built with Tailwind CSS that adapts to any screen size.

## 🛠️ Tech Stack

* **Framework:** [React](https://react.dev/) (Scaffolded with `create-vrtw` / [Vite](https://vitejs.dev/))
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (with `persist` middleware)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
* **Deployment:** [Vercel](https://vercel.com/)

## 🚀 Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/anas-204/instagram-stories-clone.git](https://github.com/anas-204/instagram-stories-clone.git)
   cd instagram-stories-clone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

## 📁 Project Architecture

```text
src/
├── components/
│   ├── layout/       # App shell and headers
│   ├── story-tray/   # Horizontal scroll, add button, thumbnails
│   ├── story-feed/   # Grid cards for uploaded stories
│   └── viewer/       # Full-screen modal and delete confirmation
├── store/
│   └── useStoryStore.js   # Zustand state and localStorage syncing
├── utils/
│   └── mediaProcessor.js  # Canvas resizing and Base64 conversion
└── App.jsx           # Main assembly
```

## 🔮 Future Enhancements

As the project scales, the following features are planned for integration:
* **Backend Integration:** Migrate from `localStorage` to a RESTful API (e.g., Java Spring Boot) with a relational database.
* **Cloud Storage:** Implement AWS S3 or Cloudinary for robust media hosting.
* **Computer Vision Filters:** Introduce image manipulation (edge detection, active contouring) using WebAssembly or a backend Python/C++ microservice.
* **User Authentication:** Add secure JWT login for multi-user feed isolation.

---
*Designed and built by أنس محمد عبد العزيز الشيخ.*
