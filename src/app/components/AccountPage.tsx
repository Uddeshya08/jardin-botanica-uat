import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Smartphone, Phone } from 'lucide-react';

export function AccountPage() {
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const [createAccountData, setCreateAccountData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    phoneNumber: ''
  });

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData({
      ...signInData,
      [name]: value
    });
  };

  const handleCreateAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateAccountData({
      ...createAccountData,
      [name]: value
    });
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign in submitted:', signInData);
  };

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Create account submitted:', createAccountData);
  };

  return (
    <div className="min-h-screen pt-32 pb-12" style={{ backgroundColor: '#e3e3d8' }}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Sign In Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 lg:p-10"
          >
            <h2 className="font-american-typewriter text-2xl mb-8 text-black text-center">Sign In</h2>

            <form onSubmit={handleSignInSubmit} className="space-y-5">
              {/* Email Address */}
              <div>
                <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                  Email Address*
                </label>
                <input
                  type="email"
                  name="email"
                  value={signInData.email}
                  onChange={handleSignInChange}
                  className="font-din-arabic w-full px-4 py-3.5 border bg-transparent text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                  style={{ borderColor: '#D8D2C7' }}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                  Password*
                </label>
                <div className="relative">
                  <input
                    type={showSignInPassword ? 'text' : 'password'}
                    name="password"
                    value={signInData.password}
                    onChange={handleSignInChange}
                    className="font-din-arabic w-full px-4 py-3.5 pr-12 border bg-transparent text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                    style={{ borderColor: '#D8D2C7' }}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/40 hover:text-black transition-colors"
                  >
                    {showSignInPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="text-right">
                <button type="button" className="font-din-arabic text-sm text-black/70 hover:text-black transition-colors">
                  Forgot your password?
                </button>
              </div>

              {/* Sign In Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="font-din-arabic w-full py-4 bg-black text-white hover:bg-black/90 transition-all duration-300 text-center"
              >
                Sign In
              </motion.button>

              {/* Divider */}
              <div className="relative py-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black/20"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="font-din-arabic text-sm text-black/70 px-4" style={{ backgroundColor: '#e3e3d8' }}>
                    Or Sign in with
                  </span>
                </div>
              </div>

              {/* SSO Options */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  className="font-din-arabic w-full flex items-center px-4 py-3.5 border bg-transparent text-black hover:bg-black/5 transition-all duration-300"
                  style={{ borderColor: '#D8D2C7' }}
                >
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span className="text-left">Continue with Apple</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  className="font-din-arabic w-full flex items-center px-4 py-3.5 border bg-transparent text-black hover:bg-black/5 transition-all duration-300"
                  style={{ borderColor: '#D8D2C7' }}
                >
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-left">Continue with Google</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  className="font-din-arabic w-full flex items-center px-4 py-3.5 border bg-transparent text-black hover:bg-black/5 transition-all duration-300"
                  style={{ borderColor: '#D8D2C7' }}
                >
                  <Smartphone className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-left">Continue with Phone</span>
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Create Account Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 lg:p-10"
          >
            <h2 className="font-american-typewriter text-2xl mb-8 text-black text-center">Create Account</h2>

            <form onSubmit={handleCreateAccountSubmit} className="space-y-5">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                    First Name*
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={createAccountData.firstName}
                    onChange={handleCreateAccountChange}
                    className="font-din-arabic w-full px-4 py-3.5 border bg-transparent text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                    style={{ borderColor: '#D8D2C7' }}
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={createAccountData.lastName}
                    onChange={handleCreateAccountChange}
                    className="font-din-arabic w-full px-4 py-3.5 border bg-transparent text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                    style={{ borderColor: '#D8D2C7' }}
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide whitespace-nowrap">
                  Date of Birth <span className="normal-case text-xs text-black/70 ml-2">— for birthday treats and quiet surprises.</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={createAccountData.dateOfBirth}
                  onChange={handleCreateAccountChange}
                  className="font-din-arabic w-full px-4 py-3.5 border bg-transparent text-black focus:outline-none focus:border-black transition-all duration-300"
                  style={{ borderColor: '#D8D2C7' }}
                />
              </div>

              {/* Email */}
              <div>
                <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                  Email Address*
                </label>
                <input
                  type="email"
                  name="email"
                  value={createAccountData.email}
                  onChange={handleCreateAccountChange}
                  className="font-din-arabic w-full px-4 py-3.5 border bg-transparent text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                  style={{ borderColor: '#D8D2C7' }}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                  Password*
                </label>
                <div className="relative">
                  <input
                    type={showCreatePassword ? 'text' : 'password'}
                    name="password"
                    value={createAccountData.password}
                    onChange={handleCreateAccountChange}
                    className="font-din-arabic w-full px-4 py-3.5 pr-12 border bg-transparent text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                    style={{ borderColor: '#D8D2C7' }}
                    placeholder="Create a secure password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/40 hover:text-black transition-colors"
                  >
                    {showCreatePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={createAccountData.phoneNumber}
                  onChange={handleCreateAccountChange}
                  className="font-din-arabic w-full px-4 py-3.5 border bg-transparent text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                  style={{ borderColor: '#D8D2C7' }}
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Spacer to align with SSO buttons from left column */}
              <div className="pt-6">
                {/* Create Account Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="font-din-arabic w-full py-4 bg-black text-white hover:bg-black/90 transition-all duration-300 text-center"
                >
                  Create Account
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}