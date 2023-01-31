const HtmlWebpackPlugin=require('html-webpack-plugin');
const webpack=require('webpack');
const path=require('path');
const MiniCssExtractPlugin=require('mini-css-extract-plugin');
const {CleanWebpackPlugin}=require('clean-webpack-plugin');
const TerserWebpackPlugin=require('terser-webpack-plugin');
const CompressionPlugin=require('compression-webpack-plugin');

const PORT=process.env.PORT || 3000;

const optimization=()=>
{
    const config=
    {
        runtimeChunk: true,
        splitChunks:
        {
            cacheGroups:
            {
                vendors:
                {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    name(module)
                    {
                        const packageName=module.context.
                                match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        return `npm.${packageName.replace('@','')}`;
                    },
                    reuseExistingChunk: true,
                }
            }
        },
        minimize: true,
        minimizer:
        [
            new TerserWebpackPlugin(
            {
                test: /\.(js|jsx)$/,
                parallel: true
            })
        ]
    };

    return config;
};

module.exports=
{
	mode:'production',
	entry:
	{
		app:path.resolve(__dirname,'./src/index.js'),
	},
    output:
    {
        path:path.resolve(__dirname,'./dist'),
        filename:'[name].[contenthash].js',
    },
	module:
	{
        rules:
        [
            {
                test:/\.(js|jsx)$/,
                exclude:/node_modules/,
                use:["babel-loader"],
            },
            {
            	test:/\.(s*)css$/,
                exclude:/node_modules/,
                use:
                [
                	MiniCssExtractPlugin.loader,
                    {
                        loader:'css-loader',
                        options:
                        {
                            modules:true,
                            sourceMap:true,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options:
                        {
                            sourceMap: true,
                            postcssOptions: { path: './postcss.config.js' }
                        }
                    },
                    {
                        loader:'sass-loader',
                        options:
                        {
                            sourceMap:true,
                        }
                    }
                ],
            }
        ]
    },
    resolve:
    {
        extensions:["*", ".js", ".jsx",".scss"],
    },
	plugins:
	[
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin(
		{
            title:'Users on React+Webpack',
			template:'./src/index.html',
		}),
		new MiniCssExtractPlugin(
		{
            filename:'styles.[contenthash].css',
        }),
        new CompressionPlugin(
        {
            test: /\.js(\?.*)?$/i,
            minRatio: 0.6,
            deleteOriginalAssets: true,
        }),
	],
    optimization: optimization(),
	devServer:
	{
		port:PORT,
		hot:true,
		static:'./dist'
	}
}