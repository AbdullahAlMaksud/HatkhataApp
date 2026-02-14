# Hatkhata (Bazaar List) 📝

<div align="center">
  <img src="./src/assets/images/applogo/logo.png" alt="Hatkhata Logo" width="120" height="120" />
  <br />
  <h3><b>Smart Shopping, Simplified.</b></h3>
  <p>Available in Bengali 🇧🇩 and English 🇺🇸</p>
</div>

---

**Hatkhata** (Bengali for "Hand Ledger") is a privacy-focused, modern shopping list application designed to make your daily bazaar and grocery planning effortless. Built with **React Native** and **Expo**, it offers a seamless experience on both Android and iOS.

## ✨ Key Features

- **📝 Smart Lists**: Create multiple shopping lists for different needs (e.g., Weekly Grocery, Friday Bazaar).
- **🏷️ Organized Tags**: Categorize items with color-coded tags for quick visual identification.
- **🇧🇩 Bilingual Support**: Fully localized in **Bengali** and **English**, with instant language switching.
- **💰 Expense Tracking**: Track item prices and calculate total estimated costs automatically.
- **🔄 Drag & Drop**: Prioritize your shopping list by dragging and reordering items.
- **🌙 Dark Mode**: Beautifully designed UI that adapts to your device's light and dark themes.
- **🔒 Privacy First**: Your data stays on your device. No account creation required.
- **⚡ Offline Ready**: Works perfectly without an internet connection.

## 📱 Screenshots

| Home Screen | List Details | Settings |
|:-----------:|:------------:|:--------:|
| <img src="./src/assets/images/applogo/splash-icon-dark.png" width="200" /> | <img src="./src/assets/images/applogo/splash-icon-dark.png" width="200" /> | <img src="./src/assets/images/applogo/splash-icon-dark.png" width="200" /> |
*(Placeholders - Replace with actual screenshots)*

## 🛠️ Tech Stack

- **Core**: [React Native](https://reactnative.dev/), [Expo](https://expo.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Unistyles](https://github.com/jpudom/react-native-unistyles) (Static & Dynamic theming)
- **Storage**: [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (Local persistence)
- **Localization**: [i18next](https://www.i18next.com/)
- **Media**: `expo-image`, `expo-image-picker`

## 📂 Project Structure

```bash
src/
├── app/                 # Expo Router screens and layout
├── assets/              # Images, fonts, and icons
├── components/          # Reusable UI components
│   ├── home/            # Home screen specific components
│   ├── list-detail/     # List detail screen components
│   └── ...
├── constants/           # App constants (Colors, Layout)
├── hooks/               # Custom React hooks
├── i18n/                # Localization configs (en/bn)
├── store/               # Zustand stores (useListStore, useUserStore)
├── styles/              # Unistyles theme setup
└── types/               # TypeScript definitions
```

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- [Expo Go](https://expo.dev/client) app on your mobile device (Android/iOS)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbdullahAlMaksud/HatkhataApp.git
   cd HatkhataApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - **Android**: Scan the QR code with the Expo Go app.
   - **iOS**: Scan the QR code with the Camera app (requires Expo Go).
   - **Emulator**: Press `a` for Android Emulator or `i` for iOS Simulator.

## 🤝 Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/AbdullahAlMaksud">Abdullah Al Maksud</a>
</div>
