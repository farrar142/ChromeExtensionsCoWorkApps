import { useEffect, useState } from "react";
import {
  useAlarmNotice,
  useDM,
  useDmNotice,
  useProjectWebSocketAtom,
  useWebSocket,
} from "../Atom";

const BASE_URL = "wss://todobackend.honeycombpizza.link/ws";
export function useUserWebSocket(user) {
  const [DM, setDM] = useDM();
  const [notice, setNotice] = useDmNotice();
  const ws = useWebSocket(`${BASE_URL}/user/${user.id}/`);
  if (ws) {
    // ws.onopen = (e) => {};
    ws.onmessage = (e) => {
      const message = jp(e);
      const action = message.action;
      let res = {};
      if (message.data) res = message.data[0];
      if (action == "request_dm") {
        const exist = DM.filter((_res) => _res.id == res.id).length != 0;
        if (!exist) {
          setDM([...DM, res]);
        }
        if (notice.filter((_res) => _res.id == res.id).length == 0 && res.id)
          setNotice([...notice, { id: res.id, check: true }]);
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
