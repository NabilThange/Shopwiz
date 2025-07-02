# 🛍️ ShopWhiz: AI-Powered Shopping Assistant

## 🚀 Project Overview
ShopWhiz is an intelligent shopping assistant that helps users find products across multiple platforms using advanced AI-powered filter extraction and conversational search.

## 🔑 Prerequisites
- Node.js (v20+)
- pnpm or npm
- Groq API Key
- Tavily API Key

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/shopwhiz.git
cd shopwhiz
```

### 2. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the project root:
```env
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# Tavily API Configuration
TAVILY_API_KEY=your_tavily_api_key_here

# Optional: Additional configuration
NEXT_PUBLIC_APP_ENV=development
```

### 4. API Key Acquisition
- **Groq API Key**: 
  1. Visit [console.groq.com](https://console.groq.com)
  2. Create an account
  3. Generate API key for `llama3-70b-8192` model

- **Tavily API Key**:
  1. Visit [tavily.com](https://tavily.com)
  2. Sign up for an account
  3. Generate API key

## 🧩 Project Structure
- `app/`: Next.js app directory
  - `api/`: Server-side API routes
    - `groq/`: Groq-specific routes
    - `search/`: Product search routes
- `components/`: Reusable React components
- `lib/`: Utility functions and core logic
- `hooks/`: Custom React hooks

## 🔍 Key Features
- AI-powered filter extraction
- Multi-platform product search
- Conversational search interface
- Dynamic follow-up question generation

## 🚀 Development Workflow

### Start Development Server
```bash
pnpm dev
# or
npm run dev
```

### Build for Production
```bash
pnpm build
# or
npm run build
```

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

## 🛟 Support
For issues or questions, please open a GitHub issue or contact support@shopwhiz.com

## 🌟 Acknowledgements
- [Groq](https://groq.com) for powerful AI models
- [Tavily](https://tavily.com) for intelligent search
- [Next.js](https://nextjs.org) for the amazing framework "# Shopwiz" 
