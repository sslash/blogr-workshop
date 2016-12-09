node() {
    currentBuild.result = "SUCCESS"
    ansiColor('xterm') {
        try {
           mattermostSend message: "${env.JOB_NAME} - Build ${env.BUILD_NUMBER} started."

           stage('Prepare'){
                print "Prepare for building"
                sh 'git config --global user.name "Jenkins"'
                sh 'git config --global user.email jenkins@dragon.lan'

                sh 'rm -f *.zip'
                dir('server'){
                    sh 'rm -rf dist/*'
                }
                dir('react'){
                    sh 'rm -rf dist/*'
                }

                sh 'npm config set color always'
                sh 'npm config set loglevel warn'
                sh 'node -v'

                checkout scm
                parallel (
                  npm_install_server: {
                    dir('server'){
                        sh 'npm install'
                    }
                  },
                  npm_install_react: {
                    dir('react'){
                        sh 'npm install'
                    }
                  }
                )
           }

           stage('Test'){
                env.NODE_ENV = "test"
                print "Run Unit tests"

                parallel (
                  npm_test_server: {
                    dir('server'){
                        sh 'npm run test'

                        // save test results
                        step([$class: 'JUnitResultArchiver', testResults: 'test-results.xml'])
                    }
                  },
                  npm_test_react: {
                    dir('react'){
                        sh 'npm run test'

                        // save test results
                        step([$class: 'JUnitResultArchiver', testResults: 'test-results.xml'])
                    }
                  }
                )
           }

           stage('Build dist'){
                print "Build distribution files."
                parallel (
                  npm_build_server: {
                    dir('server'){
                        sh 'npm run build'

                        sh 'cp -r node_modules dist'
                        sh 'cp -r migrations dist'
                    }
                  },
                  npm_build_react: {
                    dir('react'){
                        sh 'npm run build'
                    }
                  }
                )

                parallel (
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

           stage('Deploy QA'){
                print "Deploy to qa-servers."
                parallel (
                  deploy_to_app3: {
                    deployTo "app-3.dragon.lan"
                  },
                  deploy_to_app4: {
                    deployTo "app-4.dragon.lan"
                  }
                )
           }

           stage('Verify'){
                print "Verify that the build is working"
                dir('server'){
                    print "Verify server API"
                    sh 'API_URL=http://app-3.dragon.lan:3000 npm run e2e'
                    sh 'API_URL=http://app-4.dragon.lan:3000 npm run e2e'

                    // save test results
                    step([$class: 'JUnitResultArchiver', testResults: 'test-results.xml'])
                }

                dir('react'){
                    print "Verify react frontend."
                    sh 'npm run e2e  -- --baseUrl http://app-3.dragon.lan:3000'
                    sh 'npm run e2e  -- --baseUrl http://app-4.dragon.lan:3000'
                }
           }

           stage('Deploy Prod'){
                print "Deploy to prod-servers."
                timeout(time: 1, unit: 'HOURS') {
                  input 'Deploy to Production?'
                }
                archiveArtifacts artifacts: '*.zip', fingerprint: true
                newVersion = parseVersion()
                mattermostSend color: "good", message: "${env.JOB_NAME} - :star: Build ${env.BUILD_NUMBER} - New version ${newVersion} released in production :exclamation:"
           }
        }catch (err) {
            mattermostSend color: "bad", message: "${env.JOB_NAME} - :-1: Build ${env.BUILD_NUMBER} FAILED."
            currentBuild.result = "FAILURE"
            throw err
        }
        mattermostSend color: "good", message: "${env.JOB_NAME} - :+1: Build ${env.BUILD_NUMBER} finished."
    }
}

def deployTo(server){
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

// check out https://gist.github.com/amaksoft/b17408303d69c71498eaa39ea2ee3b01
def updateVersion(){
   print "Branch building: ${env.BRANCH_NAME}";
   if (env.BRANCH_NAME == 'master') {
        def VERSION = ""
        dir('react'){
             VERSION = sh (
                 script: 'npm version major',
                 returnStdout: true
             ).trim()
        }
        dir('server'){
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
    }else{
        // fail this job
        throw new RuntimeException("it is not allowed to update version if not on master branch.")
    }
}

// Parse the package.json and extract the version information.
def parseVersion() {
    def matcher = readFile('package.json') =~ '"version":."(.+)"'
    matcher ? matcher[0][1] : null
}
