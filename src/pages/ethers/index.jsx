import React from 'react'

// === Components === //
import { Row, Col } from 'antd'
import Demo1 from './components/Demo1'
import Demo2 from './components/Demo2'

// === Utils === //
import { map } from 'lodash'

const demoArray = [<Demo1 />, <Demo2 />]

let url = 'https://remix.ethereum.org/#lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.18+commit.87f61d96.js'
url = 'https://replit.com?lite=true'
url = 'https://replit.com/@jerrylib/goodboy?embed=true&edit=true'

const Ethers = () => {
  return (
    <Row className="w-full p-4">
      <Col span={24} className="b-1 border-solid b-color-red-400">
        <Row>
          <Col span={12}>
            章节目录
            <li>章节目录</li>
            <li>章节目录</li>
            <li>章节目录</li>
          </Col>
          <Col span={12}>
            <iframe className="w-full h-full mt-4 h-64" src={url} frameBorder="0"></iframe>
          </Col>
        </Row>
      </Col>
      {map(demoArray, item => {
        return (
          <Col span={24} className="b-1 border-solid border-color-red-400">
            {item}
          </Col>
        )
      })}
    </Row>
  )
}

export default Ethers
