import App from 'next/app';
import Head from 'next/head';
import { AppProvider } from '@shopify/polaris';
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';
import '@shopify/polaris/dist/styles.css';
import translations from '@shopify/polaris/locales/en.json';
import Cookies from 'js-cookie';
export default class MyApp extends App {
	render() {
		const { Component, pageProps } = this.props;
		const config = {
			apiKey: API_KEY,
			shopOrigin: Cookies.get('shopOrigin'),
			forceRedirect: true,
		};
		return (
			<>
				<Head>
					<title>Sample App</title>
					<meta charSet='utf-8' />
				</Head>
				<AppBridgeProvider config={config}>
					<AppProvider i18n={translations}>
						<Component {...pageProps} />
					</AppProvider>
				</AppBridgeProvider>
			</>
		);
	}
}
