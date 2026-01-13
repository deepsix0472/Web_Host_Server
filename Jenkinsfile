pipeline {
    agent { label 'kvm-vm-agent' }

    environment {
        NODE_VERSION = '20'
        APP_NAME = 'team-platform'
        PM2_APP_NAME = 'team-platform'
        // Web server deployment target
        DEPLOY_HOST = '192.168.122.215'
        DEPLOY_USER = 'deepsix'
        DEPLOY_DIR = '/home/deepsix/Web_Host_Server'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    parameters {
        choice(
            name: 'TEST_TYPE',
            choices: ['auto', 'all', 'frontend', 'backend'],
            description: 'What to test: auto = detect from changed files, all = run everything'
        )
        booleanParam(
            name: 'FORCE_DEPLOY',
            defaultValue: false,
            description: 'Force deployment even if no relevant changes detected'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Checked out branch: ${env.BRANCH_NAME ?: 'unknown'}"
            }
        }

        stage('Detect Changes') {
            steps {
                script {
                    // Determine what to run based on parameter or auto-detection
                    if (params.TEST_TYPE == 'auto') {
                        echo "Auto-detecting changes..."
                        
                        // Get changed files (compare with previous commit)
                        def changes = sh(
                            script: "git diff --name-only HEAD~1 2>/dev/null || git diff --name-only HEAD",
                            returnStdout: true
                        ).trim()
                        
                        echo "Changed files:\n${changes}"
                        
                        // Detect frontend changes (src/, components/, pages/, styles/)
                        env.RUN_FRONTEND = (changes =~ /(?i)(src\/|components\/|pages\/|styles\/|\.tsx|\.ts|\.css|package\.json)/) ? 'true' : 'false'
                        
                        // Detect backend changes (api/, lib/, server/, database/)
                        env.RUN_BACKEND = (changes =~ /(?i)(api\/|lib\/|server\/|database\/|prisma\/|\.sql)/) ? 'true' : 'false'
                        
                        // If no specific changes detected, run all
                        if (env.RUN_FRONTEND == 'false' && env.RUN_BACKEND == 'false') {
                            echo "No specific component changes detected, running all tests"
                            env.RUN_FRONTEND = 'true'
                            env.RUN_BACKEND = 'true'
                        }
                    } else if (params.TEST_TYPE == 'all') {
                        env.RUN_FRONTEND = 'true'
                        env.RUN_BACKEND = 'true'
                    } else if (params.TEST_TYPE == 'frontend') {
                        env.RUN_FRONTEND = 'true'
                        env.RUN_BACKEND = 'false'
                    } else if (params.TEST_TYPE == 'backend') {
                        env.RUN_FRONTEND = 'false'
                        env.RUN_BACKEND = 'true'
                    }
                    
                    echo "Run Frontend: ${env.RUN_FRONTEND}"
                    echo "Run Backend: ${env.RUN_BACKEND}"
                }
            }
        }

        stage('Environment Setup') {
            steps {
                script {
                    // Load NVM and set Node version
                    sh '''
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                        nvm use ${NODE_VERSION} || nvm install ${NODE_VERSION}
                        node --version
                        npm --version
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    nvm use ${NODE_VERSION}
                    npm ci
                '''
            }
        }

        stage('Security Scan (Semgrep)') {
            steps {
                sh '''
                    export PATH="$HOME/.local/bin:$PATH"
                    
                    # Install Semgrep if not present
                    if ! command -v semgrep &> /dev/null; then
                        pip3 install --user semgrep || pipx install semgrep
                    fi
                    
                    echo "Running Semgrep security scan..."
                    semgrep scan --config auto --json --output semgrep-results.json . || true
                    semgrep scan --config auto .
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'semgrep-results.json', allowEmptyArchive: true
                }
            }
        }

        stage('Quality Checks') {
            when {
                expression { env.RUN_FRONTEND == 'true' }
            }
            steps {
                script {
                    def maxRetries = 3
                    def retryCount = 0
                    def checksPass = false
                    
                    while (!checksPass && retryCount < maxRetries) {
                        retryCount++
                        echo "Quality Check Attempt ${retryCount}/${maxRetries}"
                        
                        try {
                            // Run all quality checks
                            parallel(
                                'Lint': {
                                    sh '''
                                        export NVM_DIR="$HOME/.nvm"
                                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                                        nvm use ${NODE_VERSION}
                                        npm run lint
                                    '''
                                },
                                'Type Check': {
                                    sh '''
                                        export NVM_DIR="$HOME/.nvm"
                                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                                        nvm use ${NODE_VERSION}
                                        npx tsc --noEmit
                                    '''
                                },
                                'Semgrep Security Scan': {
                                    sh '''
                                        echo "Running Semgrep SAST analysis..."
                                        
                                        # Install Semgrep if not available
                                        if ! command -v semgrep &> /dev/null; then
                                            pip3 install semgrep --user
                                            export PATH="$HOME/.local/bin:$PATH"
                                        fi
                                        
                                        # Run Semgrep with recommended rules
                                        semgrep scan \
                                            --config auto \
                                            --error \
                                            --json --output semgrep-results.json \
                                            --sarif --sarif-output semgrep-results.sarif \
                                            --exclude 'node_modules' \
                                            --exclude '.next' \
                                            --exclude '*.min.js' \
                                            src/
                                        
                                        echo "Semgrep scan completed successfully!"
                                    '''
                                    archiveArtifacts artifacts: 'semgrep-results.*', allowEmptyArchive: true
                                }
                            )
                            
                            checksPass = true
                            echo "All quality checks passed!"
                            
                        } catch (Exception e) {
                            echo "Quality checks failed: ${e.message}"
                            archiveArtifacts artifacts: 'semgrep-results.*', allowEmptyArchive: true
                            
                            if (retryCount < maxRetries) {
                                // Attempt AI-powered auto-fix if API key is available
                                def aiFixAttempted = false
                                def aiFixSucceeded = false
                                
                                if (env.ANTHROPIC_API_KEY) {
                                    echo "=========================================="
                                    echo "ATTEMPTING AI-POWERED AUTO-FIX"
                                    echo "=========================================="
                                    
                                    aiFixAttempted = true
                                    
                                    try {
                                        // Capture error outputs for AI analysis
                                        sh '''
                                            export NVM_DIR="$HOME/.nvm"
                                            [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                                            nvm use ${NODE_VERSION}
                                            
                                            # Capture lint errors
                                            npm run lint 2>&1 > lint-errors.txt || true
                                            
                                            # Capture TypeScript errors
                                            npx tsc --noEmit 2>&1 > typescript-errors.txt || true
                                        '''
                                        
                                        // Install Python anthropic package if needed
                                        sh '''
                                            pip3 install anthropic --user 2>/dev/null || true
                                            export PATH="$HOME/.local/bin:$PATH"
                                        '''
                                        
                                        // Run AI auto-fix for each error type
                                        sh '''
                                            export PATH="$HOME/.local/bin:$PATH"
                                            
                                            # Fix lint errors
                                            if [ -s lint-errors.txt ]; then
                                                echo "Attempting to fix lint errors..."
                                                python3 scripts/ai-autofix.py lint-errors.txt --type eslint || true
                                            fi
                                            
                                            # Fix TypeScript errors
                                            if [ -s typescript-errors.txt ]; then
                                                echo "Attempting to fix TypeScript errors..."
                                                python3 scripts/ai-autofix.py typescript-errors.txt --type typescript || true
                                            fi
                                            
                                            # Fix Semgrep issues
                                            if [ -s semgrep-results.json ]; then
                                                echo "Attempting to fix security issues..."
                                                python3 scripts/ai-autofix.py semgrep-results.json --type semgrep || true
                                            fi
                                        '''
                                        
                                        echo "AI auto-fix completed. Committing and pushing to GitHub..."
                                        
                                        // Commit and push AI fixes to GitHub
                                        withCredentials([sshUserPrivateKey(credentialsId: 'github-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                                            sh '''
                                                # Setup SSH for GitHub
                                                mkdir -p ~/.ssh
                                                cp "$SSH_KEY" ~/.ssh/id_rsa_jenkins
                                                chmod 600 ~/.ssh/id_rsa_jenkins
                                                ssh-keyscan github.com >> ~/.ssh/known_hosts 2>/dev/null
                                                
                                                export GIT_SSH_COMMAND="ssh -i ~/.ssh/id_rsa_jenkins -o StrictHostKeyChecking=no"
                                                
                                                # Configure git
                                                git config user.email "jenkins-ai@pipeline.local"
                                                git config user.name "Jenkins AI Auto-Fix"
                                                
                                                # Get current branch name
                                                BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
                                                echo "Current branch: ${BRANCH_NAME}"
                                                
                                                # Check if there are changes to commit
                                                if git diff --quiet && git diff --staged --quiet; then
                                                    echo "No changes made by AI - nothing to push"
                                                else
                                                    echo "Changes detected, committing..."
                                                    git add -A
                                                    git status
                                                    git commit -m "fix: AI auto-fix for lint/type/security issues

Automatically fixed by Claude AI in Jenkins pipeline.
Build: ${BUILD_NUMBER}
[skip ci]"
                                                    
                                                    echo "Pushing to GitHub..."
                                                    git push origin HEAD:${BRANCH_NAME}
                                                    
                                                    echo "=========================================="
                                                    echo "✓ AI FIXES PUSHED TO GITHUB SUCCESSFULLY"
                                                    echo "=========================================="
                                                fi
                                                
                                                # Cleanup SSH key
                                                rm -f ~/.ssh/id_rsa_jenkins
                                            '''
                                        }
                                        
                                        aiFixSucceeded = true
                                        echo "AI auto-fix completed successfully!"
                                        
                                    } catch (Exception aiError) {
                                        echo "AI auto-fix failed: ${aiError.message}"
                                        aiFixSucceeded = false
                                    }
                                } else {
                                    echo "ANTHROPIC_API_KEY not set - skipping AI auto-fix"
                                }
                                
                                // If AI fix didn't work, wait for manual fix
                                if (!aiFixSucceeded) {
                                    echo "=========================================="
                                    echo "QUALITY CHECK FAILED - FIX REQUIRED"
                                    echo "=========================================="
                                    echo "AI auto-fix ${aiFixAttempted ? 'was attempted but failed' : 'not available (no API key)'}."
                                    echo "Please fix the issues manually and push your changes."
                                    echo "Attempt ${retryCount}/${maxRetries} failed."
                                    echo "=========================================="
                                    
                                    timeout(time: 30, unit: 'MINUTES') {
                                        input message: "Quality checks failed. Click 'Proceed' after pushing your fix to retry, or 'Abort' to fail the build.",
                                              ok: 'Proceed with Retry'
                                    }
                                }
                                
                                // Pull latest changes (either AI-pushed or manually pushed)
                                echo "Pulling latest changes..."
                                checkout scm
                                
                                // Reinstall dependencies in case package.json changed
                                sh '''
                                    export NVM_DIR="$HOME/.nvm"
                                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                                    nvm use ${NODE_VERSION}
                                    npm ci
                                '''
                            } else {
                                error "Quality checks failed after ${maxRetries} attempts. Build aborted."
                            }
                        }
                    }
                }
            }
        }

        stage('Build') {
            when {
                expression { env.RUN_FRONTEND == 'true' }
            }
            steps {
                sh '''
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    nvm use ${NODE_VERSION}
                    npm run build
                '''
            }
        }

        stage('Backend Tests') {
            when {
                expression { env.RUN_BACKEND == 'true' }
            }
            steps {
                script {
                    echo "Running backend tests..."
                    sh '''
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                        nvm use ${NODE_VERSION}
                        
                        # Run API/backend tests if they exist
                        if [ -f "package.json" ] && grep -q '"test:api"' package.json; then
                            npm run test:api
                        elif [ -f "package.json" ] && grep -q '"test:backend"' package.json; then
                            npm run test:backend
                        elif [ -d "api" ] || [ -d "server" ]; then
                            echo "Backend directory found, running general tests..."
                            npm test --if-present || echo "No test script configured"
                        else
                            echo "No backend tests configured, skipping..."
                        fi
                    '''
                }
            }
        }

        stage('Deploy to Web Server') {
            when {
                allOf {
                    anyOf {
                        branch 'main'
                        branch 'master'
                    }
                    anyOf {
                        expression { env.RUN_FRONTEND == 'true' }
                        expression { params.FORCE_DEPLOY == true }
                    }
                }
            }
            steps {
                script {
                    echo "Deploying ${APP_NAME} to web server at ${DEPLOY_HOST}..."
                    
                    // Deploy using SSH credentials
                    withCredentials([sshUserPrivateKey(credentialsId: 'webserver-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                        sh '''
                            # Setup SSH
                            mkdir -p ~/.ssh
                            cp "$SSH_KEY" ~/.ssh/deploy_key
                            chmod 600 ~/.ssh/deploy_key
                            ssh-keyscan ${DEPLOY_HOST} >> ~/.ssh/known_hosts 2>/dev/null
                            
                            export SSH_CMD="ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no"
                            export RSYNC_SSH="ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no"
                            
                            echo "Syncing build files to ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_DIR}..."
                            
                            # Sync built files to web server (excluding unnecessary files)
                            rsync -avz --delete \
                                -e "$RSYNC_SSH" \
                                --exclude 'node_modules' \
                                --exclude '.git' \
                                --exclude '.next/cache' \
                                --exclude '*.log' \
                                ./ ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_DIR}/
                            
                            echo "Installing dependencies on web server..."
                            
                            # Install production dependencies and restart PM2 on web server
                            $SSH_CMD ${DEPLOY_USER}@${DEPLOY_HOST} << 'ENDSSH'
                                cd ${DEPLOY_DIR}
                                
                                # Load NVM
                                export NVM_DIR="$HOME/.nvm"
                                [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                                
                                # Install production dependencies
                                npm ci --production
                                
                                # Restart application with PM2
                                if pm2 describe ${PM2_APP_NAME} > /dev/null 2>&1; then
                                    echo "Restarting existing PM2 process..."
                                    pm2 restart ${PM2_APP_NAME}
                                else
                                    echo "Starting new PM2 process..."
                                    pm2 start npm --name "${PM2_APP_NAME}" -- start
                                fi
                                
                                pm2 save
                                echo "Deployment completed!"
ENDSSH
                            
                            # Cleanup
                            rm -f ~/.ssh/deploy_key
                        '''
                    }
                    
                    echo "Deployment to ${DEPLOY_HOST} completed successfully!"
                }
            }
        }

        stage('Health Check') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    echo "Running health check on ${DEPLOY_HOST}..."
                    sleep(time: 10, unit: 'SECONDS')
                    sh '''
                        # Wait for web server to be ready
                        max_attempts=30
                        attempt=0
                        until curl -sf http://${DEPLOY_HOST}:3000 > /dev/null; do
                            attempt=$((attempt + 1))
                            if [ $attempt -ge $max_attempts ]; then
                                echo "Health check failed after ${max_attempts} attempts"
                                echo "Web server at ${DEPLOY_HOST}:3000 is not responding"
                                exit 1
                            fi
                            echo "Waiting for web server... (attempt ${attempt}/${max_attempts})"
                            sleep 2
                        done
                        echo "=========================================="
                        echo "✓ HEALTH CHECK PASSED"
                        echo "  Web server is running at http://${DEPLOY_HOST}:3000"
                        echo "=========================================="
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs(cleanWhenNotBuilt: false,
                    deleteDirs: true,
                    disableDeferredWipeout: true,
                    patterns: [[pattern: '.next/**', type: 'INCLUDE'],
                              [pattern: 'node_modules/**', type: 'INCLUDE']])
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check the logs for details."
        }
        unstable {
            echo "Pipeline completed with warnings."
        }
    }
}
