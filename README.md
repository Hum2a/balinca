# 🎯 Financial Quiz Application

<div align="center">

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)

</div>

A modern, interactive financial literacy quiz application designed to make learning about personal finance engaging and fun through team-based learning and interactive questions.

## ✨ Features

| Category | Description |
|----------|-------------|
| 🔐 Authentication | Secure sign-in and registration system |
| 🎮 Interactive Quiz | Engaging financial questions with real-time feedback |
| 👥 Team-Based Learning | Collaborative scoring system for group learning |
| 📊 Progress Tracking | Real-time score updates and progress monitoring |
| 💡 Educational Content | Detailed explanations and helpful hints |
| 📱 Responsive Design | Optimized for all devices and screen sizes |

## 🛠 Tech Stack

<div align="center">

| Frontend | Backend | Styling |
|----------|---------|---------|
| React.js | Firebase | CSS3 |
| React Router | Firestore | Flexbox |
| Context API | Authentication | Grid |

</div>

## 📁 Project Structure

```bash
src/
├── 📂 components/         # Reusable components
├── 📂 pages/             # Page components
│   └── 📄 Homepage.js    # Authentication page
├── 📂 quiz/              # Quiz related components
│   ├── 📂 questions/     # Individual quiz questions
│   ├── 📂 styles/        # Quiz specific styles
│   ├── 📂 widgets/       # Reusable quiz widgets
│   ├── 📄 FinancialQuiz.js
│   ├── 📄 QuizLandingPage.js
│   └── 📄 ResultsScreen.js
└── 📂 firebase/          # Firebase configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd financial-quiz
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Add your Firebase configuration to `src/firebase/initFirebase.js`
   - Enable Authentication and Firestore

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000)

## 📝 Usage Guide

### 1. Authentication
- Sign in with existing credentials
- Register a new account
- Password recovery options

### 2. Quiz Landing Page
- View quiz instructions
- Set up teams
- Configure quiz settings
- Start the quiz

### 3. Financial Quiz
- Answer questions about personal finance
- Use hints when needed
- Track team scores
- View detailed explanations

### 4. Results
- View final scores
- Review answers
- Access learning resources
- Download results

## 🛠 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Runs the app in development mode |
| `npm test` | Launches the test runner |
| `npm run build` | Builds the app for production |

## 🌐 Deployment

The application can be deployed to various platforms:

<div align="center">

| Platform | Description |
|----------|-------------|
| [Firebase Hosting](https://firebase.google.com/docs/hosting) | Recommended for Firebase integration |
| [Vercel](https://vercel.com) | Great for React applications |
| [Netlify](https://www.netlify.com) | Simple deployment process |
| [AWS Amplify](https://aws.amazon.com/amplify/) | Full-stack deployment solution |

</div>

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Create React App](https://github.com/facebook/create-react-app) for the project setup
- [Firebase](https://firebase.google.com) for authentication and database services
- [React Router](https://reactrouter.com) for navigation
- All contributors and supporters of this project

---

<div align="center">

Made with ❤️ by [Your Name/Organization]

</div>
