import React, { useState, useEffect, useContext, useCallback } from "react";

// === Components === //
import { Button, Collapse, Table, Space, Row, Col, Input } from "antd";
import { CloudDownloadOutlined } from "@ant-design/icons";

// === Reducer === //
import { Web3Context } from "../reducer/web3Reducer";
import {
  WEB3_INIT,
  UPDATE_BLOCK_NUMBER,
  LOAD_MORE,
  UPDATE_BLOCK_DETAIL,
} from "../reducer/actions";

// === Utils === //
import map from "lodash/map";

import isEmpty from "lodash/isEmpty";

const { Panel } = Collapse;

const columns = [
  {
    title: "id",
    dataIndex: "transactionIndex",
    key: "transactionIndex",
    render: (v) => v + 1,
  },
  {
    title: "BlockHash",
    dataIndex: "blockHash",
    key: "blockHash",
  },
  {
    title: "From",
    dataIndex: "from",
    key: "from",
  },
  {
    title: "Remark",
    dataIndex: "transactionIndex",
    key: "transactionIndex",
    render: (v) => {
      return (
        <Space>
          <Button type="link" size="small">
            Detail
          </Button>
        </Space>
      );
    },
  },
];
function Scan() {
  const [rpc, setRpc] = useState("https://rpc-stage-sg.bankofchain.io");
  const { state, dispatch } = useContext(Web3Context);
  const { web3Instance, blockList } = state;
  const fetchNewestBlockNumber = useCallback(() => {
    return web3Instance.eth
      .getBlockNumber()
      .catch(() => -1)
      .then((nextBlockNumber) => {
        dispatch({ type: UPDATE_BLOCK_NUMBER, payload: nextBlockNumber });
      });
  }, [web3Instance, dispatch]);

  useEffect(() => {
    if (!isEmpty(web3Instance)) {
      fetchNewestBlockNumber();
    }
  }, [web3Instance, fetchNewestBlockNumber]);

  useEffect(() => {
    if (isEmpty(rpc)) return;
    dispatch({
      type: WEB3_INIT,
      payload: rpc,
    });
  }, [rpc, dispatch]);

  const loadMore = () => {
    dispatch({ type: LOAD_MORE });
  };

  const loadDetail = async (blockNumber = 0) => {
    if (blockNumber <= 0) return;
    const details = await web3Instance.eth
      .getBlock(blockNumber)
      .then((blockDetail) => {
        const { transactions } = blockDetail;
        const transactionRequestArray = map(
          transactions,
          web3Instance.eth.getTransaction
        );
        return Promise.all(transactionRequestArray);
      });
    dispatch({
      type: UPDATE_BLOCK_DETAIL,
      payload: { id: blockNumber, isInit: true, details },
    });
  };
  console.log("state, dispatch=", state);
  return (
    <Row gutter={[12, 12]} style={{ padding: 24 }}>
      <Col span={24}>
        <Input
          placeholder="rpc url"
          value={rpc}
          onChange={(v) => setRpc(v.target.value)}
        />
      </Col>
      <Col span={24}>
        <p>
          The Newest Block Number:
          <span style={{ fontWeight: "bold", marginLeft: "0.5rem" }}>
            {state.blockNumber}
          </span>
        </p>
      </Col>
      <Col span={24}>
        <Collapse accordion onChange={loadDetail}>
          {map(blockList, (blockItem) => {
            const { id, details, isInit } = blockItem;
            return (
              <Panel
                header={
                  <Space>
                    {id}
                    {isInit ? `(${details.length})` : <CloudDownloadOutlined />}
                  </Space>
                }
                key={id}
              >
                <Table
                  rowKey={(record) => record.transactionIndex}
                  size="small"
                  dataSource={details}
                  columns={columns}
                />
              </Panel>
            );
          })}
        </Collapse>
      </Col>
      <Col span={24}>
        <Button type="primary" style={{ width: "100%" }} onClick={loadMore}>
          Load More
        </Button>
      </Col>
    </Row>
  );
}

export default Scan;
