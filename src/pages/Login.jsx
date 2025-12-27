import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const Login = () => {
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [isRightPanelActive, setIsRightPanelActive] = useState(false)
  
  // Sign In state
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [signInLoading, setSignInLoading] = useState(false)
  
  // Sign Up state
  const [signUpName, setSignUpName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpLoading, setSignUpLoading] = useState(false)

  const handleSignIn = async (e) => {
    e.preventDefault()
    setSignInLoading(true)

    const { error } = await signIn(signInEmail, signInPassword)
    
    if (error) {
      toast.error(error.message)
      setSignInLoading(false)
      return
    }

    toast.success('Welcome back!')
    navigate('/dashboard')
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setSignUpLoading(true)

    const { error } = await signUp(signUpEmail, signUpPassword, { name: signUpName })
    
    if (error) {
      toast.error(error.message)
      setSignUpLoading(false)
      return
    }

    toast.success('Account created! Please check your email to verify your account before logging in.')
    setSignUpLoading(false)
    setIsRightPanelActive(false) // Switch to sign in view
  }

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle()
    if (error) {
      console.error('Google Sign In Error:', error)
      toast.error(error.message || 'Failed to sign in with Google')
    }
  }

  return (
    <div className="flex justify-center items-center flex-col font-sans h-screen bg-gradient-to-br from-gray-200 to-gray-400 overflow-hidden relative p-4">
      <style>{`
        @keyframes show {
          0%, 49.99% { opacity: 0; z-index: 1; }
          50%, 100% { opacity: 1; z-index: 5; }
        }
      `}</style>
      
      <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-[10px] relative overflow-hidden w-full max-w-[768px] min-h-[480px] shadow-2xl">
        
        {/* Sign Up Container */}
        <div 
          className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-full md:w-1/2 
            ${isRightPanelActive 
              ? 'md:translate-x-[100%] opacity-100 z-[5] animate-[show_0.6s]' 
              : 'opacity-0 z-[1]'}`}
        >
          <form onSubmit={handleSignUp} className="flex items-center justify-center flex-col px-8 md:px-12 h-full text-center">
            <h1 className="font-bold m-0 text-text-main text-3xl mb-4">Create Account</h1>
            
            <div className="flex justify-center gap-4 mb-4">
              <button 
                type="button" 
                onClick={handleGoogleSignIn}
                className="border border-white/50 rounded-full w-10 h-10 flex items-center justify-center bg-white/30 hover:bg-white/50 transition-colors shadow-sm"
                title="Sign up with Google"
              >
                <GoogleIcon />
              </button>
            </div>

            <span className="text-xs text-text-main mb-2">or use your email for registration</span>
            <input 
              type="text" 
              placeholder="Name" 
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              required
              className="bg-white/50 border border-white/30 p-[12px_15px] my-2 w-full rounded-md placeholder:text-gray-500 text-text-main focus:outline-none focus:ring-2 focus:ring-white/50" 
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value.trim())}
              required
              className="bg-white/50 border border-white/30 p-[12px_15px] my-2 w-full rounded-md placeholder:text-gray-500 text-text-main focus:outline-none focus:ring-2 focus:ring-white/50" 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              required
              minLength={6}
              className="bg-white/50 border border-white/30 p-[12px_15px] my-2 w-full rounded-md placeholder:text-gray-500 text-text-main focus:outline-none focus:ring-2 focus:ring-white/50" 
            />
            <button 
              type="submit"
              disabled={signUpLoading}
              className="rounded-[20px] border border-primary bg-primary text-white text-xs font-bold py-3 px-11 tracking-[1px] uppercase transition-transform duration-80 ease-in active:scale-95 focus:outline-none hover:bg-primary-hover hover:border-primary-hover mt-4 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signUpLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
            <div className="mt-4 md:hidden text-sm text-text-main">
              Already have an account? <button type="button" onClick={() => setIsRightPanelActive(false)} className="text-primary font-bold hover:underline cursor-pointer">Sign In</button>
            </div>
          </form>
        </div>

        {/* Sign In Container */}
        <div 
          className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-full md:w-1/2 z-[2] 
            ${isRightPanelActive ? 'md:translate-x-[100%] opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <form onSubmit={handleSignIn} className="flex items-center justify-center flex-col px-8 md:px-12 h-full text-center">
            <h1 className="font-bold m-0 text-text-main text-3xl mb-4">Sign in</h1>
            
            <div className="flex justify-center gap-4 mb-4">
              <button 
                type="button" 
                onClick={handleGoogleSignIn}
                className="border border-white/50 rounded-full w-10 h-10 flex items-center justify-center bg-white/30 hover:bg-white/50 transition-colors shadow-sm"
                title="Sign in with Google"
              >
                <GoogleIcon />
              </button>
            </div>

            <span className="text-xs text-text-main mb-2">or use your account</span>
            <input 
              type="email" 
              placeholder="Email" 
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value.trim())}
              required
              className="bg-white/50 border border-white/30 p-[12px_15px] my-2 w-full rounded-md placeholder:text-gray-500 text-text-main focus:outline-none focus:ring-2 focus:ring-white/50" 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              required
              className="bg-white/50 border border-white/30 p-[12px_15px] my-2 w-full rounded-md placeholder:text-gray-500 text-text-main focus:outline-none focus:ring-2 focus:ring-white/50" 
            />
            <button 
              type="submit"
              disabled={signInLoading}
              className="rounded-[20px] border border-primary bg-primary text-white text-xs font-bold py-3 px-11 tracking-[1px] uppercase transition-transform duration-80 ease-in active:scale-95 focus:outline-none hover:bg-primary-hover hover:border-primary-hover mt-4 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signInLoading ? 'Signing In...' : 'Sign In'}
            </button>
            <div className="mt-4 md:hidden text-sm text-text-main">
              Don't have an account? <button type="button" onClick={() => setIsRightPanelActive(true)} className="text-primary font-bold hover:underline cursor-pointer">Sign Up</button>
            </div>
          </form>
        </div>

        {/* Overlay Container - Hidden on Mobile */}
        <div 
          className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 ease-in-out z-[100] 
            ${isRightPanelActive ? '-translate-x-[100%]' : ''}`}
        >
          <div 
            className={`bg-gradient-to-r from-primary-hover/90 to-primary/90 backdrop-blur-sm bg-no-repeat bg-cover bg-[0_0] text-white relative left-[-100%] h-full w-[200%] transition-transform duration-600 ease-in-out 
              ${isRightPanelActive ? 'translate-x-[50%]' : 'translate-x-0'}`}
          >
            {/* Overlay Left */}
            <div 
              className={`absolute flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 transition-transform duration-600 ease-in-out 
                ${isRightPanelActive ? 'translate-x-0' : '-translate-x-[20%]'}`}
            >
              <h1 className="font-bold m-0 text-white text-3xl mb-2">Welcome Back!</h1>
              <p className="text-sm font-thin leading-5 tracking-[0.5px] my-5 text-[#f1f1f1]">
                To keep connected with us please login with your personal info
              </p>
              <button 
                className="rounded-[20px] border border-white bg-transparent text-white text-xs font-bold py-3 px-11 tracking-[1px] uppercase transition-transform duration-80 ease-in active:scale-95 focus:outline-none hover:bg-white/10 cursor-pointer" 
                onClick={() => setIsRightPanelActive(false)}
              >
                Sign In
              </button>
            </div>

            {/* Overlay Right */}
            <div 
              className={`absolute right-0 flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 transition-transform duration-600 ease-in-out 
                ${isRightPanelActive ? 'translate-x-[20%]' : 'translate-x-0'}`}
            >
              <h1 className="font-bold m-0 text-white text-3xl mb-2">Hello, Welcome to GearGuard!</h1>
              <p className="text-sm font-thin leading-5 tracking-[0.5px] my-5 text-[#f1f1f1]">
                Enter your personal details and start journey with us
              </p>
              <button 
                className="rounded-[20px] border border-white bg-transparent text-white text-xs font-bold py-3 px-11 tracking-[1px] uppercase transition-transform duration-80 ease-in active:scale-95 focus:outline-none hover:bg-white/10 cursor-pointer" 
                onClick={() => setIsRightPanelActive(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
  )
}

export default Login
