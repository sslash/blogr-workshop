module.exports = {
    entry: './frontend/main.js',
    output: {
        filename: './public/bundle.js'
    },

    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets:  ["es2015", "react", "stage-0"]
          }
        }
      ]
    }
}
