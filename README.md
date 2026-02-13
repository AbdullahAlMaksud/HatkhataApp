# Hatkhata (Bazaar List)

**Hatkhata** (Bengali for "Hand Ledger") is a modern, privacy-focused bazaar/shopping list application built with React Native and Expo. It helps you organize your shopping needs efficiently with a clean, intuitive interface available in both Bengali and English.

## Features

- **📝 Smart Lists**: Create and manage multiple shopping lists with ease.
- **🏷️ Tagging System**: Organize lists by categories (e.g., Grocery, Bazaar, Essentials) using color-coded tags.
- **🔍 Quick Search**: Instantly find lists by title, items, or notes.
- **🇧🇩 Bilingual Support**: Full support for Bengali and English languages.
- **💰 Price Tracking**: Optional price tracking for items with automatic total calculation.
- **🔄 Drag & Drop**: Easily reorder items within a list.
- **📊 Data Export**: Export your list data to CSV format for external analysis.
- **🎨 Modern Design**: Beautiful, responsive UI with light and dark mode support.
- **🔒 Privacy First**: All data is stored locally on your device.

## Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [React Native Unistyles](https://github.com/jpudom/react-native-unistyles)
- **Icons**: [Expo Vector Icons](https://icons.expo.fyi/)
- **Storage**: [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- **Internationalization**: [i18next](https://www.i18next.com/)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or bun

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

3. **Run the app**
   ```bash
   npx expo start
   ```

## Usage

- **Create a List**: Tap the `+` button to start a new shopping list.
- **Add Items**: Add items with optional quantity and price.
- **Manage Items**: Swipe to delete, check to complete, or drag to reorder.
- **Settings**: Customize currency, language (Bangla/English), and theme.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
