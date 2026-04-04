// HR Enterprise Platform — Jenkins Pipeline
// Declarative pipeline with 5 stages mirroring the Makefile targets.
// Designed to run on any Jenkins agent with Java 21, Maven, and Node 20.

pipeline {

    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        JAVA_HOME   = tool name: 'JDK-21', type: 'jdk'
        MAVEN_OPTS  = '-Xmx512m -XX:+TieredCompilation'
        NODE_ENV    = 'ci'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo "Building branch: ${env.BRANCH_NAME} | commit: ${env.GIT_COMMIT?.take(8)}"
            }
        }

        stage('Backend — Build & Test') {
            steps {
                dir('backend') {
                    sh 'mvn clean compile -q'
                    sh 'mvn test -pl hrapp-service -q'
                }
            }
            post {
                always {
                    junit 'backend/hrapp-service/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Governance') {
            steps {
                sh '''
                    VIOLATIONS=0

                    # Check 1: Java class names must start with Hr
                    for f in $(find backend/hrapp-service/src -name "*.java"); do
                        classname=$(basename "$f" .java)
                        if ! echo "$classname" | grep -q "^Hr"; then
                            echo "NAMING VIOLATION: $f has class '$classname' — must start with 'Hr'"
                            VIOLATIONS=1
                        fi
                    done

                    # Check 2: Service.java files must not log PII
                    for f in $(find backend/hrapp-service/src -name "*Service.java"); do
                        if grep -iE "LOGGER.*\\b(email|phone|salary|password|ssn)\\b" "$f" > /dev/null 2>&1; then
                            echo "PII VIOLATION: $f contains sensitive data in LOGGER statement"
                            VIOLATIONS=1
                        fi
                    done

                    if [ "$VIOLATIONS" -ne 0 ]; then
                        echo "BUILD FAILED: Governance checks found violations"
                        exit 1
                    fi
                '''
            }
        }

        stage('Frontend — Install & Lint') {
            steps {
                dir('frontend') {
                    sh 'npm ci --silent'
                    sh 'npm run lint'
                }
            }
        }

        stage('Frontend — Build') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: 'frontend/dist/**', fingerprint: true
                }
            }
        }

        stage('Package') {
            when {
                anyOf {
                    branch 'main'
                    branch 'release/*'
                }
            }
            steps {
                dir('backend') {
                    sh 'mvn package -DskipTests -q'
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: 'backend/hrapp-service/target/*.jar', fingerprint: true
                }
            }
        }

    }

    post {
        success {
            echo "Pipeline passed on ${env.BRANCH_NAME}."
        }
        failure {
            echo "Pipeline FAILED on ${env.BRANCH_NAME} at stage: ${env.STAGE_NAME}."
            // In a real setup: mail/Slack notification here
        }
        always {
            cleanWs()
        }
    }
}
