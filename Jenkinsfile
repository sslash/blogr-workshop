node('master') {
    currentBuild.result = "SUCCESS"

    try {
       stage 'Checkout'
            checkout scm
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