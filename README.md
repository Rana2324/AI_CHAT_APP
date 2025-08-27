# AI Chat Application

A modern, full-stack AI-powered chat application built with React, Node.js, and OpenAI's GPT models.

![AI Chat App Screenshot](screenshot.png) <!-- Add a screenshot later -->

## Features

- Real-time chat interface with streaming responses
- Support for both GPT-3.5-turbo and GPT-4 models
- Responsive design with light/dark mode
- Message history and conversation management
- Server-side rendering for better performance
- Secure API key management

## Tech Stack

### Frontend
- React 18
- Vite (Build Tool)
- Tailwind CSS (Styling)
- React Icons
- Axios (HTTP Client)

### Backend
- Node.js & Express
- MongoDB (Database)
- OpenAI API (GPT Models)
- CORS (Cross-Origin Resource Sharing)
- Dotenv (Environment Variables)

## Prerequisites

- Node.js (v18+)
- npm (v9+) or yarn
- MongoDB (local or cloud instance)
- OpenAI API key

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-chat-app.git
cd ai-chat-app
```

### 2. Set Up Environment Variables

Create a `.env` file in the `server` directory based on the `.env.example` file:

```env
# Server Configuration
PORT=4000

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/ai_chat

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# Frontend Configuration
CLIENT_ORIGIN=http://localhost:5173
```

### 3. Install Dependencies

#### Server
```bash
cd server
npm install
```

#### Client
```bash
cd ../client
npm install
```

### 4. Start the Development Servers

#### In one terminal (Server)
```bash
cd server
npm run dev
```

#### In another terminal (Client)
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

## Project Structure

```
ai-chat-app/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   ├── src/               # React source code
│   │   ├── components/    # Reusable components
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Entry point
│   └── ...
│
├── server/                # Backend Node.js server
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── models/       # Database models
│   │   ├── DB/          # Database connection
│   │   └── server.js    # Server entry point
│   └── ...
│
├── .env.example          # Example environment variables
└── README.md            # This file
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 4000 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/ai_chat |
| OPENAI_API_KEY | Your OpenAI API key | - |
| OPENAI_MODEL | Default GPT model to use | gpt-3.5-turbo |
| CLIENT_ORIGIN | Allowed CORS origin | http://localhost:5173 |

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [OpenAI](https://openai.com) for the amazing GPT models
- [Vite](https://vitejs.dev/) for the blazing fast development experience
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

Made with by [Your Name]