import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Row, Col, Segmented } from 'antd'
import { ReducerContextProvider } from '../reducer/web3Reducer'
import { BarsOutlined, ApiOutlined } from '@ant-design/icons'

// === Utils === //
import get from 'lodash/get'

import './../styles/globals.css'

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
        <Row className="pt-4">
          <Col span={24} className="text-center">
            <Segmented
              value={router.route}
              options={[
                {
                  value: '/',
                  icon: <BarsOutlined onClick={() => router.push('/')} />
                },
                {
                  value: '/ethers',
                  icon: <ApiOutlined onClick={() => router.push('/ethers')} />
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
