const HtmlWebpackPlugin=require('html-webpack-plugin');
const webpack=require('webpack');
const path=require('path');
const {CleanWebpackPlugin}=require('clean-webpack-plugin');

module.exports=
{
	mode:'development',
	entry:
	{
		app:path.resolve(__dirname,'./src/index.js'),
	},
    output:
    {
        path:path.resolve(__dirname,'./dist'),
        filename:'[name].js',
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
                	'style-loader',
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
	],
	devServer:
	{
		port:3000,
		hot:true,
		static:'./dist'
	}
}