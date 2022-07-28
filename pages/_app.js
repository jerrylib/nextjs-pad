import React from "react";
import { ReducerContextProvider } from "../reducer/web3Reducer";

import "antd/dist/antd.css";

function MyApp({ Component, pageProps }) {
  return (
    <ReducerContextProvider>
      <Component {...pageProps} />
    </ReducerContextProvider>
  );
}

export default MyApp;
