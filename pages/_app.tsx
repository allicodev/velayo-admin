import type { AppProps } from "next/app";

import "@/styles/globals.css";
import "@/styles/main.styles.css";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import Head from "next/head";

import { store } from "@/provider/redux/store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "abel",
        },
      }}
    >
      <Provider store={store}>
        <Head>
          <link rel="shortcut icon" href="/logo-2.png" />
          <title>Velayo Web Admin</title>
          <meta
            name="description"
            content="This system is a responsible to manage data of velayo e-service app"
          />
        </Head>
        <Component {...pageProps} />
      </Provider>
    </ConfigProvider>
  );
}
