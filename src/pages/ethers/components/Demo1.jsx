import React, { useCallback, useState } from 'react'

// === Components === //
import { Input, Row, Col, Space, Descriptions } from 'antd'

// === Utils === //
import * as ethers from 'ethers'

const { BigNumber, utils } = ethers

const Demo1 = () => {
  const [value, setValue] = useState('123456')

  let bigNumberValue, parseUnits, parseEther
  try {
    bigNumberValue = BigNumber.from(value)
  } catch (error) {
    console.error('BigNumber.from(value)=', error)
    bigNumberValue = BigNumber.from(0)
  }

  try {
    parseUnits = utils.parseUnits(value, 6)
  } catch (error) {
    console.error('utils.parseUnits(value, 6)=', error)
    parseUnits = BigNumber.from(0)
  }

  try {
    parseEther = utils.parseEther(value)
  } catch (error) {
    console.error('utils.parseEther(value)=', error)
    parseEther = BigNumber.from(0)
  }

  /**
   *
   * @param {*} v
   * @returns
   */
  const objRender = useCallback(v => {
    const type = typeof v
    const isBigNumber = v instanceof BigNumber
    if (isBigNumber) {
      return [
        <Descriptions.Item key="type" label="type">
          BigNumber
        </Descriptions.Item>,
        <Descriptions.Item key="value" label="value">
          {JSON.stringify(v)}
        </Descriptions.Item>,
        <Descriptions.Item key="toString" label="toString()">
          {v?.toString()}
        </Descriptions.Item>
      ]
    } else if (type === 'string') {
      return [
        <Descriptions.Item key="type" label="type">
          {type}
        </Descriptions.Item>,
        <Descriptions.Item key="value" label="value">
          {v}
        </Descriptions.Item>,
        <Descriptions.Item key="toString" label="toString()">
          {v?.toString()}
        </Descriptions.Item>
      ]
    } else if (type === 'boolean') {
      return <Descriptions.Item label="value">{`${v}`}</Descriptions.Item>
    }
  })

  return (
    <Descriptions title="Demo1" column={1} className="p-4">
      <Descriptions.Item label="Input">
        <Input size="small" style={{ width: 200 }} placeholder="Basic usage" value={value} onChange={event => setValue(event.target.value)} />
      </Descriptions.Item>
      <Descriptions.Item>
        <Descriptions title="value" className="px-4 bg-fuchsia-300">
          {objRender(value)}
        </Descriptions>
      </Descriptions.Item>
      <Descriptions.Item>
        <Descriptions title="ethers.BigNumber.from(value)" className="px-4">
          {objRender(bigNumberValue)}
        </Descriptions>
      </Descriptions.Item>
      <Descriptions.Item>
        <Descriptions title="ethers.utils.parseUnits(value, 6)" className="px-4 bg-fuchsia-300">
          {objRender(parseUnits)}
        </Descriptions>
      </Descriptions.Item>
      <Descriptions.Item>
        <Descriptions title="ethers.utils.parseEther(value)" className="px-4">
          {objRender(parseEther)}
        </Descriptions>
      </Descriptions.Item>
      <Descriptions.Item>
        <Descriptions title="ethers.utils.formatUnits(parseUnits, 6)" className="px-4 bg-fuchsia-300">
          {objRender(utils.formatUnits(parseUnits, 6))}
        </Descriptions>
      </Descriptions.Item>
      <Descriptions.Item>
        <Descriptions title="ethers.utils.formatEther(parseEther)" className="px-4">
          {objRender(utils.formatEther(parseEther))}
        </Descriptions>
      </Descriptions.Item>
      <Descriptions.Item>
        <Descriptions title="ethers.utils.parseEther.isZero()" className="px-4 bg-fuchsia-300">
          {objRender(parseEther.isZero())}
        </Descriptions>
      </Descriptions.Item>
    </Descriptions>
  )
}

export default Demo1
