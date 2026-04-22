# Agrimind - AI-Powered Agricultural Assistant

A comprehensive agricultural assistant designed specifically for Tanzanian farmers, providing localized, practical, and data-driven advice to increase crop yield, reduce losses, and improve farming decisions.

## Features

### Core Capabilities
1. **Crop Disease Diagnosis** - Identify crop diseases from images or descriptions
2. **Farming Advisory** - Get personalized advice for planting, growing, and harvesting
3. **Crop Recommendations** - Discover the best crops for your location and conditions
4. **Weather-Aware Decision Support** - Access weather information and agricultural insights
5. **Multi-Language Support** - Available in English and Swahili

### Local Context
- **Primary Region**: Tanzania (East Africa)
- **Climate**: Tropical, with rainy and dry seasons
- **Common Crops**: maize, rice, beans, cassava, tomatoes, onions
- **Farming Type**: Smallholder, low-cost, practical solutions

## Technology Stack

### Backend
- **Node.js** with Express.js
- **File Upload** with Multer
- **Image Processing** (simulated for demo)
- **Weather Data** (simulated for demo)
- **Modular Architecture** with separate service modules

### Frontend
- **React 18** with modern hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Responsive Design** for mobile and desktop

### Key Modules
- `diseaseDiagnosis.js` - Disease identification and treatment recommendations
- `farmingAdvisory.js` - Contextual farming advice
- `cropRecommendation.js` - Crop suitability scoring
- `weatherService.js` - Weather data and agricultural insights
- `languageService.js` - Multi-language support

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AGRIMIND_APP
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start the application**
   ```bash
   # Development mode (starts both backend and frontend)
   npm run dev
   
   # Or start separately:
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage

### Disease Diagnosis
1. Navigate to "Disease Diagnosis" section
2. Upload an image of affected crops or describe symptoms
3. Get detailed diagnosis with treatment recommendations
4. Receive prevention tips and cultural practices

### Farming Advisory
1. Select your crop type and growth stage
2. Choose your location in Tanzania
3. Optionally specify any issues you're facing
4. Receive personalized advice for your specific situation

### Crop Recommendations
1. Select your location and soil type
2. Choose your preferred growing season
3. Select your farming goals (profit, food security, etc.)
4. Get ranked crop recommendations with suitability scores

### Weather Information
1. Select your location in Tanzania
2. View current weather conditions
3. Check 7-day forecast
4. Receive agricultural recommendations based on weather

## API Endpoints

### Disease Diagnosis
- `POST /api/diagnose` - Analyze crop disease from image/description

### Farming Advisory
- `POST /api/advisory` - Get farming advice for specific conditions

### Crop Recommendations
- `POST /api/recommend-crops` - Get crop recommendations based on criteria

### Weather Information
- `GET /api/weather/:location` - Get weather data for location

### Language Support
- `GET /api/translate` - Translate text between English and Swahili

## Database Schema (Future Enhancement)

The application is designed to easily integrate with a database for:
- User profiles and farm data
- Historical disease diagnoses
- Weather data caching
- Crop performance tracking
- Local agricultural knowledge base

## Local Adaptation

### Tanzanian Agricultural Context
- **Regional Climate Data**: 10 major agricultural regions
- **Local Crop Varieties**: Region-specific recommendations
- **Seasonal Patterns**: Long rains (Mar-May), Short rains (Oct-Dec)
- **Common Challenges**: Pests, diseases, rainfall variability

### Language Support
- **English**: Full application support
- **Swahili**: Complete translation for farmer accessibility
- **Agricultural Terminology**: Localized farming terms and practices

## Future Enhancements

1. **Real Weather API Integration** - Connect to weather services
2. **Computer Vision** - Actual image analysis for disease detection
3. **Machine Learning** - Improve recommendation accuracy
4. **Mobile App** - Native mobile application
5. **SMS Integration** - Support for farmers without internet
6. **Market Information** - Crop prices and market data
7. **Community Features** - Farmer forums and knowledge sharing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact:
- Email: support@agrimind.co.tz
- Phone: +255 123 456 789

## Acknowledgments

- Tanzanian Ministry of Agriculture for agricultural data
- Local agricultural extension officers for expertise
- farming communities for feedback and testing
