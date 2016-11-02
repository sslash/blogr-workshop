node('master') {
    currentBuild.result = "SUCCESS"

    wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm', 'defaultFg': 1, 'defaultBg': 2]) {

        try {
           stage 'Prepare'
                // cleanup workspace before build from old artifacts.
                deleteDir()

                sh 'npm config set color always'
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
                sh 'node -v'

                dir('server'){
                    sh 'npm install'
                }
                dir('react'){
                    sh 'npm install'
                }

           stage 'Build'
                dir('server'){
                    sh 'npm run build'
                    sh 'cp -r node_modules dist'
                }
                dir('react'){
                    sh 'npm run build'
                }

                zip archive: true, dir: 'public', glob: '**', zipFile: 'public.zip'
                zip archive: true, dir: 'react/dist', glob: '**', zipFile: 'client.zip'
                zip archive: true, dir: 'server/dist', glob: '**', zipFile: 'server.zip'

           stage 'Deploy'
                print "Deploy to servers."
                deployTo "app-3.dragon.lan"
                deployTo "app-4.dragon.lan"


        }catch (err) {
            currentBuild.result = "FAILURE"
            throw err
        }
    }
}

def deployTo(server){
    print "Deploy to ${server}"
    sh "ssh jenkins@${server} 'mkdir -p /opt/blogr/upload/${env.BUILD_NUMBER}'"
    sh "rsync -r server.zip jenkins@${server}:/opt/blogr/upload/${env.BUILD_NUMBER}/server.zip"
    sh "rsync -r client.zip jenkins@${server}:/opt/blogr/upload/${env.BUILD_NUMBER}/client.zip"
    sh "rsync -r public.zip jenkins@${server}:/opt/blogr/upload/${env.BUILD_NUMBER}/public.zip"

    sh "ssh jenkins@${server} 'unzip -q /opt/blogr/upload/${env.BUILD_NUMBER}'/server.zip -d /opt/blogr/upload/${env.BUILD_NUMBER}/server"
    sh "ssh jenkins@${server} 'unzip -q /opt/blogr/upload/${env.BUILD_NUMBER}'/public.zip -d /opt/blogr/upload/${env.BUILD_NUMBER}/public"
    sh "ssh jenkins@${server} 'unzip -q /opt/blogr/upload/${env.BUILD_NUMBER}'/client.zip -d /opt/blogr/upload/${env.BUILD_NUMBER}/public"

    sh "ssh jenkins@${server} 'rm /opt/blogr/prev'"
    sh "ssh jenkins@${server} 'mv /opt/blogr/latest /opt/blogr/prev'"
    sh "ssh jenkins@${server} 'ln -s /opt/blogr/upload/${env.BUILD_NUMBER} /opt/blogr/latest'"

    sh "ssh jenkins@${server} 'rm /opt/blogr/upload/${env.BUILD_NUMBER}'/*.zip"
    sh "ssh jenkins@${server} '/usr/sbin/service node-app restart --force'"
}
