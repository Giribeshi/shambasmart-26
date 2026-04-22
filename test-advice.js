// Test script for farming advice
const axios = require('axios');

async function testFarmingAdvice() {
  try {
    // First login to get token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'farmer@agrimind.co.tz',
      password: 'farmer123'
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful, got token');
    
    // Test farming advice with token
    const adviceResponse = await axios.post('http://localhost:5000/api/advisory', {
      crop: 'maize',
      stage: 'planting',
      location: 'arusha',
      issue: '',
      language: 'en'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Farming advice successful!');
    console.log('Response:', JSON.stringify(adviceResponse.data, null, 2));
    
  } catch (error) {
    console.error('Farming advice test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    }
  }
}

testFarmingAdvice();
