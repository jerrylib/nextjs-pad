import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Row, Col, Segmented } from 'antd'
import { ReducerContextProvider } from '../reducer/web3Reducer'
import { BarsOutlined, AppstoreOutlined, LineChartOutlined } from '@ant-design/icons'

// === Utils === //
import get from 'lodash/get'

import '@unocss/reset/tailwind.css'
import 'uno.css'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const isFull = get(router, 'query.full', false)
  return (
    <ReducerContextProvider>
      <Head>
        <title>Bank Of Chain Tools</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {!isFull && (
        <Row gutter={[12, 12]} style={{ padding: '24px 0 0 24px' }}>
          <Col span={24}>
            <Segmented
              value={router.route}
              options={[
                {
                  value: '/',
                  icon: <BarsOutlined onClick={() => router.push('/')} />
                },
                {
                  value: '/scan',
                  icon: <AppstoreOutlined onClick={() => router.push('/scan')} />
                },
                {
                  value: '/echart',
                  icon: <LineChartOutlined onClick={() => router.push('/echart')} />
                }
              ]}
            />
          </Col>
        </Row>
      )}
      <Component {...pageProps} />
    </ReducerContextProvider>
  )
}

export default MyApp
