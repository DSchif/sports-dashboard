# Quick Start Guide - Deployment to AWS

## ⚠️ Important: Run from Windows, not WSL2

Due to file permission issues in WSL2, please run git commands from **Windows Git Bash** or **Windows Terminal**.

## Step-by-Step Deployment

### 1. Initialize Git Repository (Run from Windows)

Open **Git Bash** or **PowerShell** in Windows and navigate to your project:

```bash
# Navigate to project (Windows path)
cd C:\Users\dschi\projects\sportsPointsDashboard\sports-dashboard

# Run the setup script
bash setup-git.sh

# OR manually:
git init
git branch -M main
git add .
git commit -m "Initial commit: Sports Dashboard"
```

### 2. Create GitHub Repository

**Option A: Using GitHub CLI (gh)**
```bash
gh repo create sports-dashboard --public --source=. --remote=origin --push
```

**Option B: Manual**
1. Go to https://github.com/new
2. Repository name: `sports-dashboard`
3. Description: "Live sports score dashboard - React + Vite"
4. Visibility: Public (or Private)
5. **Don't** check "Initialize with README"
6. Click "Create repository"

Then connect and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/sports-dashboard.git
git push -u origin main
```

### 3. Set Up AWS IAM Role

Open **AWS Console** → **IAM** → **Roles** → **Create Role**

1. **Trust Policy**: Custom trust policy
   - Copy contents from `aws-trust-policy.json`
   - Replace `YOUR_ACCOUNT_ID` with your AWS account ID
   - You can find it: AWS Console → Top right → Account dropdown

2. **Permissions**: Create new policy
   - Click "Create policy" → JSON tab
   - Copy contents from `aws-iam-policy.json`
   - Name: `AmplifyOperationsPolicy`
   - Create policy

3. **Attach Policy**
   - Attach `AmplifyOperationsPolicy` to the role
   - Role name: `AmplifyOperationsRole`
   - Create role

4. **Note the ARN**
   - Copy the role ARN for later use
   - Format: `arn:aws:iam::123456789012:role/AmplifyOperationsRole`

### 4. Deploy to AWS Amplify

**AWS Console** → **AWS Amplify** → **New app**

1. **Connect Repository**
   - Select "GitHub"
   - Authorize AWS Amplify
   - Select repository: `sports-dashboard`
   - Branch: `main`

2. **Configure Build**
   - App name: `sports-dashboard`
   - Build settings: Auto-detected from `amplify.yml` ✅
   - **Service role**: Select `AmplifyOperationsRole`

3. **Deploy**
   - Click "Save and deploy"
   - Wait 3-5 minutes
   - Copy your app URL!

### 5. Test Your Deployment

1. Open the Amplify URL in your browser
2. Click "Add Live Game"
3. Select a game
4. Verify it displays correctly
5. Refresh page - verify persistence works

### 6. Test CI/CD

Make a small change and push:

```bash
# Make a change
echo "<!-- Test deployment -->" >> README.md

# Commit and push
git add README.md
git commit -m "test: Verify CI/CD pipeline"
git push origin main
```

Watch the Amplify console - it should automatically build and deploy! 🎉

## Quick Reference

### AWS Account ID
```bash
# In AWS Console
aws sts get-caller-identity --query Account --output text
```

### GitHub Personal Access Token
If using CLI deployment:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Scopes: `repo`, `admin:repo_hook`

### Amplify App URL
After deployment: `https://main.XXXXXXXX.amplifyapp.com`

## Troubleshooting

### "Permission denied" on git commands in WSL2
- **Solution**: Use Git Bash or Windows Terminal on Windows side

### Can't find AmplifyOperationsRole in Amplify
- **Solution**: Ensure you created the role in the same AWS region
- Check IAM → Roles → Search for "AmplifyOperationsRole"

### Build fails in Amplify
- Check build logs in Amplify console
- Verify `amplify.yml` is in repository root
- Ensure `package.json` has correct build command

### "Module not found" errors
- Clear cache and rebuild
- Verify all files were committed to git
- Check `.gitignore` didn't exclude important files

## Next Steps

After successful deployment:

- [ ] Set up custom domain (optional)
- [ ] Enable PR previews for feature branches
- [ ] Set up CloudWatch monitoring
- [ ] Configure budget alerts
- [ ] Add team members to AWS account

See **DEPLOYMENT.md** for complete documentation.

---

**Questions?** Check DEPLOYMENT.md or create an issue on GitHub.
