import React, { useState, useEffect } from 'react';
import { Eye, Check } from 'lucide-react';

// --- Configuration ---
const CONFIG = {
  GOOGLE_CLIENT_ID: "750736304006-q7jhi4odic5omeg6uqsbi4v2tvlakof9.apps.googleusercontent.com", 
  FACEBOOK_APP_ID: "YOUR_FACEBOOK_APP_ID",   
  API_BASE_URL: "https://ella.wyvernp.id.vn/api/v1/auth"
};

// --- API Service ---
const authService = {
  login: async (provider, token) => {
    const endpoint = provider === 'google' ? '/google/login' : '/facebook/login';
    const payloadKey = provider === 'google' ? 'idToken' : 'accessToken';
    
    console.log(`Attempting ${provider} login with token: ${token} to ${CONFIG.API_BASE_URL}${endpoint}`);

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-custom-lang': 'en'
        },
        body: JSON.stringify({
          [payloadKey]: token
        })
      });

      if (!response.ok) throw new Error('Auth failed');
      
      const data = await response.json();
      console.log(`${provider} Login Success:`, data);
      alert(`${provider} Login Successful! Check console for response.`);
      return data;
    } catch (error) {
      console.error(`${provider} Login Error:`, error);
      // For demo purposes in preview, we show this alert
      alert(`[Demo Mode] ${provider} API call initiated.\nSee console for details.\n(Likely failed due to CORS/Network in preview)`);
      throw error;
    }
  }
};

