// Simple test script to verify authentication
const axios = require('axios');

async function testAuth() {
  try {
    console.log('Testing authentication...');
    
    // Test login
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'farmer@agrimind.co.tz',
      password: 'farmer123'
    });
    
    console.log('Login successful!');
    console.log('User:', loginResponse.data.user);
    console.log('Token:', loginResponse.data.token ? 'Received' : 'Not received');
    
    // Test protected route with token
    const profileResponse = await axios.get('http://localhost:5000/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.token}`
      }
    });
    
    console.log('Profile access successful!');
    console.log('Profile:', profileResponse.data.user);
    
  } catch (error) {
    console.error('Authentication test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
    }
  }
}

testAuth();
