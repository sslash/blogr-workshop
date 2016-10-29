node('master') {
    currentBuild.result = "SUCCESS"

    wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm', 'defaultFg': 1, 'defaultBg': 2]) {

        try {
           stage 'Prepare'
                sh 'npm config set color always'
                checkout scm

                parallel (
                  npmbuild1: {
                    dir('server'){
                        sh 'npm install'
                    }
                  },
                  npmbuild2: {
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
                sh "ssh jenkins@app-3.dragon.lan 'mkdir -p /opt/upload/${env.BUILD_NUMBER}'"
                sh "rsync -r server.zip jenkins@app-3.dragon.lan:/opt/upload/${env.BUILD_NUMBER}/server.zip"
                sh "rsync -r client.zip jenkins@app-3.dragon.lan:/opt/upload/${env.BUILD_NUMBER}/client.zip"
                sh "rsync -r public.zip jenkins@app-3.dragon.lan:/opt/upload/${env.BUILD_NUMBER}/public.zip"
           stage 'Cleanup'
                deleteDir()

        }catch (err) {
            currentBuild.result = "FAILURE"
            throw err
        }
    }
}