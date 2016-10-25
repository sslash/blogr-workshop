node('master') {
    currentBuild.result = "SUCCESS"

    wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm', 'defaultFg': 1, 'defaultBg': 2]) {

        try {
           stage 'Prepare'
                sh 'npm config set color always'
                checkout scm

                dir('server'){
                    sh 'npm install'
                }
                dir('react'){
                    sh 'npm install'
                }
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
                    sh 'cp package.json dist'
                }
                dir('react'){
                    sh 'npm run build'
                }

           stage 'Deploy'
                archiveArtifacts artifacts: 'server/dist/*.js, react/dist/*.js', fingerprint: true

                dir('server'){
                    sh 'scp -r dist/* app-3.dragon.lan:/opt/blogr'
                    sh 'scp -r dist/* app-4.dragon.lan:/opt/blogr'
                }

           stage 'Cleanup'
                dir('server'){
                    sh 'rm node_modules -rf'
                }
                dir('react'){
                    sh 'rm node_modules -rf'
                    sh 'rm dist -rf'
                }

        }catch (err) {
            currentBuild.result = "FAILURE"
            throw err
        }
    }
}