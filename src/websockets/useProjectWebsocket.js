import { useEffect, useState } from "react";
import { useWebSocket } from "../Atom";

const BASE_URL = "wss://todobackend.honeycombpizza.link/ws";
export function useProjectWebSocket(project, categories, setCategories) {
  const ws = useWebSocket(`${BASE_URL}/project/${project.project_id}/`);
  if (ws) {
    ws.onopen = (e) => {};
    ws.onmessage = (e) => {
      const message = jp(e);
      const action = message.action;
      if (action == "make_category") {
        const res = message.data[0];

        if (res) {
          setCategories([
            ...categories,
            { id: res.id, name: res.name, todos: [] },
          ]);
        }
      } else if (action == "delete_category") {
        const res = message.data[0];
        if (res) {
          setCategories(categories.filter((val) => val.id != res.category_id));
        }
      }
    };
    ws.onclose = (e) => {
      console.log("PWS closed");
    };
  }
}

function jp(e) {
  return JSON.parse(e.data);
}
