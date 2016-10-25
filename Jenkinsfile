node('master') {
    currentBuild.result = "SUCCESS"
    try {
       stage 'Checkout'
            checkout scm
       stage 'Test'
            env.NODE_ENV = "test"
            print "Environment will be : ${env.NODE_ENV}"

            sh 'node -v'
            sh 'npm prune'
            sh 'npm install'

       stage 'Build'
            sh 'npm run build'

       stage 'Deploy'

       stage 'Cleanup'
            echo 'prune and cleanup'
            sh 'npm prune'
            sh 'rm node_modules -rf'

    }catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }
}