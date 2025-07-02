"use client"

import { useState, useEffect } from "react"
import { Mic, Filter, Globe, MessageCircle, Search, ArrowRight } from "lucide-react"
import Link from "next/link"

// Cursor-Reactive Floating Shopping Icons Component
const FloatingIcons = () => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [iconPositions, setIconPositions] = useState([])

  const icons = [
    { emoji: "⌚", delay: 0, duration: 6, baseX: 15, baseY: 20 },
    { emoji: "👟", delay: 1, duration: 8, baseX: 85, baseY: 15 },
    { emoji: "📱", delay: 2, duration: 7, baseX: 10, baseY: 60 },
    { emoji: "🎧", delay: 0.5, duration: 9, baseX: 90, baseY: 70 },
    { emoji: "👕", delay: 1.5, duration: 6.5, baseX: 20, baseY: 85 },
    { emoji: "💻", delay: 2.5, duration: 8.5, baseX: 80, baseY: 40 },
    { emoji: "🎒", delay: 3, duration: 7.5, baseX: 5, baseY: 45 },
    { emoji: "👔", delay: 3.5, duration: 6.8, baseX: 95, baseY: 55 },
  ]

  // Initialize icon positions on mount
  useEffect(() => {
    const positions = icons.map((icon) => ({
      baseX: icon.baseX,
      baseY: icon.baseY,
      offsetX: 0,
      offsetY: 0,
    }))
    setIconPositions(positions)
  }, [])

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setMousePos({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Calculate icon positions based on mouse position
  useEffect(() => {
    if (iconPositions.length === 0) return

    setIconPositions((prev) =>
      prev.map((pos, index) => {
        const distance = Math.sqrt(Math.pow(mousePos.x - pos.baseX, 2) + Math.pow(mousePos.y - pos.baseY, 2))

        // Only react if mouse is within 25% of screen distance
        if (distance < 25) {
          const force = (25 - distance) / 25
          const angle = Math.atan2(pos.baseY - mousePos.y, pos.baseX - mousePos.x)

          return {
            ...pos,
            offsetX: Math.cos(angle) * force * 8,
            offsetY: Math.sin(angle) * force * 8,
          }
        }

        // Slowly return to base position
        return {
          ...pos,
          offsetX: pos.offsetX * 0.9,
          offsetY: pos.offsetY * 0.9,
        }
      }),
    )
  }, [mousePos])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {icons.map((icon, index) => {
        const position = iconPositions[index]
        if (!position) return null

        return (
          <div
            key={index}
            className="absolute text-6xl opacity-30 animate-bounce cursor-reactive-icon"
            style={{
              left: `${position.baseX + position.offsetX}%`,
              top: `${position.baseY + position.offsetY}%`,
              animationDelay: `${icon.delay}s`,
              animationDuration: `${icon.duration}s`,
              transition: "all 0.3s ease-out",
              transform: `translate(-50%, -50%) scale(${1 + Math.abs(position.offsetX + position.offsetY) * 0.05})`,
              zIndex: -1,
            }}
          >
            {icon.emoji}
          </div>
        )
      })}
    </div>
  )
}

