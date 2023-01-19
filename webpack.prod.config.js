const HtmlWebpackPlugin=require('html-webpack-plugin');
const webpack=require('webpack');
const path=require('path');
const MiniCssExtractPlugin=require('mini-css-extract-plugin');
const {CleanWebpackPlugin}=require('clean-webpack-plugin');
const TerserWebpackPlugin=require('terser-webpack-plugin');

const PORT=process.env.PORT || 3000;

const optimization=()=>
{
    const config=
    {
        splitChunks:
        {
            cacheGroups:
            {
                vendors:
                {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                    enforce: true
                }
            }
        },
        minimize: true,
        minimizer:
        [
            new TerserWebpackPlugin({
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
			template:'./src/index.html',
		}),
		new MiniCssExtractPlugin(
		{
            filename:'styles.[contenthash].css',
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