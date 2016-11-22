node('master') {
    currentBuild.result = "SUCCESS"

    wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm', 'defaultFg': 1, 'defaultBg': 2]) {

        try {
           stage 'Prepare'
                print "Prepare for building"
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
           stage 'Test'
                env.NODE_ENV = "test"
                print "Environment will be: ${env.NODE_ENV}"
//                step([$class: 'JUnitResultArchiver', testResults: '**/test-results.xml'])

           stage 'Build dist'
                print "Build distribution files."
                parallel (
                  npm_build_server: {
                    dir('server'){
                        sh 'npm run build'
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
                    zip archive: false, dir: 'public', glob: 'dist/*', zipFile: 'public.zip'
                  },
                  zip_client: {
                    zip archive: false, dir: 'react', glob: 'dist/*', zipFile: 'client.zip'
                  },
                  zip_server: {
                    zip archive: false, dir: 'server', glob: 'node_modules/*,dist/*', zipFile: 'server.zip'
                  }
                )
           stage 'Deploy QA'
                print "Deploy to qa-servers."
                deployTo "app-3.dragon.lan"
                deployTo "app-4.dragon.lan"

           stage 'Verify'
                print "Verify that the build is working"
                dir('server'){
                    print "Verify server API"
                    sh 'API_URL=http://app-3.dragon.lan:3000 npm run test'
                    sh 'API_URL=http://app-4.dragon.lan:3000 npm run test'
                }

                dir('react'){
                    print "Verify react frontend."
                    sh 'npm run e2e  -- --baseUrl http://app-3.dragon.lan:3000'
                    sh 'npm run e2e  -- --baseUrl http://app-4.dragon.lan:3000'
                }
           stage 'Deploy Prod'
                print "Deploy to prod-servers."
                archiveArtifacts artifacts: '*.zip', fingerprint: true

        }catch (err) {
            currentBuild.result = "FAILURE"
            throw err
        }
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
