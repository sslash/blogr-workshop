#!groovy
/**
 * Help for the DSL and keywords and syntax.
 * http://10.0.1.203/job/blogr-build-job/job/master/pipeline-syntax/
 */
node() {
    currentBuild.result = "SUCCESS"
    ansiColor('xterm') {
        try {
            mattermostSend message: "${env.JOB_NAME} - Build ${env.BUILD_NUMBER} started."

            /**
             * Prepare build.
             * Some cleanup of workspace, set variables.
             * Log some info so that its easy to see if something is wrong
             * in the environment if you inspect the job output.
             */
            stage('Prepare') {
                print "Prepare for building"
                sh 'rm -f *.zip'
                dir('server') {
                    sh 'rm -rf dist/*'
                }
                dir('react') {
                    sh 'rm -rf dist/*'
                }

                sh 'npm config set color always'
                sh 'npm config set loglevel warn'
                sh 'node -v'

                checkout scm
                parallel(
                        npm_install_server: {
                            dir('server') {
                                sh 'npm install'
                            }
                        },
                        npm_install_react: {
                            dir('react') {
                                sh 'npm install'
                            }
                        }
                )
            }

            /**
             * Run Automated Unit tests that are not depending on real
             * services, instead they should use mocks for remote services.
             */
            stage('Test') {
                env.NODE_ENV = "test"
                print "Run Unit tests"

                parallel(
                        npm_test_server: {
                            dir('server') {
                                sh 'npm run test'

                                // save test results
                                junit 'test-results.xml'
                            }
                        },
                        npm_test_react: {
                            dir('react') {
                                sh 'npm run test'

                                // save test results
                                junit 'test-results.xml'
                            }
                        }
                )
            }

            /**
             * Create distribution files.
             * Build the package that should be uploaded to the
             * servers and kept for release history.
             */
            stage('Build') {
                print "Build distribution files."
                parallel(
                        npm_build_server: {
                            dir('server') {
                                sh 'npm run build'
                            }
                        },
                        npm_build_react: {
                            dir('react') {
                                sh 'npm run build'
                            }
                        }
                )

                zip archive: false,
                        glob: """deploy.sh,
                             public/**/*,
                             react/dist/*,
                             server/node_modules/**/*,
                             server/dist/*,
                             server/migrations/*
                          """,
                        zipFile: 'blogr.zip'
            }

            /**
             * Deploy the distributionsfiles to the dev-servers.
             */
            stage('Deploy Dev') {
                print "Deploy to dev-servers."
                deployApp "development"
            }

            /**
             * Deploy the distributionsfiles to the qa-servers.
             *
             */
            stage('Deploy QA') {
                print "Deploy to qa-servers."
                timeout(time: 1, unit: 'HOURS') {
                    input 'Deploy to QA-servers?'
                }

                deployApp "test"
            }

            /**
             * Deploy distribution to production.
             * This is a very simple stage, if on master
             * and accept deploy to production, just copy the files to the servers.
             */
            stage('Deploy Prod') {
                print "Deploy to prod-servers."
                if (env.BRANCH_NAME == 'master') {
                    timeout(time: 1, unit: 'HOURS') {
                        input 'Deploy to Production?'
                    }

                    // should deploy to all prodservers.
                    deployApp "production"

                    // update SCM with tag so that we have
                    // log of every release that has been done
//                    def tag = tagRelease()

                    // archive the distributions files so that we have a
                    // file archive with every release.
                    archiveArtifacts artifacts: '*.zip', fingerprint: true
                    mattermostSend color: "good", message: "${env.JOB_NAME} - :star: New version ??? deployed to production :exclamation:"
                } else {
                    exit 0
                }
            }
        } catch (err) {
            mattermostSend color: "bad", message: "${env.JOB_NAME} - :-1: Build ${env.BUILD_NUMBER} FAILED."
            currentBuild.result = "FAILURE"
            throw err
        }
        mattermostSend color: "good", message: "${env.JOB_NAME} - :+1: Build ${env.BUILD_NUMBER} finished."
    }
}

/**
 * Update all nodes running service for env.
 * @param env to update
 */
def deployApp(environment) {
    def services = findServices(environment)
    for (service in services) {
        def hostname = sh script: "/usr/bin/dig +short -x ${service.Address}", returnStdout: true
        deployTo service.Address
        mattermostSend color: "good", message: "${env.JOB_NAME} - Build ${env.BUILD_NUMBER} " +
                "${service.ServiceName} deployed to ${hostname}"
    }
}

/**
 * Verify the deployment.
 * Perform the acceptance test, automated and manually.
 * If the release is accepted then perform release into
 * production.
 *
 * Automated End-To-End tests are done running against
 * the QA-servers.
 */
def deployTo(server) {
    print "Deploy to ${server}"
    sh "ssh -o StrictHostKeyChecking=no jenkins@${server} 'mkdir -p /opt/blogr/upload/${env.BUILD_NUMBER}'"
    sh "scp blogr.zip jenkins@${server}:/opt/blogr/upload/${env.BUILD_NUMBER}/blogr.zip"
    sh "ssh jenkins@${server} 'unzip -o -q /opt/blogr/upload/${env.BUILD_NUMBER}/blogr.zip -d /opt/blogr/upload/${env.BUILD_NUMBER}'"
    sh "ssh jenkins@${server} 'rm -rf /opt/blogr/upload/${env.BUILD_NUMBER}/blogr.zip'"
    sh "ssh jenkins@${server} 'cd /opt/blogr/upload/${env.BUILD_NUMBER} && sh ./deploy.sh &> /dev/null'"

    // check that app is running after deploy
    verifyDeploy(server)
}

/**
 * Run End-To-End tests so that we can see that the deployment actually worked.
 * @param server
 * @return
 */
def verifyDeploy(server) {
    sleep 1 // some sleep to let nodejs start after deploy.

    parallel(
            e2e_backend_tests: {
                // Run Live end-to-end tests to the backend API.
                dir('server') {
                    print "Verify server API"
                    sh "API_URL=http://${server}:3000 npm run e2e"
                }
            },
            e2e_frontend_tests: {
                // Run Live selenium tests to the frontend.
                dir('react') {
                    print "Verify react frontend."
                    sh "npm run e2e  -- --baseUrl http://${server}:3000"
                }
            }
    )
}

/**
 * Retrieve Nodes from Consul HTTP API.
 * https://www.consul.io/docs/agent/http.html
 */
def findServices(environment) {
    def response = httpRequest "http://consul.service.consul:8500/v1/catalog/service/app?tag=${environment}"
    return parseJsonText(response.content)
}

/**
 * Use serializable version of JsonSlurper that
 * use response objects that are serializable.
 * @param json text
 * @return json objects
 */
@NonCPS
def parseJsonText(json) {
    new groovy.json.JsonSlurperClassic().parseText(json)
}