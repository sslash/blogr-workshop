node {
   stage 'Checkout'
   checkout scm

   stage 'Build'
   sh "${mvnHome}/bin/mvn clean install"
}