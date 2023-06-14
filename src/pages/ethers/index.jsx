import React from 'react'

// === Components === //
import { Row, Col } from 'antd'
import Demo1 from './components/Demo1'
import Demo2 from './components/Demo2'
import { ethers } from 'ethers'

// === Utils === //
import { map } from 'lodash'

let url = 'https://remix.ethereum.org/#lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.18+commit.87f61d96.js'
// url = 'https://replit.com?lite=true'
// url = 'https://replit.com/@jerrylib/goodboy?embed=true&edit=true'
url = 'https://codesandbox.io/embed/morning-sound-tgn965?fontsize=12&hidenavigation=1&theme=dark'
// url = 'https://codesandbox.io/s/?utm_source=landingpage'

const codePenUrl = 'https://codepen.io/pen/'
const replitUrl = 'https://replit.com/@jerrylib/goodboy?embed=true&edit=true'

const demoArray = [
  // <Row className="h-[800px]">
  //   <Col span={6} className="p-4">
  //     章节目录-codesandbox版
  //     <li>章节目录</li>
  //     <li>章节目录</li>
  //     <li>章节目录</li>
  //   </Col>
  //   <Col span={18}>
  //     <iframe
  //       className="w-full h-full"
  //       src={'https://codesandbox.io/s/?utm_source=landingpage'}
  //       style={{
  //         width: '100%',
  //         height: '100%',
  //         border: 0,
  //         overflow: 'hidden'
  //       }}
  //       title="morning-sound-tgn965"
  //       allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  //       sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  //     ></iframe>
  //   </Col>
  // </Row>,
  // <Row className="h-[800px]">
  //   <Col span={6} className="p-4">
  //     章节目录-codesandbox版
  //     <li>章节目录</li>
  //     <li>章节目录</li>
  //     <li>章节目录</li>
  //   </Col>
  //   <Col span={18}>
  //     <iframe
  //       className="w-full h-full"
  //       src={url}
  //       style={{
  //         width: '100%',
  //         height: '100%',
  //         border: 0,
  //         overflow: 'hidden'
  //       }}
  //       title="morning-sound-tgn965"
  //       allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  //       sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  //     ></iframe>
  //   </Col>
  // </Row>,
  // <Row className="h-[800px]">
  //   <Col span={6} className="p-4">
  //     章节目录-codepen版
  //     <li>章节目录</li>
  //     <li>章节目录</li>
  //     <li>章节目录</li>
  //   </Col>
  //   <Col span={18}>
  //     <iframe
  //       className="w-full h-full"
  //       src={codePenUrl}
  //       style={{
  //         width: '100%',
  //         height: '100%',
  //         border: 0,
  //         overflow: 'hidden'
  //       }}
  //       title="morning-sound-tgn965"
  //       allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  //       sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  //     ></iframe>
  //   </Col>
  // </Row>,
  // <Row className="h-[800px]">
  //   <Col span={6} className="p-4">
  //     章节目录-replit版
  //     <li>章节目录</li>
  //     <li>章节目录</li>
  //     <li>章节目录</li>
  //   </Col>
  //   <Col span={18}>
  //     <iframe
  //       className="w-full h-full"
  //       src={replitUrl}
  //       style={{
  //         width: '100%',
  //         height: '100%',
  //         border: 0,
  //         overflow: 'hidden'
  //       }}
  //       title="morning-sound-tgn965"
  //       allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  //       sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  //     ></iframe>
  //   </Col>
  // </Row>,
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
