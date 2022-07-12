import React from "react";

// === Utils === //
import { useRequest } from "@umijs/hooks";
import map from "lodash/map";

// === Styles === //
import styles from "../styles/Home.module.css";

export default function Home() {
  const resp = useRequest(() => fetch("/api/events").then((rs) => rs.json()));
  const { data, refresh } = resp;
  return (
    <div className={styles.container}>
      {map(data, (i) => (
        <p key={i._id}>
          {i._id},{i.emails}
        </p>
      ))}
      <button
        onClick={() => fetch("/api/events", { method: "POST" }).then(refresh)}
      >
        add11
      </button>
    </div>
  );
}
