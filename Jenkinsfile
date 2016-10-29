node('master') {
    currentBuild.result = "SUCCESS"

    wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm', 'defaultFg': 1, 'defaultBg': 2]) {

        try {
           stage 'Prepare'
                sh 'npm config set color always'
                checkout scm

                sh 'rm *.zip'
                sh 'rm react/*.zip'
                sh 'rm server/*.zip'

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
                sh "rsync -r server/server.zip jenkins@app-3.dragon.lan:/opt/upload/server-${env.BUILD_NUMBER}.zip"
                sh "rsync -r react/client.zip jenkins@app-3.dragon.lan:/opt/upload/client-${env.BUILD_NUMBER}.zip"
                sh "rsync -r public.zip jenkins@app-3.dragon.lan:/opt/upload/public-${env.BUILD_NUMBER}.zip"

           stage 'Cleanup'
                deleteDir()

        }catch (err) {
            currentBuild.result = "FAILURE"
            throw err
        }
    }
}