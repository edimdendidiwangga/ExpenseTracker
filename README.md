
# Expense Tracker

## Overview
Expense Tracker is a mobile application designed to help users manage their expenses efficiently. It provides features for tracking spending, viewing statistics, and categorizing expenses.

## Table of Contents
- [How to Build Your Application](#how-to-build-your-application)
- [Software Architecture and Design Patterns](#software-architecture-and-design-patterns)
- [Additional Features](#additional-features)
- [Known Issues](#known-issues)
- [License](#license)

## How to Build Your Application

### Prerequisites
Ensure you have the following installed:
- Node.js (>= 18)
- React Native CLI
- Android Studio or Xcode (for mobile development)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd expensetracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build and run the application:
   - For Android:
     ```bash
     npm run android
     ```
   - For iOS:
     ```bash
     npm run ios
     ```

4. Start the Metro Bundler:
   ```bash
   npm start
   ```

## Software Architecture and Design Patterns

This application follows a component-based architecture using React and React Native. The main design patterns used are:

- **Container/Presentational Pattern**: Components are separated into containers (logic and state management) and presentational components (UI rendering).
- **Hooks**: React hooks are used to manage state and side effects, allowing for cleaner and more manageable code.
- **Context API**: The `AuthContext` is used to manage user authentication state across the app without prop drilling.

### Database
- The app uses SQLite for local data storage, allowing for efficient and persistent data management.

## Additional Features

- **Expense Statistics**: Users can view their total spending for selected time ranges (daily, weekly, monthly) and a category breakdown of their expenses.
- **User Authentication**: Only admin users can view all users' expenses, ensuring sensitive information is protected.

## Known Issues

- Currently, the app may not reflect the latest expenses immediately after login; a refresh might be needed.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
