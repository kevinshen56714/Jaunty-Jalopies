var HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const endpoint =
    process.env.NODE_ENV === 'production'
        ? `https://jaunty-jalopies.herokuapp.com/`
        : `http://localhost:4000`

module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                include: [path.join(__dirname, 'src'), /node_modules/],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'src/'),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new FaviconsWebpackPlugin('./public/favicon.ico'),
    ],
    devServer: {
        historyApiFallback: true,
    },
    externals: {
        // global app config object
        config: JSON.stringify({
            apiUrl: endpoint,
        }),
    },
}
