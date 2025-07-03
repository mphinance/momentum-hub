# 📈 mphinance Daily Dashboard

A comprehensive trading dashboard for real-time market monitoring, watchlist management, and trading journal analysis. Built with React, TypeScript, and Tailwind CSS, powered by **Polygon.io** for real-time market data.

![mphinance Dashboard](https://via.placeholder.com/1200x600/1A1A1A/39FF14?text=mphinance+Dashboard+Screenshot)

## ✨ Features

### 🎯 Real-Time Watchlist Management
- **Live Market Data**: Real-time stock prices powered by Polygon.io API
- **Advanced Search**: Search stocks by symbol or company name
- **Smart Tagging System**: Organize stocks with customizable tags (Swing, Day Trade, Long Term, Earnings)
- **Interactive Notes**: Add and edit trading notes directly in the table
- **Advanced Sorting**: Sort by symbol, price, change, volume, and more
- **Tag Filtering**: Filter watchlist by specific tags
- **Auto-Refresh**: Automatic data updates every 5 minutes
- **Share Functionality**: Generate shareable view-only watchlist URLs

### 📊 Trading Journal
- **Comprehensive Trade Tracking**: Log stocks, calls, and puts with detailed information
- **Options Support**: Full Greeks tracking (Delta, Gamma, Theta, Vega, Rho, IV)
- **Performance Analytics**: Advanced charts and heatmaps for trade analysis
- **Strategy Management**: Categorize trades by strategy with color coding
- **P&L Calendar**: Visual monthly and weekly P&L heatmaps
- **Time-based Analytics**: Performance breakdown by hour, day of week, and holding period
- **Asset Type Analysis**: Separate tracking for stocks, calls, and puts

### 📈 Performance Analytics
- **Weekly Heatmap**: Visual representation of P&L by time slots and days
- **Monthly Calendar**: Daily P&L tracking with detailed tooltips
- **Win Rate Analysis**: Performance metrics by strategy, asset type, and time
- **Greeks Analysis**: Options performance by IV ranges and DTE
- **Holding Period Analysis**: Performance by trade duration

### 🔗 Integration Features
- **Polygon.io Integration**: Real-time market data with professional-grade API
- **Webull Integration**: Connect your Webull account for automatic trade sync
- **Share Watchlists**: Generate unique URLs for sharing watchlists
- **Export Capabilities**: Data export for further analysis

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Polygon.io API key (free tier available)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/mphinance-dashboard.git
cd mphinance-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API Key**
   - Get your free API key from [Polygon.io](https://polygon.io/)
   - Update the API key in `src/services/polygonApi.ts`

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## 🔑 API Configuration

This dashboard uses **Polygon.io** for real-time market data. The API key is currently configured in the source code, but for production use, you should:

1. **Get your API key** from [Polygon.io](https://polygon.io/)
2. **Update the key** in `src/services/polygonApi.ts`
3. **For production**: Move the API key to environment variables

```typescript
// In production, use environment variables
const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY || 'your-api-key';
```

## 📱 Screenshots

### Real-Time Watchlist
![Watchlist](https://via.placeholder.com/1200x800/1A1A1A/39FF14?text=Real-time+Watchlist+-+Polygon.io+Data)

**Features shown:**
- Live price updates from Polygon.io
- Advanced stock search
- Tag-based filtering
- Inline note editing
- Share functionality

### Trading Journal
![Trading Journal](https://via.placeholder.com/1200x800/1A1A1A/BF00FF?text=Trading+Journal+-+Comprehensive+Trade+Tracking)

**Features shown:**
- Detailed trade logging
- Options Greeks tracking
- Strategy categorization
- P&L calculations
- Performance metrics

### Performance Analytics
![Performance Charts](https://via.placeholder.com/1200x800/1A1A1A/FFD700?text=Performance+Analytics+-+Advanced+Charts)

**Features shown:**
- Weekly P&L heatmap
- Monthly calendar view
- Win rate analysis
- Time-based performance
- Asset type breakdown

### Add Stock with Real Data
![Add Stock](https://via.placeholder.com/800x600/2C2C2C/39FF14?text=Add+Stock+Modal+-+Polygon.io+Integration)

**Features shown:**
- Real-time stock search via Polygon.io
- Company information lookup
- Live price data
- Tag assignment

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Data Source**: Polygon.io API
- **Deployment**: Netlify

## 📊 Data Sources

- **Stock Data**: Polygon.io API
- **Real-time Prices**: Live market data with professional-grade accuracy
- **Company Information**: Comprehensive ticker details
- **Market Status**: Real-time market status updates
- **Search**: Advanced ticker search capabilities

## 🎨 Design Philosophy

The dashboard follows a dark theme optimized for traders:
- **Primary Green (#39FF14)**: Profits, positive changes, call options
- **Primary Purple (#BF00FF)**: Losses, negative changes, put options
- **Dark Background (#1A1A1A)**: Reduced eye strain for long trading sessions
- **High Contrast**: Clear visibility of important data
- **Responsive Design**: Works on desktop, tablet, and mobile

## 📈 Trading Features

### Watchlist Capabilities
- Add stocks via real-time search
- Live price updates from Polygon.io
- Company information lookup
- Custom tagging system
- Inline note editing
- Advanced sorting and filtering
- Auto-refresh functionality
- Share functionality

### Journal Capabilities
- Stock and options trade logging
- Complete Greeks tracking
- Strategy-based categorization
- P&L calculations
- Performance analytics
- Time-based analysis
- Export capabilities

### Analytics Features
- Weekly P&L heatmaps
- Monthly calendar views
- Win rate analysis
- Asset type performance
- Time-based metrics
- Strategy effectiveness
- Risk management insights

## 🔧 Configuration

### Environment Variables
```env
# Add these to your .env file
VITE_POLYGON_API_KEY=your_polygon_api_key
```

### Customization
- **Colors**: Modify `tailwind.config.js` for custom color schemes
- **Tags**: Edit `src/utils/mockData.ts` to customize default tags
- **Strategies**: Modify `src/utils/mockTradeData.ts` for trading strategies
- **API Settings**: Update `src/services/polygonApi.ts` for API configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Polygon.io for professional-grade market data
- Lucide React for beautiful icons
- Tailwind CSS for styling system
- React community for excellent tooling

## 📞 Support

For support, email support@mphinance.com or create an issue on GitHub.

## 🚀 Deployment

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables for API keys
5. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🔒 Security Notes

- **API Keys**: Never commit API keys to version control
- **Environment Variables**: Use environment variables for sensitive data
- **Rate Limiting**: Polygon.io has rate limits - the app includes built-in throttling
- **CORS**: The app handles CORS properly for API requests

---

**Built with ❤️ for traders by traders**

*mphinance Dashboard - Your comprehensive trading companion powered by real market data*