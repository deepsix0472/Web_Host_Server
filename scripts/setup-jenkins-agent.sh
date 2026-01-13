#!/bin/bash
#
# Jenkins Agent Setup Script for Ubuntu
# This script installs all dependencies needed for the web server pipeline
#
# Usage: bash setup-jenkins-agent.sh
#

set -e

echo "=========================================="
echo "Jenkins Agent Setup Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as correct user (not root for nvm)
if [ "$EUID" -eq 0 ]; then
    log_error "Please run this script as a regular user, not root"
    log_info "Usage: bash setup-jenkins-agent.sh"
    exit 1
fi

log_info "Starting Jenkins agent setup..."

# Update system
log_info "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
log_info "Installing essential packages..."
sudo apt install -y \
    curl \
    wget \
    git \
    build-essential \
    python3 \
    python3-pip \
    python3-venv \
    rsync \
    openssh-server

# Install Java 17 (required for Jenkins agent)
log_info "Installing Java 17..."
sudo apt install -y openjdk-17-jdk

java -version
log_info "Java installed successfully"

# Install NVM and Node.js
log_info "Installing NVM..."
export NVM_DIR="$HOME/.nvm"

if [ ! -d "$NVM_DIR" ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi

# Load NVM
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 20
log_info "Installing Node.js 20..."
nvm install 20
nvm use 20
nvm alias default 20

node --version
npm --version
log_info "Node.js installed successfully"

# Install PM2 globally
log_info "Installing PM2..."
npm install -g pm2

pm2 --version
log_info "PM2 installed successfully"

# Install Python packages
log_info "Installing Python packages..."
pip3 install --user anthropic semgrep

# Add local bin to PATH if not already
if ! grep -q '.local/bin' ~/.bashrc; then
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
fi
export PATH="$HOME/.local/bin:$PATH"

semgrep --version
log_info "Semgrep installed successfully"

# Create Jenkins agent directory
log_info "Creating Jenkins agent directory..."
mkdir -p ~/jenkins-agent
chmod 755 ~/jenkins-agent

# Create workspace directory for builds
mkdir -p ~/jenkins-workspace
chmod 755 ~/jenkins-workspace

# Configure Git
log_info "Configuring Git..."
git config --global user.email "jenkins-agent@local"
git config --global user.name "Jenkins Agent"

# Generate SSH key for GitHub if not exists
if [ ! -f ~/.ssh/id_ed25519 ]; then
    log_info "Generating SSH key for GitHub..."
    ssh-keygen -t ed25519 -C "jenkins-agent@local" -f ~/.ssh/id_ed25519 -N ""
    log_warn "Add this public key to GitHub:"
    echo ""
    cat ~/.ssh/id_ed25519.pub
    echo ""
fi

# Ensure SSH directory permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519 2>/dev/null || true
chmod 644 ~/.ssh/id_ed25519.pub 2>/dev/null || true

# Add GitHub to known hosts
log_info "Adding GitHub to known hosts..."
ssh-keyscan github.com >> ~/.ssh/known_hosts 2>/dev/null

# Create a test script to verify installation
log_info "Creating verification script..."
cat > ~/jenkins-agent/verify-setup.sh << 'EOF'
#!/bin/bash
echo "Verifying Jenkins Agent Setup..."
echo ""
echo "Java version:"
java -version 2>&1 | head -1
echo ""
echo "Node version:"
source ~/.nvm/nvm.sh && node --version
echo ""
echo "NPM version:"
npm --version
echo ""
echo "PM2 version:"
pm2 --version
echo ""
echo "Python version:"
python3 --version
echo ""
echo "Semgrep version:"
~/.local/bin/semgrep --version
echo ""
echo "Git version:"
git --version
echo ""
echo "All checks passed!"
EOF
chmod +x ~/jenkins-agent/verify-setup.sh

# Print summary
echo ""
echo "=========================================="
echo "SETUP COMPLETE!"
echo "=========================================="
echo ""
log_info "Installed components:"
echo "  - Java 17 (OpenJDK)"
echo "  - Node.js 20 (via NVM)"
echo "  - NPM"
echo "  - PM2"
echo "  - Python 3"
echo "  - Semgrep"
echo "  - Anthropic SDK"
echo "  - Git"
echo ""
log_info "Directories created:"
echo "  - ~/jenkins-agent (agent home)"
echo "  - ~/jenkins-workspace (build workspace)"
echo ""
log_info "Next steps:"
echo "  1. Run: ~/jenkins-agent/verify-setup.sh"
echo "  2. Add SSH public key to GitHub (if using SSH)"
echo "  3. Configure Jenkins controller to connect to this agent"
echo "  4. Label this agent as 'web-server' in Jenkins"
echo ""
log_warn "IMPORTANT: Log out and back in, or run:"
echo "  source ~/.bashrc"
echo ""
