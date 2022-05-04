import { useEffect, useState } from "react";
import {
  useAlarmNotice,
  useDM,
  useDmNotice,
  useProjectWebSocketAtom,
  useWebSocket,
} from "../Atom";

const BASE_URL = "wss://todobackend.honeycombpizza.link/ws";
export function useUserNotifyWebSocket(user_id) {
  const [alarms, setAlarms] = useAlarmNotice(user_id);
  const ws = useWebSocket(`${BASE_URL}/personal_notify/${user_id}/`);
  if (ws) {
    // ws.onopen = (e) => {};
    ws.onmessage = (e) => {
      const message = jp(e);
      const action = message.action;
      let res = {};
      if (message.data) res = message.data[0];

      if (action == "new_comment") {
        setAlarms([...alarms, { ...res, check: false }]);
      }
    };
    ws.onclose = (e) => {
      // console.log("UWS closed");
    };
  }
}

function jp(e) {
  return JSON.parse(e.data);
}
