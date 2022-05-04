import { useEffect, useState } from "react";
import { AUTH } from "../API/todo";
import { useDM, useProjectWebSocketAtom, useWebSocket } from "../Atom";
import { useAccountsInfo, useToken } from "../hooks";

const BASE_URL = "wss://todobackend.honeycombpizza.link/ws";
export function useDMWebSocket(friend) {
  const [user] = useAccountsInfo();
  const [token, setToken] = useToken();
  const [messages, setMessages] = useState([]);
  const [first, second] = [user.id, friend.id].sort();
  const room_name = `${first}_${second}`;
  const url = `${BASE_URL}/chat/${room_name}/`;
  const ws = useWebSocket(url);
  useEffect(async () => {
    if (first && second) {
      if (messages.length == 0) {
        const result = await AUTH.get_latest_dm(`chat_${room_name}`);

        if (result) {
          setMessages(result.reverse());
        } else {
          setMessages([]);
        }
      }
    }
  }, [friend, user]);
  if (ws) {
    ws.onopen = (e) => {};
    ws.onmessage = (e) => {
      const message = jp(e);
      const action = message.type;
      if (action == "chat") {
        console.log("Message Incoming from " + url);
        setMessages([...messages, message]);
      }
    };
    ws.onclose = (e) => {
      console.log("DMWS closed");
    };
  }
  const messageHandler = (e, setTmpMessage) => {
    AUTH.request_dm(token, friend);
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    ws.send(
      JSON.stringify({
        username: user.username,
        message: data.get("message"),
        user_id: user.id,
      })
    );
    setTmpMessage("");
    window.document.querySelector(`#textfield_${friend.id}`).focus();
  };
  return [messages, messageHandler, ws];
}

function jp(e) {
  return JSON.parse(e.data);
}
