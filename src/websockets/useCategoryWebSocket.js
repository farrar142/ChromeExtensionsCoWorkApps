import { useEffect, useState } from "react";
import { useTransferTodoAtom, useWebSocket } from "../Atom";
import { isEmpty } from "../functions/isEmpty";
import todoCan from "../functions/todoCan";

const BASE_URL = "wss://todobackend.honeycombpizza.link/ws";
export function useCategoryWebSocket(category, todos, setTodos) {
  const ws = useWebSocket(`${BASE_URL}/category/${category.id}/`);
  if (ws) {
    ws.onopen = (e) => {};
    ws.onmessage = (e) => {
      const message = jp(e);
      const action = message.action;
      const res = message.data ? message.data[0] : {};
      if (action == "make_todos") {
        setTodos([...todos, todoCan(res)]);
      } else if (action == "delete_todos") {
        setTodos(todos.filter((val) => val.id != res.todo_id));
      } else if (action == "modify_todos") {
        setTodos(
          todos.map((_res) => {
            if (res.id == _res.id) {
              return {
                ..._res,
                message: res.message,
              };
            } else {
              return _res;
            }
          })
        );
      } else if (action == "before_transfer") {
        setTodos(todos.filter((val) => val.id != res.todos_id));
      } else if (action == "after_transfer") {
        setTodos([...todos, todoCan(res.todo)]);
      } else if (action == "post_comment") {
        setTodos(
          todos.map((_res) => {
            if (_res.id == res.id) {
              return todoCan(res);
            } else {
              return _res;
            }
          })
        );
      } else if (action == "delete_comment") {
        setTodos(
          todos.map((_res) => {
            if (_res.id == res.id) {
              return todoCan(res);
            } else {
              return _res;
            }
          })
        );
      } else if (action == "make_check") {
        console.log(res);
        setTodos(
          todos.map((_res) => {
            if (res.todo_id == _res.id) {
              return {
                ..._res,
                checkList: [
                  ..._res.checkList,
                  {
                    id: res.id,
                    checked: res.checked,
                    message: res.message,
                  },
                ],
              };
            }
            return _res;
          })
        );
      } else if (action == "modify_check") {
        setTodos(
          todos.map((_res) => {
            if (res.todo_id == _res.id) {
              return {
                ..._res,
                checkList: _res.checkList.map((val) => {
                  if (val.id == res.id) {
                    return {
                      id: res.id,
                      message: res.message,
                      checked: res.checked,
                    };
                  }
                  return val;
                }),
              };
            }
            return _res;
          })
        );
      } else if (action == "delete_check") {
        if (res) {
          console.log(res);
          setTodos(
            todos.map((_res) => {
              if (res.todo_id == _res.id) {
                return {
                  ..._res,
                  checkList: _res.checkList.filter((val) => {
                    return val.id != res.id;
                  }),
                };
              }

              return _res;
            })
          );
        }
      }
    };
    ws.onclose = (e) => {
      console.log("CWS closed");
    };
  }
}
function jp(e) {
  return JSON.parse(e.data);
}
