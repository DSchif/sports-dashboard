#!/bin/bash

# Sports Dashboard - Git Setup Script
# Run this from Git Bash or Windows Terminal (not WSL2)

echo "🚀 Setting up Git repository for Sports Dashboard..."

# Initialize git repository
git init

# Rename to main branch
git branch -M main

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Sports Dashboard - React + Vite + ESPN API

Features:
- Multi-sport live score tracking (NFL, NBA, MLB, NHL, MLS, Premier League)
- Real-time score updates every 30 seconds
- localStorage persistence
- Responsive Tailwind CSS design
- AWS Amplify deployment ready"

echo "✅ Git repository initialized!"
echo ""
echo "📝 Next steps:"
echo "1. Create GitHub repository at https://github.com/new"
echo "   - Name: sports-dashboard"
echo "   - Don't initialize with README (we already have files)"
echo ""
echo "2. Add remote and push:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/sports-dashboard.git"
echo "   git push -u origin main"
echo ""
echo "3. Then proceed with AWS Amplify deployment (see DEPLOYMENT.md)"
