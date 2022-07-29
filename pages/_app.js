import React from "react";
import { useRouter } from "next/router";
import { Row, Col, Segmented } from "antd";
import { ReducerContextProvider } from "../reducer/web3Reducer";
import { BarsOutlined, AppstoreOutlined } from "@ant-design/icons";

import "antd/dist/antd.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  return (
    <ReducerContextProvider>
      <Row gutter={[12, 12]} style={{ padding: "24px 0 0 24px" }}>
        <Col span={24}>
          <Segmented
            value={router.route}
            options={[
              {
                value: "/",
                icon: <BarsOutlined onClick={() => router.push("/")} />,
              },
              {
                value: "/scan",
                icon: <AppstoreOutlined onClick={() => router.push("/scan")} />,
              },
            ]}
          />
        </Col>
      </Row>
      <Component {...pageProps} />
    </ReducerContextProvider>
  );
}

export default MyApp;
