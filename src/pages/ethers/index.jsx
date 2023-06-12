import React from 'react'

// === Components === //
import { Row, Col } from 'antd'
import Demo1 from './components/Demo1'
import Demo2 from './components/Demo2'

// === Utils === //
import { map } from 'lodash'

let url = 'https://remix.ethereum.org/#lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.18+commit.87f61d96.js'
url = 'https://replit.com?lite=true'
url = 'https://replit.com/@jerrylib/goodboy?embed=true&edit=true'

const demoArray = [
  <Row>
    <Col span={12} className="p-4">
      章节目录
      <li>章节目录</li>
      <li>章节目录</li>
      <li>章节目录</li>
    </Col>
    <Col span={12}>
      <iframe className="w-full h-64" src={url} frameBorder="0"></iframe>
    </Col>
  </Row>,
  <Demo1 />
]

const Ethers = () => {
  return (
    <Row className="w-full p-4">
      {map(demoArray, (item, index) => {
        return (
          <Col key={index} span={24} className="border border-solid border-red-400 mt-1">
            {item}
          </Col>
        )
      })}
    </Row>
  )
}

export default Ethers
