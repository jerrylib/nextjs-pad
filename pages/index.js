import React from 'react'

// === Utils === //
import { useRequest } from '@umijs/hooks'
import map from 'lodash/map'

// === Styles === //
import styles from '../styles/Home.module.css'
import Web3 from 'web3'
import { VAULT_ABI } from '../abis'

const web3 = new Web3("https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161")
const vaultContract = new web3.eth.Contract(VAULT_ABI, '0xd5C7A01E49ab534e31ABcf63bA5a394fF1E5EfAC')
vaultContract.methods.getStrategies().call().then(console.log)

export default function Home () {
  const resp = useRequest(() => fetch('/api/events').then(rs => rs.json()))
  const { data, refresh } = resp
  return (
    <div className={styles.container}>
      {map(data, i => (
        <p key={i._id}>
          {i._id},{i.emails}
        </p>
      ))}
      <button
        onClick={() => fetch('/api/events', { method: 'POST' }).then(refresh)}
      >
        add
      </button>
    </div>
  )
}
