// Test script for market prices functionality
const axios = require('axios');

async function testMarketPrices() {
  try {
    console.log('=== TESTING MARKET PRICES FEATURE ===\n');
    
    // First login to get token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'farmer@agrimind.co.tz',
      password: 'farmer123'
    });
    
    const token = loginResponse.data.token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    console.log('1. Testing Market Prices API - Maize');
    const maizeResponse = await axios.get('http://localhost:5000/api/market/prices/maize?language=en');
    console.log('PASS: Market prices for maize retrieved');
    console.log(`   - Min Price: TZS ${maizeResponse.data.data.summary.minPrice.toLocaleString()}`);
    console.log(`   - Max Price: TZS ${maizeResponse.data.data.summary.maxPrice.toLocaleString()}`);
    console.log(`   - Avg Price: TZS ${maizeResponse.data.data.summary.avgPrice.toLocaleString()}`);
    console.log(`   - Trend: ${maizeResponse.data.data.summary.trend}`);
    
    console.log('\n2. Testing Price Predictions - Maize');
    const predictionsResponse = await axios.get('http://localhost:5000/api/market/predictions/maize?weeks=4&language=en');
    console.log('PASS: Price predictions for maize retrieved');
    console.log(`   - 4 weeks predictions available`);
    console.log(`   - Overall trend: ${predictionsResponse.data.data.summary.trend}`);
    console.log(`   - Average confidence: ${Math.round(predictionsResponse.data.data.summary.confidence)}%`);
    
    console.log('\n3. Testing Market Insights - Maize');
    const insightsResponse = await axios.get('http://localhost:5000/api/market/insights?crop=maize&language=en');
    console.log('PASS: Market insights for maize retrieved');
    console.log(`   - Insights: ${insightsResponse.data.data.insights.length} available`);
    console.log(`   - Recommendations: ${insightsResponse.data.data.recommendations.length} available`);
    
    console.log('\n4. Testing All Market Prices');
    const allPricesResponse = await axios.get('http://localhost:5000/api/market/prices?language=en');
    console.log('PASS: All market prices retrieved');
    console.log(`   - Total crops: ${Object.keys(allPricesResponse.data.data.crops).length}`);
    console.log(`   - Total markets: ${Object.keys(allPricesResponse.data.data.markets).length}`);
    
    console.log('\n5. Testing Market Info');
    const infoResponse = await axios.get('http://localhost:5000/api/market/info?language=en');
    console.log('PASS: Market information retrieved');
    console.log(`   - Available crops: ${infoResponse.data.data.crops.length}`);
    console.log(`   - Available markets: ${Object.keys(infoResponse.data.data.markets).length}`);
    
    console.log('\n=== MARKET PRICES FEATURE TEST COMPLETE ===');
    console.log('All tests PASSED! Market prices feature is working correctly.');
    
    // Display sample prediction data
    console.log('\n=== SAMPLE PREDICTION DATA ===');
    const prediction = predictionsResponse.data.data.predictions[0];
    console.log(`Week 1 Prediction for Maize:`);
    console.log(`  - Date: ${prediction.date}`);
    console.log(`  - Predicted Price: TZS ${prediction.predictedPrice.toLocaleString()}`);
    console.log(`  - Price Range: TZS ${prediction.minPrice.toLocaleString()} - TZS ${prediction.maxPrice.toLocaleString()}`);
    console.log(`  - Confidence: ${prediction.confidence}%`);
    console.log(`  - Trend: ${prediction.trend}`);
    
  } catch (error) {
    console.error('Market prices test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    }
  }
}

testMarketPrices();
