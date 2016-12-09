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
                sh 'git config --global user.name "Jenkins"'
                sh 'git config --global user.email jenkins@dragon.lan'

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

                                sh 'cp -r node_modules dist'
                                sh 'cp -r migrations dist'
                            }
                        },
                        npm_build_react: {
                            dir('react') {
                                sh 'npm run build'
                            }
                        }
                )

                parallel(
                        zip_public: {
                            zip archive: false, dir: 'public', glob: '**', zipFile: 'public.zip'
                        },
                        zip_client: {
                            zip archive: false, dir: 'react/dist', glob: '**', zipFile: 'client.zip'
                        },
                        zip_server: {
                            zip archive: false, dir: 'server/dist', glob: '**', zipFile: 'server.zip'
                        }
                )
            }

            /**
             * Deploy the distributionsfiles to the dev-servers.
             */
            stage('Deploy Dev') {
                print "Deploy to dev-servers."
                //deployTo "app-????.dragon.lan"
                mattermostSend color: "good", message: "${env.JOB_NAME} - Build ${env.BUILD_NUMBER} deployed to dev."
            }

            /**
             * Deploy the distributionsfiles to the qa-servers.
             * After this step, the same artifacts should be used and
             * the source code been tagged so that its easy to se
             * when running acceptance test that it is the same
             * running code used both in tests and later in production.
             *
             * The reason why the version is bumped already here is
             * that I want the last release step to be so simple,
             * just move the files to the server. Everything else
             * like version bumping, source code pusing and more
             * is already done in the release to QA stage to minimize
             * risk when deploying into production.
             * I dont want to sit at 6am with a merge conflict on
             * release day. :)
             */
            stage('Deploy QA') {
                print "Deploy to qa-servers."
                timeout(time: 1, unit: 'HOURS') {
                    input 'Deploy to QA-servers?'
                }

                updateVersion()
                archiveArtifacts artifacts: '*.zip', fingerprint: true

                deployTo "app-3.dragon.lan"
                mattermostSend color: "good", message: "${env.JOB_NAME} - Build ${env.BUILD_NUMBER} - New version ${newVersion} deployed to test."
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

                    deployTo "app-4.dragon.lan"
                    dir('react') {
                        newVersion = parseVersion()
                        print "New version ${newVersion} released in production!"
                        mattermostSend color: "good", message: "${env.JOB_NAME} - :star: Build ${env.BUILD_NUMBER} - New version ${newVersion} released to production :exclamation:"
                    }
                }else{
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
    sh "ssh jenkins@${server} '/usr/sbin/service node-app stop --force'"
    sh "ssh jenkins@${server} 'mkdir -p /opt/blogr/upload/${env.BUILD_NUMBER}'"
    sh "rsync -r server.zip jenkins@${server}:/opt/blogr/upload/${env.BUILD_NUMBER}/server.zip"
    sh "rsync -r client.zip jenkins@${server}:/opt/blogr/upload/${env.BUILD_NUMBER}/client.zip"
    sh "rsync -r public.zip jenkins@${server}:/opt/blogr/upload/${env.BUILD_NUMBER}/public.zip"

    sh "ssh jenkins@${server} 'unzip -q /opt/blogr/upload/${env.BUILD_NUMBER}'/server.zip -d /opt/blogr/upload/${env.BUILD_NUMBER}/server"
    sh "ssh jenkins@${server} 'unzip -q /opt/blogr/upload/${env.BUILD_NUMBER}'/public.zip -d /opt/blogr/upload/${env.BUILD_NUMBER}/public"
    sh "ssh jenkins@${server} 'unzip -q /opt/blogr/upload/${env.BUILD_NUMBER}'/client.zip -d /opt/blogr/upload/${env.BUILD_NUMBER}/public"

    sh "ssh jenkins@${server} 'realpath /opt/blogr/prev | xargs rm -rf'"
    sh "ssh jenkins@${server} 'rm /opt/blogr/prev'"
    sh "ssh jenkins@${server} 'mv /opt/blogr/latest /opt/blogr/prev'"
    sh "ssh jenkins@${server} 'ln -s /opt/blogr/upload/${env.BUILD_NUMBER} /opt/blogr/latest'"

    sh "ssh jenkins@${server} 'rm /opt/blogr/upload/${env.BUILD_NUMBER}'/*.zip"
    sh "ssh jenkins@${server} '/usr/sbin/service node-app start --force &> /dev/null'"
}

def updateVersion() {
    print "Branch building: ${env.BRANCH_NAME}";
        def VERSION = ""
        dir('react') {
            VERSION = sh(
                    script: 'npm version major',
                    returnStdout: true
            ).trim()
        }
        dir('server') {
            sh 'npm version major'
        }

        def branch = env.BRANCH_NAME
        def commitMsg = "New release ${VERSION}"
        def tagName = VERSION
        sh """ git add . && git commit -m \"${commitMsg}\" || true
               git push origin HEAD:refs/heads/${branch} || true
           """
        sh """ git tag -fa \"${tagName}\" -m \"${commitMsg}\"
               git push -f origin refs/tags/${tagName}:refs/tags/${tagName}
           """

        return VERSION;
}

def pushVersion(){

}

// Parse the package.json and extract the version information.
def parseVersion() {
    def matcher = readFile('package.json') =~ '"version":."(.+)"'
    matcher ? matcher[0][1] : null
}
