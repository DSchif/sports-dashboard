# Live Sports Dashboard

A real-time sports score dashboard built with React, Vite, and Tailwind CSS. Track live games from NFL, NBA, MLB, NHL, MLS, and Premier League.

![Sports Dashboard](https://img.shields.io/badge/React-18.3-blue) ![Vite](https://img.shields.io/badge/Vite-5.4-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

## Features

- 🏈 **Multi-Sport Support** - NFL, NBA, MLB, NHL, MLS, Premier League
- 🔴 **Live Updates** - Scores refresh automatically every 30 seconds
- 💾 **Persistent Dashboard** - Your selected games stay after page refresh
- ⚡ **Fast & Responsive** - Built with Vite for lightning-fast performance
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- 🌐 **ESPN API Integration** - Real-time data from ESPN's public API

## Screenshots

### Empty Dashboard
Welcome screen with "Add Live Game" button

### Active Dashboard
Multiple game cards showing live scores, team logos, and game status

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/sports-dashboard.git
cd sports-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Add Games**
   - Click the "+" button to open the game selection modal
   - Browse live games and upcoming matches (starting within 1 hour)
   - Click any game to add it to your dashboard

2. **View Live Scores**
   - Games display team logos, names, and current scores
   - Live games show an animated red indicator
   - Scores update automatically every 30 seconds

3. **Remove Games**
   - Click the "×" button on any game card to remove it

4. **Persistence**
   - Your selected games are saved to localStorage
   - Games remain on your dashboard even after refreshing the page

## Project Structure

```
sports-dashboard/
├── public/
│   └── _redirects          # SPA routing configuration
├── src/
│   ├── components/
│   │   ├── AddGameButton.jsx      # Plus button component
│   │   ├── GameCard.jsx           # Individual game display
│   │   └── GameSelectionModal.jsx # Game picker modal
│   ├── services/
│   │   └── espnApi.js             # ESPN API integration
│   ├── App.jsx                     # Main application
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── amplify.yml             # AWS Amplify build config
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
└── package.json
```

## Tech Stack

- **React 18** - UI framework
- **Vite 5** - Build tool and dev server
- **Tailwind CSS 3** - Utility-first CSS framework
- **ESPN API** - Live sports data

## Development Notes

### WSL2 Support

If developing in WSL2, the project uses polling for file watching:

```javascript
// vite.config.js
server: {
  watch: {
    usePolling: true  // Required for WSL2
  }
}
```

### API Rate Limiting

The ESPN API is public and free, but:
- Scores refresh every 30 seconds (configurable in `App.jsx`)
- Multiple sport leagues are fetched in parallel
- No API key required

### Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ support required
- LocalStorage required for persistence

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete AWS Amplify deployment instructions.

### Quick Deploy to AWS Amplify

```bash
# 1. Push to GitHub
git push origin main

# 2. Connect to Amplify via AWS Console
# 3. Auto-deploys on every push!
```

## Environment Variables

Currently, no environment variables are required. All API calls are made client-side to ESPN's public endpoints.

For future API integrations, create `.env`:

```bash
VITE_API_KEY=your-api-key
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] Add game search/filter
- [ ] Support for more sports leagues
- [ ] Customizable refresh intervals
- [ ] Dark mode
- [ ] Game notifications
- [ ] Share dashboard with unique URL
- [ ] Historical scores and stats

## License

MIT License - see LICENSE file for details

## Acknowledgments

- ESPN for providing free sports data API
- Vite team for amazing build tool
- React and Tailwind CSS communities

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/YOUR_USERNAME/sports-dashboard/issues)
- Documentation: See DEPLOYMENT.md for deployment help

---

**Built with ❤️ by [Your Name]**
