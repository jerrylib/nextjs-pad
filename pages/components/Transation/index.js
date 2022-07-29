import React from "react";

// === Components === //
import { List, Skeleton } from "antd";
import {
  Approval,
  Transfer,
  Borrow,
  LendToStrategy,
} from "../../../constant/events";

// === Utils === //
import { get, map } from "lodash";
const oneLine = (text) => {
  return <p style={{ margin: 0 }}>{text}</p>;
};

const Transation = (props) => {
  const { data } = props;
  const { name, events, address } = data;

  if (name === Approval) {
    const text = oneLine(
      `from ${get(events, "[0].value")} to ${get(
        events,
        "[1].value"
      )} amounts ${get(events, "[2].value")}`
    );
    return (
      <List.Item>
        <Skeleton avatar loading={false} active>
          <List.Item.Meta title={data.name} description={text} />
        </Skeleton>
      </List.Item>
    );
  }
  if (name === Transfer) {
    const text = `from ${get(events, "[0].value")} to ${get(
      events,
      "[1].value"
    )} amounts ${get(events, "[2].value")}`;
    return (
      <List.Item>
        <Skeleton avatar loading={false} active>
          <List.Item.Meta title={data.name} description={text} />
        </Skeleton>
      </List.Item>
    );
  }
  if (name === Borrow) {
    const coins = get(events, "[0].value", []);
    const amounts = get(events, "[1].value", []);
    const text = `borrow ${coins.length} coins from ${address}`;
    return (
      <List.Item>
        <Skeleton avatar loading={false} active>
          <List.Item.Meta
            title={data.name}
            description={[
              text,
              ...map(coins, (c, i) => {
                return oneLine(`borrow ${c} amounts ${amounts[i]}`);
              }),
            ]}
          />
        </Skeleton>
      </List.Item>
    );
  }
  if (name === LendToStrategy) {
    console.log("data=", data);
    const coins = get(events, "[1].value", []);
    const amounts = get(events, "[2].value", []);
    const text = `from ${address} lend to ${get(
      events,
      "[0].value",
      ""
    )} lendValue ${get(events, "[3].value", "")}`;
    return (
      <List.Item>
        <Skeleton avatar loading={false} active>
          <List.Item.Meta
            title={data.name}
            description={[
              text,
              ...map(coins, (c, i) => {
                return oneLine(`lend ${c} amounts ${amounts[i]}`);
              }),
            ]}
          />
        </Skeleton>
      </List.Item>
    );
  }
  return (
    <List.Item>
      Unsupport Event: {name} {JSON.stringify(data, undefined, 2)}
    </List.Item>
  );
};

export default Transation;
