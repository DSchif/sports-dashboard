# AWS Amplify Deployment Guide - Sports Dashboard

## Prerequisites

- AWS Account
- GitHub Account
- AWS CLI installed and configured (optional but recommended)
- Git installed

## Step 1: Set Up IAM Role for Amplify Operations

### Option A: Using AWS Console

1. **Log into AWS Console**
   - Navigate to IAM → Roles → Create Role

2. **Create the Role**
   - Select "Custom trust policy"
   - Replace the content with `aws-trust-policy.json` (update YOUR_ACCOUNT_ID)
   - Click "Next"

3. **Attach Permissions**
   - Click "Create policy" → JSON
   - Paste contents from `aws-iam-policy.json`
   - Name it: `AmplifyOperationsPolicy`
   - Create the policy

4. **Finalize Role**
   - Attach the `AmplifyOperationsPolicy` to your role
   - Role name: `AmplifyOperationsRole`
   - Description: "Operational role for managing Sports Dashboard in AWS Amplify"
   - Create role

5. **Note the Role ARN**
   - Copy the Role ARN (you'll need this later)
   - Format: `arn:aws:iam::YOUR_ACCOUNT_ID:role/AmplifyOperationsRole`

### Option B: Using AWS CLI

```bash
# Get your AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Update trust policy with your account ID
sed "s/YOUR_ACCOUNT_ID/$AWS_ACCOUNT_ID/g" aws-trust-policy.json > aws-trust-policy-updated.json

# Create the IAM policy
aws iam create-policy \
  --policy-name AmplifyOperationsPolicy \
  --policy-document file://aws-iam-policy.json \
  --description "Policy for managing Sports Dashboard on AWS Amplify"

# Get the policy ARN (note it down)
POLICY_ARN=$(aws iam list-policies --query "Policies[?PolicyName=='AmplifyOperationsPolicy'].Arn" --output text)

# Create the IAM role
aws iam create-role \
  --role-name AmplifyOperationsRole \
  --assume-role-policy-document file://aws-trust-policy-updated.json \
  --description "Operational role for managing Sports Dashboard in AWS Amplify"

# Attach the policy to the role
aws iam attach-role-policy \
  --role-name AmplifyOperationsRole \
  --policy-arn $POLICY_ARN

# Get the role ARN
aws iam get-role --role-name AmplifyOperationsRole --query 'Role.Arn' --output text
```

## Step 2: Initialize GitHub Repository

```bash
# Navigate to project directory
cd /mnt/c/Users/dschi/projects/sportsPointsDashboard/sports-dashboard

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Sports Dashboard - React + Vite + ESPN API"

# Create repository on GitHub
# Option 1: Using GitHub CLI (if installed)
gh repo create sports-dashboard --public --source=. --remote=origin --push

# Option 2: Manual
# - Go to https://github.com/new
# - Name: sports-dashboard
# - Create repository
# - Then run:
git remote add origin https://github.com/YOUR_USERNAME/sports-dashboard.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to AWS Amplify

### Option A: Using AWS Console (Recommended)

1. **Navigate to AWS Amplify**
   - Go to: https://console.aws.amazon.com/amplify

2. **Create New App**
   - Click "New app" → "Host web app"
   - Select "GitHub"
   - Click "Continue"

3. **Authorize GitHub**
   - If first time: Authorize AWS Amplify to access your GitHub account
   - Select repository: `sports-dashboard`
   - Select branch: `main`
   - Click "Next"

4. **Configure Build Settings**
   - App name: `sports-dashboard`
   - Environment: `production`
   - Build settings should auto-detect from `amplify.yml`
   - **Service role**: Select `AmplifyOperationsRole` (created in Step 1)
   - Click "Next"

5. **Review and Deploy**
   - Review all settings
   - Click "Save and deploy"
   - Wait 3-5 minutes for initial deployment

6. **Get Your App URL**
   - Once deployed, copy the URL (e.g., `https://main.d1234abcd.amplifyapp.com`)
   - Open in browser and test!

### Option B: Using AWS CLI

```bash
# Set variables
GITHUB_TOKEN="your_github_personal_access_token"
REPO_URL="https://github.com/YOUR_USERNAME/sports-dashboard"
ROLE_ARN="arn:aws:iam::YOUR_ACCOUNT_ID:role/AmplifyOperationsRole"

# Create Amplify app
APP_ID=$(aws amplify create-app \
  --name sports-dashboard \
  --repository $REPO_URL \
  --access-token $GITHUB_TOKEN \
  --iam-service-role-arn $ROLE_ARN \
  --build-spec file://amplify.yml \
  --platform WEB \
  --query 'app.appId' \
  --output text)

echo "App ID: $APP_ID"

# Create main branch
aws amplify create-branch \
  --app-id $APP_ID \
  --branch-name main \
  --enable-auto-build \
  --stage PRODUCTION

# Start a job to deploy
aws amplify start-job \
  --app-id $APP_ID \
  --branch-name main \
  --job-type RELEASE

# Get the default domain
aws amplify get-app --app-id $APP_ID --query 'app.defaultDomain' --output text
```

## Step 4: Configure CI/CD Features

### Enable Pull Request Previews

**Console:**
1. Go to Amplify Console → Your App
2. Click "Previews" in left menu
3. Click "Enable previews"
4. Select branches to preview (e.g., all branches)

**CLI:**
```bash
aws amplify update-branch \
  --app-id $APP_ID \
  --branch-name main \
  --enable-pull-request-preview
```

### Set Up Branch Protection (GitHub)

```bash
# Using GitHub CLI
gh repo edit --enable-auto-merge

# Create branch protection rule
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["amplify"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}'
```

## Step 5: Configure Custom Domain (Optional)

### If You Own a Domain

**Console:**
1. In Amplify Console → "Domain management"
2. Click "Add domain"
3. Enter your domain name (e.g., `sportsdashboard.com`)
4. Amplify will:
   - Create SSL certificate (via AWS ACM)
   - Configure DNS (if using Route 53)
   - Set up CDN

**If Using External DNS Provider:**
1. Add the CNAME records provided by Amplify to your DNS provider
2. Wait for DNS propagation (5-30 minutes)
3. Wait for SSL validation (5-30 minutes)

### DNS Configuration Examples

**Route 53:**
- Amplify configures automatically

**Namecheap/GoDaddy/Other:**
```
Type: CNAME
Host: www
Value: [provided by Amplify]

Type: CNAME
Host: @
Value: [provided by Amplify]
```

## Step 6: Verify Deployment

### Test Your Deployment

1. **Open the app**
   - Navigate to your Amplify URL
   - Verify the dashboard loads

2. **Test functionality**
   - Click "Add Live Game" button
   - Verify ESPN API fetches games
   - Add a game to dashboard
   - Refresh page - verify localStorage persistence works

3. **Test CI/CD**
   ```bash
   # Make a small change
   echo "<!-- CI/CD test -->" >> public/index.html

   # Commit and push
   git add .
   git commit -m "test: Verify CI/CD pipeline"
   git push origin main

   # Watch Amplify console for automatic build
   ```

4. **Monitor build**
   - Go to Amplify Console
   - Watch "Build history" for automatic deployment
   - Should complete in 3-5 minutes

## Step 7: Set Up Monitoring (Recommended)

### CloudWatch Alarms

```bash
# Create SNS topic for notifications
TOPIC_ARN=$(aws sns create-topic --name amplify-sports-dashboard-alerts --query 'TopicArn' --output text)

# Subscribe your email
aws sns subscribe \
  --topic-arn $TOPIC_ARN \
  --protocol email \
  --notification-endpoint your-email@example.com

# Create alarm for build failures
aws cloudwatch put-metric-alarm \
  --alarm-name amplify-build-failures \
  --alarm-description "Alert on Amplify build failures" \
  --metric-name BuildFailures \
  --namespace AWS/Amplify \
  --statistic Sum \
  --period 300 \
  --evaluation-periods 1 \
  --threshold 1 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions $TOPIC_ARN
```

### Access Logs (Optional)

**Console:**
1. Amplify Console → "Access control"
2. Enable access logs
3. Configure S3 bucket for log storage

## Security Best Practices

### 1. Enable Branch Protection
- Require pull request reviews before merging
- Require status checks to pass

### 2. Rotate Credentials
- Rotate GitHub tokens periodically
- Use AWS Secrets Manager for sensitive data

### 3. Use Environment Variables
For any future API keys:
```bash
# Add environment variable via CLI
aws amplify update-branch \
  --app-id $APP_ID \
  --branch-name main \
  --environment-variables VITE_API_KEY=your-key-here

# Or use Console: App Settings → Environment variables
```

### 4. Enable AWS CloudTrail
- Track all API calls to your Amplify app
- Audit who made changes and when

## Operational Commands

### View Recent Builds
```bash
aws amplify list-jobs --app-id $APP_ID --branch-name main --max-results 5
```

### Manual Deploy
```bash
aws amplify start-job --app-id $APP_ID --branch-name main --job-type RELEASE
```

### View App Details
```bash
aws amplify get-app --app-id $APP_ID
```

### Rollback to Previous Version
**Console:**
1. Go to Amplify Console → "Deployments"
2. Find previous successful build
3. Click "Redeploy this version"

**CLI:**
```bash
# List previous jobs to find job ID
aws amplify list-jobs --app-id $APP_ID --branch-name main

# Note the job ID of the version you want
# Redeploy that specific job
aws amplify start-job \
  --app-id $APP_ID \
  --branch-name main \
  --job-type RELEASE \
  --job-id <previous-job-id>
```

### Delete App (if needed)
```bash
aws amplify delete-app --app-id $APP_ID
```

## Troubleshooting

### Build Fails with "npm ci" Error
- Check Node.js version compatibility
- Update `amplify.yml` to specify Node version:
  ```yaml
  frontend:
    phases:
      preBuild:
        commands:
          - nvm install 18
          - nvm use 18
          - npm ci
  ```

### 404 Errors on Client-Side Routes
- Verify `public/_redirects` file exists
- Check Amplify Console → "Rewrites and redirects"

### Environment Variables Not Working
- Ensure variables are prefixed with `VITE_`
- Rebuild after adding variables

### SSL Certificate Stuck on "Pending"
- Check DNS records are correct
- Wait up to 30 minutes for validation
- Verify domain ownership

## Cost Monitoring

### Set Up Budget Alerts
```bash
aws budgets create-budget \
  --account-id $AWS_ACCOUNT_ID \
  --budget file://budget.json \
  --notifications-with-subscribers file://notifications.json
```

### View Current Costs
- AWS Cost Explorer: https://console.aws.amazon.com/cost-management/home
- Filter by service: AWS Amplify

## Support Resources

- **AWS Amplify Docs**: https://docs.amplify.aws
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html
- **AWS Support**: https://console.aws.amazon.com/support

## Next Steps After Deployment

1. ✅ Set up custom domain
2. ✅ Configure Google Analytics (optional)
3. ✅ Set up monitoring alerts
4. ✅ Create staging environment (develop branch)
5. ✅ Document your workflow for team members
6. ✅ Set up automated dependency updates (Dependabot)

---

**Your app is now live with automatic CI/CD!** 🎉

Every push to `main` will automatically build and deploy to production.
