import React, { useState, useEffect } from "react";
import { Table } from "antd";
import Web3 from "web3";
import dayjs from "dayjs";
import { VAULT_ABI, STRATEGY_ABI } from "../abis";
import { ETH_PROVIDER, VAULT_ADDRESS } from "../constant";
import styles from "../styles/web3.module.css";
import "antd/dist/antd.css";

export default function Home() {
  const columns = [
    {
      title: "策略名称",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        return (
          <a
            target="_blank"
            href={`https://etherscan.io/address/${record.address}`}
          >
            {text}
          </a>
        );
      },
    },
    {
      title: "上报估值",
      dataIndex: "totalDebt",
      key: "totalDebt",
    },
    {
      title: "策略估值",
      dataIndex: "estimatedTotalAssets",
      key: "estimatedTotalAssets",
    },
    {
      title: "稳定币数量",
      dataIndex: "checkBalance",
      key: "checkBalance",
    },
    {
      title: "最近上报时间",
      dataIndex: "lastReport",
      key: "lastReport",
      render: (text) => dayjs(text * 1000).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    const web3 = new Web3(ETH_PROVIDER);
    const vaultContract = new web3.eth.Contract(VAULT_ABI, VAULT_ADDRESS);
    console.log("vaultContract.methods", vaultContract.methods);
    let strategiesTemp = [];
    vaultContract.methods
      .getStrategies()
      .call()
      .then((strategies) => {
        let strategyContract = null;
        const strategiesRequestArray = strategies.map((item) => {
          strategyContract = new web3.eth.Contract(STRATEGY_ABI, item);
          const requestArray = [];
          requestArray.push(
            new Promise((resolve) => {
              resolve(item);
            })
          );
          requestArray.push(strategyContract.methods.name().call());
          requestArray.push(
            strategyContract.methods.estimatedTotalAssets().call()
          );
          requestArray.push(strategyContract.methods.checkBalance().call());
          requestArray.push(
            vaultContract.methods
              .strategies(item)
              .call()
              .then((info) => ({
                totalDebt: info.totalDebt,
                lastReport: info.lastReport,
              }))
          );
          return Promise.all(requestArray).then((strategyInfo) => ({
            address: strategyInfo[0],
            name: strategyInfo[1],
            estimatedTotalAssets: strategyInfo[2],
            checkBalance: strategyInfo[3],
            ...strategyInfo[4],
          }));
        });
        Promise.all(strategiesRequestArray).then((data) => {
          setDataSource(data);
        });
      });
    // get history block data
    web3.eth
      .getBalance("0x6b4b48ccdb446a109ae07d8b027ce521b5e2f1ff", 14855904)
      .then((balance) => {
        console.log("balance", balance);
      });
  }, []);

  return (
    <div>
      <Table
        rowKey="address"
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    </div>
  );
}
