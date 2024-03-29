import React from 'react'

// === Components === //
import { List, Skeleton } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { Approval, Transfer, Borrow, LendToStrategy, Mint } from '../../constant/events'

// === Utils === //
import { get, map } from 'lodash'
import copy from 'copy-to-clipboard'

let i = 0
const oneLine = text => {
  return (
    <span key={i++} style={{ display: 'block' }}>
      {text}
    </span>
  )
}

const Transation = props => {
  const { data } = props
  const { name, events, address } = data

  if (name === Approval) {
    const text = oneLine(`approve ${address} from ${get(events, '[0].value')} to ${get(events, '[1].value')} amounts ${get(events, '[2].value')}`)
    return (
      <List.Item>
        <Skeleton avatar loading={false} active>
          <List.Item.Meta title={name} description={text} />
          <CopyOutlined onClick={() => copy(JSON.stringify(data))} />
        </Skeleton>
      </List.Item>
    )
  }
  if (name === Transfer) {
    const text = oneLine(`transfer ${address} from ${get(events, '[0].value')} to ${get(events, '[1].value')} amounts ${get(events, '[2].value')}`)
    return (
      <List.Item>
        <Skeleton avatar loading={false} active>
          <List.Item.Meta title={name} description={text} />
          <CopyOutlined onClick={() => copy(JSON.stringify(data))} />
        </Skeleton>
      </List.Item>
    )
  }
  if (name === Borrow) {
    const coins = get(events, '[0].value', [])
    const amounts = get(events, '[1].value', [])
    const text = oneLine(`borrow ${coins.length} coins from ${address}`)
    return (
      <List.Item>
        <Skeleton avatar loading={false} active>
          <List.Item.Meta
            title={name}
            description={[
              text,
              ...map(coins, (c, i) => {
                return oneLine(`borrow ${c} amounts ${amounts[i]}`)
              })
            ]}
          />
          <CopyOutlined onClick={() => copy(JSON.stringify(data))} />
        </Skeleton>
      </List.Item>
    )
  }
  if (name === Mint) {
    const coins = get(events, '[1].value', [])
    const amounts = get(events, '[2].value', [])
    const text = oneLine(`mint ${address} to ${get(events, '[0].value', '')} mintAmount ${get(events, '[3].value', '')}`)
    return (
      <List.Item>
        <Skeleton avatar loading={false} active>
          <List.Item.Meta
            title={name}
            description={[
              text,
              ...map(coins, (c, i) => {
                return oneLine(`deposit asset ${c} amounts ${amounts[i]}`)
              })
            ]}
          />
          <CopyOutlined onClick={() => copy(JSON.stringify(data))} />
        </Skeleton>
      </List.Item>
    )
  }

  if (name === LendToStrategy) {
    const coins = get(events, '[1].value', [])
    const amounts = get(events, '[2].value', [])
    const text = oneLine(`from ${address} lend to ${get(events, '[0].value', '')} lendValue ${get(events, '[3].value', '')}`)
    return (
      <List.Item>
        <Skeleton avatar loading={false} active>
          <List.Item.Meta
            title={name}
            description={[
              text,
              ...map(coins, (c, i) => {
                return oneLine(`lend ${c} amounts ${amounts[i]}`)
              })
            ]}
          />
          <CopyOutlined onClick={() => copy(JSON.stringify(data))} />
        </Skeleton>
      </List.Item>
    )
  }
  return (
    <List.Item>
      Unsupport Event: {name} <CopyOutlined onClick={() => copy(JSON.stringify(data))} />
    </List.Item>
  )
}

export default Transation