const LoginPage = () => {
  // --- State Management ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Carousel Data
  const slides = [
    {
      title: "Building the <br/>Future...",
      desc: "Experience the next generation of artificial intelligence, designed to adapt to your nature."
    },
    {
      title: "Seamless <br/>Integration",
      desc: "Connect your workflow effortlessly with our advanced plugins and API support."
    },
    {
      title: "Secure by <br/>Default",
      desc: "Enterprise-grade encryption and privacy controls to keep your data safe and sound."
    }
  ];

  // --- Carousel Logic ---
  const changeSlide = (index) => {
    if (index === currentSlide || isTransitioning) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentSlide(index);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 500);
  };

  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % slides.length;
    changeSlide(nextIndex);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  // --- OAuth Handlers (Simulated for Preview) ---
  
  const handleGoogleLogin = () => {
    // In a real app, useGoogleLogin hook would provide this token
    const mockToken = "mock_google_id_token_123";
    authService.login('google', mockToken);
  };

  const handleFacebookLogin = () => {
    // In a real app, FacebookLogin component would provide this token
    const mockToken = "mock_facebook_access_token_456";
    authService.login('facebook', mockToken);
  };

  return (
    <div className="h-screen w-full relative overflow-hidden font-sans text-slate-900">
      {/* --- Global Styles & Animations --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        /* Keyframes */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes kenBurns { 0% { transform: scale(1.1); } 100% { transform: scale(1); } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }

        /* Animation Classes */
        .animate-ken-burns { animation: kenBurns 10s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slide-in { animation: slideIn 0.6s ease-out forwards; }
        
        .slide-enter { animation: fadeIn 0.5s ease-out forwards; }
        .slide-exit { animation: fadeOut 0.5s ease-out forwards; }

        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }

        /* Custom UI */
        .form-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.5);
        }
        .social-btn:hover { background-color: #f8fafc; transform: translateY(-1px); border-color: #cbd5e1; }
      `}</style>

      {/* --- FULL SCREEN BACKGROUND --- */}
      <div className="absolute inset-0 z-0 bg-black">
        <img 
          src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2000&auto=format&fit=crop" 
          alt="Nature Background" 
          className="w-full h-full object-cover opacity-90 animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
      </div>

      {/* --- MAIN CONTAINER --- */}
      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center justify-between px-6 lg:px-24 py-12">

        {/* --- LEFT SIDE: Brand & Visuals --- */}
        <div className="flex flex-col justify-between h-full max-w-lg text-white py-8 lg:py-0 w-full lg:w-auto">
          <div className="opacity-0 animate-fade-in">
            <h2 className="text-2xl font-bold tracking-wider flex items-center gap-2">
              <div className="w-2 h-8 bg-green-500 rounded-full"></div>
              ELLA AI
            </h2>
          </div>

          <div className="space-y-6 mt-auto lg:mb-20">
            <div className="min-h-[180px] transition-all duration-500">
              <h1 
                className={`text-4xl lg:text-6xl font-bold leading-tight shadow-black drop-shadow-lg ${isTransitioning ? 'slide-exit' : 'slide-enter'}`}
                dangerouslySetInnerHTML={{ __html: slides[currentSlide].title }}
              />
              <p 
                className={`text-slate-200 text-lg max-w-sm drop-shadow-md mt-6 ${isTransitioning ? 'slide-exit' : 'slide-enter'}`}
              >
                {slides[currentSlide].desc}
              </p>
            </div>
            
            <div className="flex gap-2 mt-8 opacity-0 animate-fade-in delay-300">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => changeSlide(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? 'w-8 bg-white opacity-100 shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                      : 'w-4 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: Login Form (Floating Card) --- */}
        <div className="w-full max-w-[480px] perspective-1000 mt-8 lg:mt-0">
          <div className="form-card w-full rounded-3xl shadow-2xl p-8 lg:p-10 relative opacity-0 animate-slide-in delay-100">
            
            {/* Floating Chat Bubble */}
            <button className="absolute -right-5 top-12 transform translate-x-1/2 bg-slate-800 p-1.5 rounded-full shadow-lg hover:bg-slate-700 transition group z-50 hover:scale-110 duration-200 border-2 border-white">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100" 
                  alt="Agent" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </button>

            {/* Header */}
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">Welcome Back</span>
              <h2 className="text-3xl font-bold text-slate-900">Log In</h2>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Standard Login submitted (not implemented in this demo)'); }}>
              
              <div className="space-y-1 group focus-within:text-green-700">
                <label className="text-sm font-medium text-slate-600 ml-1 transition-colors group-focus-within:text-green-800">Email</label>
                <input 
                  type="email" 
                  defaultValue="johndoe@nomail.com" 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-green-700 focus:ring-4 focus:ring-green-700/10 transition-all outline-none" 
                  placeholder="name@example.com" 
                />
              </div>

              <div className="space-y-1 group">
                <label className="text-sm font-medium text-slate-600 ml-1 transition-colors group-focus-within:text-green-800">Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    defaultValue="password123" 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-green-700 focus:ring-4 focus:ring-green-700/10 transition-all outline-none" 
                    placeholder="••••••••" 
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <Eye size={20} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-green-700 focus:ring-green-700 cursor-pointer" />
                  <span className="text-slate-500 group-hover:text-slate-700 transition">Remember me</span>
                </label>
                <a href="#" className="font-medium text-slate-900 hover:underline">Forgot Password?</a>
              </div>

              <button className="w-full bg-[#1a1a1a] text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-slate-900/10 active:scale-[0.99]">
                CONTINUE
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/80 px-2 text-slate-400 backdrop-blur-sm">Or</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="space-y-3">
              
              {/* Google Button */}
              <button 
                onClick={handleGoogleLogin}
                className="social-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-medium group border border-slate-200 bg-white transition-all"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
                <span className="flex-1 text-center pr-5">Log In with Google</span>
              </button>

              {/* Facebook Button */}
              <button 
                onClick={handleFacebookLogin}
                className="social-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-medium group border border-slate-200 bg-white transition-all"
              >
                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Facebook" />
                <span className="flex-1 text-center pr-5">Log In with Facebook</span>
              </button>

              <button className="social-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-medium group border border-slate-200 bg-white transition-all">
                <img src="https://www.svgrepo.com/show/512317/github-142.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Apple" />
                <span className="flex-1 text-center pr-5">Log In with Apple</span>
              </button>
            </div>

            <div className="text-center text-sm text-slate-500 mt-6">
              New User? <a href="#" className="font-bold text-slate-900 hover:underline">SIGN UP HERE</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;