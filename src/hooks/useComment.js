import { useState } from "react";
import { useToken } from ".";
import { TODO } from "../API/todo";

export default function (todos, setTodos, todo) {
  const [alMessage, setAlMessage] = useState(false);
  const [token, setToken] = useToken();
  const registerComment = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const reply = data.get("message");
    if (reply.trim().length == 0) {
      setAlMessage(true);
      return;
    }
    const result = await TODO.make_comment(token, todo, reply);
    if (result) {
    }
  };
  const deleteComment = async (comment) => {
    const result = TODO.delete_comment(token, comment);
    if (result) {
      setTodos(
        todos.map((_res) => {
          if (todo.id == _res.id) {
            return {
              ..._res,
              comment: _res.comment.filter((cl_val) => {
                return cl_val.id != comment.id;
              }),
            };
          }

          return _res;
        })
      );
    } else {
      alert("err!");
    }
  };
  return [alMessage, setAlMessage, registerComment, deleteComment];
}
