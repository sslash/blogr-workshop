node('master') {
    currentBuild.result = "SUCCESS"

    wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm', 'defaultFg': 1, 'defaultBg': 2]) {

        try {
           stage 'Prepare'
                print "Prepare for building"
                // cleanup workspace before build from old artifacts.
                deleteDir()

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

           stage 'Build dist'
                print "Build distribution files."
                parallel (
                  npm_build_server: {
                    dir('server'){
                        sh 'npm run build'
                        sh 'cp -r node_modules dist'
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
           stage 'Deploy QA'
                print "Deploy to qa-servers."
                parallel (
                  deploy_to_app3: {
                    deployTo "app-3.dragon.lan"
                  },
                  deploy_to_app4: {
                    deployTo "app-4.dragon.lan"
                  }
                )
           stage 'Verify'
                print "Verify that the build is working"
                dir('server'){
                    sh 'export API_URL=http://app-3.dragon.lan npm run test'
                    sh 'export API_URL=http://app-4.dragon.lan npm run test'
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
    sh "ssh jenkins@${server} '/usr/sbin/service node-app start --force'"
}
