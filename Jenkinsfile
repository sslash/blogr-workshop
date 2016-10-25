node('master') {
    currentBuild.result = "SUCCESS"
    try {
       stage 'Checkout'
            checkout scm
       stage 'Test'
            env.NODE_ENV = "test"
            print "Environment will be : ${env.NODE_ENV}"

            sh 'node -v'
            sh '(cd server && npm install)'

       stage 'Build'
            sh '(cd server && npm run build)'

       stage 'Deploy'

       stage 'Cleanup'
            sh '(cd server && rm node_modules -rf)'

    }catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }
}