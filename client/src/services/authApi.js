import { recordApiUsage, checkAndAlertThreshold } from './apiCreditTracker.js';

const API_URL = 'http://localhost:8080/api/auth';

// API Functions to communicate with backend
export const authAPI = {
  // Sign up new user
  signup: async (userData) => {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    // Track API usage for backend call
    const usage = recordApiUsage(1);
    checkAndAlertThreshold(usage);
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Signup failed');
    }
    
    return response.json();
  },
  
  // Login existing user
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    // Track API usage for backend call
    const usage = recordApiUsage(1);
    checkAndAlertThreshold(usage);
    
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    
    return response.json();
  }
};

// Token Management - stores JWT in browser
export const tokenManager = {
  // Save token to localStorage
  setToken: (token) => localStorage.setItem('jwtToken', token),
  
  // Get token from localStorage
  getToken: () => localStorage.getItem('jwtToken'),
  
  // Remove token (logout)
  removeToken: () => localStorage.removeItem('jwtToken'),
  
  // Save user info
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  
  // Get user info
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  // Remove user info
  removeUser: () => localStorage.removeItem('user')
};