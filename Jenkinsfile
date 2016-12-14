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
                sh 'git config user.name "Jenkins"'
                sh 'git config user.email jenkins@dragon.lan'

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

                zip archive: true,
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
                deployTo "app-4.dragon.lan"
                mattermostSend color: "good", message: "${env.JOB_NAME} - Build ${env.BUILD_NUMBER} deployed to dev."
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

                deployTo "app-3.dragon.lan"
                mattermostSend color: "good", message: "${env.JOB_NAME} - Build ${env.BUILD_NUMBER} deployed to qa-servers."
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
            stage('Verify') {
                print "Verify that the build is working"

                // Run Live end-to-end tests to the backend API.
                dir('server') {
                    print "Verify server API"
                    sh 'API_URL=http://app-3.dragon.lan:3000 npm run e2e'
                    sh 'API_URL=http://app-4.dragon.lan:3000 npm run e2e'

                    // save test results
                    junit 'test-results.xml'
                }

                // Run Live selenium tests to the frontend.
                dir('react') {
                    print "Verify react frontend."
                    sh 'npm run e2e  -- --baseUrl http://app-3.dragon.lan:3000'
                    sh 'npm run e2e  -- --baseUrl http://app-4.dragon.lan:3000'
                }
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
                    // deployTo "app-4.dragon.lan"

                    // update SCM with tag so that we have
                    // log of every release that has been done
                    def tag = tagRelease()

                    // archive the distributions files so that we have a
                    // file archive with every release.
                    archiveArtifacts artifacts: '*.zip', fingerprint: true
                    mattermostSend color: "good", message: "${env.JOB_NAME} - :star: New version ${tag} deployed to production :exclamation:"
                } else {
                    timeout(time: 0, unit: 'SECONDS') {
                        input 'Deploy to Production?'
                    }
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

def deployTo(server) {
    print "Deploy to ${server}"
    sh "ssh jenkins@${server} 'mkdir -p /opt/blogr/upload/${env.BUILD_NUMBER}'"
    sh "rsync -aR blogr.zip jenkins@${server}:/opt/blogr/upload/${env.BUILD_NUMBER}/blogr.zip"
    sh "ssh jenkins@${server} 'unzip -o -q /opt/blogr/upload/${env.BUILD_NUMBER}/blogr.zip -d /opt/blogr/upload/${env.BUILD_NUMBER}'"
    sh "ssh jenkins@${server} 'rm -rf /opt/blogr/upload/${env.BUILD_NUMBER}/blogr.zip'"
    sh "ssh jenkins@${server} 'cd /opt/blogr/upload/${env.BUILD_NUMBER} && sh ./deploy.sh &> /dev/null'"
}

/**
 * Tag release in SCM.
 * Example tag: 20161210+b45
 * The tag is the date and buildnumber of the release.
 *
 * @return the tagname
 */
def tagRelease() {
    def now = new Date().format('yyyyMMdd')
    def tagName = "r${now}+b${BUILD_NUMBER}"
    def commitMsg = "Release ${env.BUILD_TAG}"

    sh """ git tag -fa \"${tagName}\" -m \"${commitMsg}\"
           git push -f origin refs/tags/${tagName}:refs/tags/${tagName}
       """
    tagName
}