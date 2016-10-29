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
                    sh 'cp -r node_modules dist'
                    zip archive: true, dir: 'dist', glob: '', zipFile: 'server.zip'
                }
                dir('react'){
                    sh 'npm run build'
                }

           stage 'Deploy'


           stage 'Cleanup'
                dir('server'){
                    sh 'rm node_modules -rf'
                }
                dir('react'){
                    sh 'rm node_modules -rf'
                }

        }catch (err) {
            currentBuild.result = "FAILURE"
            throw err
        }
    }
}