import { useEffect } from "react";
import { useSsrComplectedState } from "../Atom";
import { useToken } from "../hooks";

const BASE_URL = "wss://todobackend.honeycombpizza.link/";
export function useTestWebSocket(url) {
  return new WebSocket(BASE_URL + url);
}
function empty(e) {
  return e;
}
export function useWebSocketHandler(
  url,
  openHandler = empty,
  onMessageHandler = empty,
  onCloseHandler = empty,
  sendHandler = empty,
  closeHandler = empty
) {
  const setSsrCompleted = useSsrComplectedState();
  useEffect(setSsrCompleted, [setSsrCompleted]);
  useEffect(() => {
    if (setSsrCompleted) {
      const ws = useTestWebSocket(url);
      ws.onopen = (e) => {
        openHandler(e);
      };
      ws.onmessage = (e) => {
        onMessageHandler(e);
      };
      ws.onclose = (e) => {
        onCloseHandler(e);
      };

      ws.onerror = function (err) {
        console.error(
          "Socket encountered error: ",
          err.message,
          "Closing socket"
        );
        ws.close();
      };
      return () => {
        console.log("WebSocketClosed");
        ws.close();
      };
    }
  }, []);
}
