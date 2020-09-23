import webpack from 'webpack';
import fs from 'fs';
import path from 'path';
import process from 'process';
import htmlWebPackPLugin from 'html-webpack-plugin';

export const workDir = process.cwd();
export const devDir = path.join(workDir, 'src');
export const pageDir = path.join(devDir, 'pages');

export const getMPAEntry = () => {
	const entry: CustomTS = {};
	const pages = fs.readdirSync(pageDir);
	pages.map((page) => (entry[page] = path.join(pageDir, page)));
	return entry;
};

export const baseConfig: webpack.Configuration = {
	// mode: ""
	entry: getMPAEntry(),
	output: {
		filename: 'index_[chunkhash:8].[ext]'
	},
	module: {
		rules: [
			{
				test: /\.js/,
				loader: 'babel-loader'
			},
			{
				test: /\.css/
				// loader: MiniCssExtractPlugin.loader
			}
		]
	},
	plugins: [
		new htmlWebPackPLugin({
			filename: 'index.html'
		})
		// new MiniCssExtractPlugin()
	],
	optimization: {
        splitChunks:{
            chunks: 'all',
            maxInitialRequests: 2
            // cacheGroups: [
            //     {
            //        name : 'vendor_[chunkhash:8]'
            //     }
            // ]
        }
	}
};