// Voice Demo Component (simplified without the Try Demo button)
const VoiceDemo = () => {
  return (
    <div className="neubrutalism-card p-4 sm:p-6 md:p-8 bg-gradient-to-br from-purple-200 to-indigo-200 relative overflow-hidden">
      <div className="text-center">
        <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">🎤</div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 uppercase">Voice Search Ready</h3>
        <div className="bg-white/50 rounded-lg p-3 sm:p-4 min-h-[50px] sm:min-h-[60px] flex items-center justify-center">
          <p className="text-sm sm:text-base md:text-lg font-medium text-gray-800 leading-relaxed text-center">
            Just speak naturally: "Find me a gaming laptop under ₹60,000"
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ShopWhizEnhanced() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-cyan-50 to-pink-100 relative">
      <FloatingIcons />

      {/* Enhanced Hero Section */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-20">
          {/* Enhanced Typography */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-black mb-6 sm:mb-8 leading-tight tracking-tight">
            TALK TO
            <span className="block text-yellow-400 drop-shadow-lg" style={{ WebkitTextStroke: "2px black" }}>
              SHOPWHIZ
            </span>
            <span className="block text-cyan-400 drop-shadow-lg">FIND ANYTHING</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-8 sm:mb-10 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4">
            Your AI-powered shopping assistant that searches across
            <span className="text-yellow-600"> Amazon</span>,<span className="text-cyan-600"> Flipkart</span>,
            <span className="text-pink-600"> Myntra</span> & more!
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-10 sm:mb-12 px-4">
            <Link href="/conversation">
              <button className="neubrutalism-button text-lg sm:text-xl md:text-2xl px-6 sm:px-12 md:px-16 py-4 sm:py-6 md:py-8 flex items-center justify-center gap-2 sm:gap-3 md:gap-4 bg-yellow-400 hover:bg-yellow-500 transition-all duration-200 transform hover:scale-105 w-full sm:w-auto">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex-shrink-0" />
                <span className="whitespace-nowrap">🤖 CHAT WITH AI</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
              </button>
            </Link>
            <Link href="/search">
              <button className="neubrutalism-button text-lg sm:text-xl md:text-2xl px-6 sm:px-12 md:px-16 py-4 sm:py-6 md:py-8 bg-cyan-400 hover:bg-cyan-500 flex items-center justify-center gap-2 sm:gap-3 md:gap-4 transition-all duration-200 transform hover:scale-105 w-full sm:w-auto">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex-shrink-0" />
                <span className="whitespace-nowrap">🛍️ CLASSIC SEARCH</span>
              </button>
            </Link>
          </div>

          {/* Enhanced Feature Pills */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 text-sm sm:text-base font-bold text-gray-700 px-4">
            <span className="flex items-center gap-1 sm:gap-2 bg-white/50 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm md:text-base">
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="whitespace-nowrap">AI Chat</span>
            </span>
            <span className="text-lg sm:text-xl md:text-2xl hidden sm:inline">•</span>
            <span className="flex items-center gap-1 sm:gap-2 bg-white/50 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm md:text-base">
              <Mic className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="whitespace-nowrap">Voice Search</span>
            </span>
            <span className="text-lg sm:text-xl md:text-2xl hidden sm:inline">•</span>
            <span className="flex items-center gap-1 sm:gap-2 bg-white/50 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm md:text-base">
              <Filter className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="whitespace-nowrap">Smart Filters</span>
            </span>
            <span className="text-lg sm:text-xl md:text-2xl hidden sm:inline">•</span>
            <span className="flex items-center gap-1 sm:gap-2 bg-white/50 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm md:text-base">
              <Globe className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="whitespace-nowrap">Multi-Platform</span>
            </span>
          </div>
        </div>

        {/* How It Works Timeline */}
        <div className="mb-16 sm:mb-20 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-8 sm:mb-12 text-center uppercase">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="neubrutalism-card p-4 sm:p-6 md:p-8 bg-yellow-200 relative">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 text-center">💬</div>
              <div className="bg-black text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full absolute top-2 sm:top-4 right-2 sm:right-4">
                STEP 1
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 uppercase">Tell Us What You Want</h3>
              <p className="text-gray-700 font-medium text-sm sm:text-base md:text-lg leading-relaxed">
                Just say "I want a Titan watch under ₹3000" or "Show me gaming laptops" - our AI understands natural
                language!
              </p>
            </div>

            <div className="neubrutalism-card p-4 sm:p-6 md:p-8 bg-cyan-200 relative">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 text-center">🔍</div>
              <div className="bg-black text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full absolute top-2 sm:top-4 right-2 sm:right-4">
                STEP 2
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 uppercase">AI Searches Everything</h3>
              <p className="text-gray-700 font-medium text-sm sm:text-base md:text-lg leading-relaxed">
                Our AI agents scan Amazon, Flipkart, Myntra, Ajio and more to find the perfect matches for you.
              </p>
            </div>

            <div className="neubrutalism-card p-4 sm:p-6 md:p-8 bg-pink-200 relative">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 text-center">✨</div>
              <div className="bg-black text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full absolute top-2 sm:top-4 right-2 sm:right-4">
                STEP 3
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 uppercase">Get Smart Results</h3>
              <p className="text-gray-700 font-medium text-sm sm:text-base md:text-lg leading-relaxed">
                Compare prices, read reviews, and get personalized recommendations all in one place!
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16 sm:mb-20 px-4 max-w-7xl mx-auto">
          <div className="neubrutalism-card p-4 sm:p-6 md:p-8 text-center bg-yellow-200">
            <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">🤖</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 uppercase">AI Conversations</h3>
            <p className="text-gray-700 font-medium text-sm sm:text-base leading-relaxed">
              Chat naturally with our AI. Just say "I want a Titan watch under ₹3000" and let it guide you!
            </p>
          </div>

          <div className="neubrutalism-card p-4 sm:p-6 md:p-8 text-center bg-cyan-200">
            <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 uppercase">Multi-Platform</h3>
            <p className="text-gray-700 font-medium text-sm sm:text-base leading-relaxed">
              Search across Amazon, Flipkart, Myntra, Ajio and more. Compare prices and find the best deals.
            </p>
          </div>

          <div className="neubrutalism-card p-4 sm:p-6 md:p-8 text-center bg-pink-200">
            <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">⚡</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 uppercase">Lightning Fast</h3>
            <p className="text-gray-700 font-medium text-sm sm:text-base leading-relaxed">
              Get results in seconds. Our AI-powered search is optimized for speed and accuracy.
            </p>
          </div>

          <VoiceDemo />
        </div>

        {/* Backed by AI Agents Section */}
        <div className="mb-16 sm:mb-20 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-8 sm:mb-12 text-center uppercase">
            Backed by AI Agents
          </h2>
          <div className="neubrutalism-card p-6 sm:p-8 md:p-12 bg-gradient-to-r from-purple-200 via-blue-200 to-green-200 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center">
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">🚀</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 uppercase">Groq AI</h3>
                <p className="text-gray-700 font-medium text-sm sm:text-base leading-relaxed">
                  Lightning-fast AI inference for instant understanding of your shopping needs
                </p>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">🔎</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 uppercase">Tavily Search</h3>
                <p className="text-gray-700 font-medium text-sm sm:text-base leading-relaxed">
                  Advanced web search capabilities to find products across all platforms
                </p>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">🧠</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 uppercase">Smart Filtering</h3>
                <p className="text-gray-700 font-medium text-sm sm:text-base leading-relaxed">
                  Intelligent product categorization and personalized recommendations
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Built for You Section */}
        <div className="mb-16 sm:mb-20 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-8 sm:mb-12 text-center uppercase">
            Built for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="neubrutalism-card p-4 sm:p-6 md:p-8 bg-gradient-to-br from-orange-200 to-red-200">
              <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">🎯</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 uppercase">Tech-Savvy Shoppers</h3>
              <p className="text-gray-700 font-medium text-sm sm:text-base md:text-lg mb-3 sm:mb-4 leading-relaxed">
                Love trying new tech? Our AI understands specs, features, and helps you compare technical details across
                products.
              </p>
              <ul className="text-gray-700 font-medium space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li>• Compare laptop specs instantly</li>
                <li>• Find phones by camera quality</li>
                <li>• Get tech recommendations</li>
              </ul>
            </div>

            <div className="neubrutalism-card p-4 sm:p-6 md:p-8 bg-gradient-to-br from-green-200 to-blue-200">
              <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">💰</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 uppercase">Deal Hunters</h3>
              <p className="text-gray-700 font-medium text-sm sm:text-base md:text-lg mb-3 sm:mb-4 leading-relaxed">
                Always looking for the best price? We scan all platforms simultaneously to find you the best deals and
                discounts.
              </p>
              <ul className="text-gray-700 font-medium space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li>• Real-time price comparison</li>
                <li>• Discount alerts & offers</li>
                <li>• Budget-friendly alternatives</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Enhanced Popular Searches */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black mb-8 uppercase">Try These Conversations</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "I want a Titan watch under ₹3000",
              "Looking for Nike running shoes size 9",
              "Need a gaming laptop under ₹60000",
              "Want wireless earphones with good bass",
              "Show me formal shirts for office",
              "Find iPhone 15 best price",
              "Budget smartphones under ₹20000",
            ].map((search, index) => (
              <button
                key={index}
                className="neubrutalism-chip text-sm hover:bg-yellow-300 transition-colors duration-200 cursor-pointer"
              >
                💬 {search}
              </button>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="neubrutalism-card p-12 bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300">
            <h2 className="text-4xl font-black mb-6 uppercase">Ready to Find Anything?</h2>
            <p className="text-xl font-medium mb-8 text-gray-800">
              Join thousands of smart shoppers who use ShopWhiz to find the best deals!
            </p>
            <Link href="/conversation">
              <button className="neubrutalism-button text-3xl px-20 py-6 bg-black text-white hover:bg-gray-800 transition-all duration-200 transform hover:scale-105">
                🚀 START SHOPPING NOW
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-black text-white py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-8 mb-6">
              <a href="#" className="hover:text-yellow-400 font-bold text-lg transition-colors">
                GitHub
              </a>
            </div>
            <p className="text-gray-400 font-bold text-lg">Built with ❤️ for RAISE YOUR HACK</p>
            <p className="text-gray-500 font-medium mt-2">Powered by Groq • Tavily • AI Agents</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Space Grotesk', sans-serif;
        }
        
        .neubrutalism-button {
          background: #fbbf24;
          border: 4px solid #000;
          border-radius: 0;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 6px 6px 0px #000;
          transition: all 0.2s ease;
        }
        
        .neubrutalism-button:hover {
          box-shadow: 3px 3px 0px #000;
          transform: translate(3px, 3px);
        }
        
        .neubrutalism-card {
          border: 4px solid #000;
          border-radius: 0;
          box-shadow: 8px 8px 0px #000;
          transition: all 0.3s ease;
        }
        
        .neubrutalism-card:hover {
          box-shadow: 12px 12px 0px #000;
          transform: translate(-2px, -2px);
        }
        
        .neubrutalism-chip {
          background: #67e8f9;
          border: 3px solid #000;
          padding: 8px 16px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 4px 4px 0px #000;
          display: inline-block;
          transition: all 0.2s ease;
        }
        
        .neubrutalism-chip:hover {
          box-shadow: 2px 2px 0px #000;
          transform: translate(2px, 2px);
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0, -30px, 0);
          }
          70% {
            transform: translate3d(0, -15px, 0);
          }
          90% {
            transform: translate3d(0, -4px, 0);
          }
        }
        
        .cursor-reactive-icon {
          filter: brightness(1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .cursor-reactive-icon:hover {
          filter: brightness(1.2) drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
        }
      `}</style>
    </div>
  )
}
