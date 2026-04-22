// Comprehensive test script for Agrimind application
const axios = require('axios');

class AgrimindTester {
  constructor() {
    this.baseURL = 'http://localhost:5000';
    this.token = null;
    this.user = null;
    this.testResults = [];
  }

  async runTest(testName, testFunction) {
    console.log(`\n=== Testing: ${testName} ===`);
    try {
      const result = await testFunction();
      this.testResults.push({ test: testName, status: 'PASS', result });
      console.log(`PASS: ${testName}`);
      return result;
    } catch (error) {
      this.testResults.push({ test: testName, status: 'FAIL', error: error.message });
      console.log(`FAIL: ${testName} - ${error.message}`);
      throw error;
    }
  }

  async testAuthentication() {
    return await this.runTest('Authentication Flow', async () => {
      // Test login
      const loginResponse = await axios.post(`${this.baseURL}/api/auth/login`, {
        email: 'farmer@agrimind.co.tz',
        password: 'farmer123'
      });
      
      if (!loginResponse.data.user || !loginResponse.data.token) {
        throw new Error('Login response missing user or token');
      }
      
      this.token = loginResponse.data.token;
      this.user = loginResponse.data.user;
      
      // Set auth header for subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      
      // Test profile access
      const profileResponse = await axios.get(`${this.baseURL}/api/auth/profile`);
      
      if (!profileResponse.data.user) {
        throw new Error('Profile response missing user data');
      }
      
      return {
        login: loginResponse.data.user.name,
        profile: profileResponse.data.user.name,
        token: this.token ? 'Received' : 'Missing'
      };
    });
  }

  async testFarmingAdvice() {
    return await this.runTest('Farming Advice API', async () => {
      const adviceResponse = await axios.post(`${this.baseURL}/api/advisory`, {
        crop: 'maize',
        stage: 'planting',
        location: 'arusha',
        issue: '',
        language: 'en'
      });
      
      if (!adviceResponse.data.cropAdvice || !adviceResponse.data.regionalAdvice) {
        throw new Error('Farming advice response missing required data');
      }
      
      return {
        crop: adviceResponse.data.crop,
        stage: adviceResponse.data.stage,
        hasCropAdvice: !!adviceResponse.data.cropAdvice,
        hasRegionalAdvice: !!adviceResponse.data.regionalAdvice
      };
    });
  }

  async testDiseaseDiagnosis() {
    return await this.runTest('Disease Diagnosis API', async () => {
      const diagnosisResponse = await axios.post(`${this.baseURL}/api/diagnose`, {
        description: 'Yellow spots on maize leaves with brown centers',
        language: 'en'
      });
      
      if (!diagnosisResponse.data.problem) {
        throw new Error('Diagnosis response missing problem data');
      }
      
      return {
        problem: diagnosisResponse.data.problem,
        hasCauses: !!diagnosisResponse.data.causes,
        hasTreatments: !!diagnosisResponse.data.treatments
      };
    });
  }

  async testCropRecommendations() {
    return await this.runTest('Crop Recommendations API', async () => {
      const recommendationsResponse = await axios.post(`${this.baseURL}/api/recommend-crops`, {
        location: 'arusha',
        soilType: 'clay',
        season: 'long_rains',
        goals: ['profit', 'food_security'],
        language: 'en'
      });
      
      if (!recommendationsResponse.data.recommendations) {
        throw new Error('Crop recommendations response missing recommendations');
      }
      
      return {
        location: recommendationsResponse.data.location,
        recommendationsCount: recommendationsResponse.data.recommendations.length,
        hasScores: recommendationsResponse.data.recommendations.every(r => r.score)
      };
    });
  }

  async testWeatherInfo() {
    return await this.runTest('Weather Information API', async () => {
      const weatherResponse = await axios.get(`${this.baseURL}/api/weather/arusha`, {
        params: { language: 'en' }
      });
      
      if (!weatherResponse.data.current) {
        throw new Error('Weather response missing current data');
      }
      
      return {
        location: weatherResponse.data.location,
        hasCurrent: !!weatherResponse.data.current,
        hasForecast: !!weatherResponse.data.forecast,
        hasAdvisory: !!weatherResponse.data.advisory
      };
    });
  }

  async testLanguageSupport() {
    return await this.runTest('Language Support', async () => {
      // Test English
      const enResponse = await axios.post(`${this.baseURL}/api/advisory`, {
        crop: 'maize',
        stage: 'planting',
        location: 'arusha',
        issue: '',
        language: 'en'
      });
      
      // Test Swahili
      const swResponse = await axios.post(`${this.baseURL}/api/advisory`, {
        crop: 'maize',
        stage: 'planting',
        location: 'arusha',
        issue: '',
        language: 'sw'
      });
      
      if (enResponse.data.language !== 'en' || swResponse.data.language !== 'sw') {
        throw new Error('Language support not working correctly');
      }
      
      return {
        englishResponse: enResponse.data.language,
        swahiliResponse: swResponse.data.language,
        titlesDifferent: enResponse.data.sections.title !== swResponse.data.sections.title
      };
    });
  }

  async runAllTests() {
    console.log('=== AGRIMIND COMPREHENSIVE TEST SUITE ===');
    console.log('Testing all API endpoints and functionality...\n');
    
    try {
      // Run all tests in sequence
      await this.testAuthentication();
      await this.testFarmingAdvice();
      await this.testDiseaseDiagnosis();
      await this.testCropRecommendations();
      await this.testWeatherInfo();
      await this.testLanguageSupport();
      
      // Print summary
      console.log('\n=== TEST SUMMARY ===');
      const passed = this.testResults.filter(r => r.status === 'PASS').length;
      const failed = this.testResults.filter(r => r.status === 'FAIL').length;
      
      console.log(`Total Tests: ${this.testResults.length}`);
      console.log(`Passed: ${passed}`);
      console.log(`Failed: ${failed}`);
      
      if (failed === 0) {
        console.log('\n ALL TESTS PASSED! Application is working correctly.');
      } else {
        console.log('\n Some tests failed. Check the details above.');
      }
      
      // Print detailed results
      console.log('\n=== DETAILED RESULTS ===');
      this.testResults.forEach(result => {
        console.log(`${result.status}: ${result.test}`);
        if (result.status === 'PASS' && result.result) {
          console.log(`  Result: ${JSON.stringify(result.result, null, 2)}`);
        } else if (result.status === 'FAIL') {
          console.log(`  Error: ${result.error}`);
        }
      });
      
      return { passed, failed, results: this.testResults };
      
    } catch (error) {
      console.error('Test suite failed:', error.message);
      throw error;
    }
  }
}

// Run the comprehensive test
const tester = new AgrimindTester();
tester.runAllTests().catch(console.error);
