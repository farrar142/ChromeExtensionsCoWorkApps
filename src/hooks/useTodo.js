import { useEffect, useState } from "react";
import { useToken } from ".";
import { TODO } from "../API/todo";
import { useTodoAtom } from "../Atom";
import { isEmpty } from "../functions/isEmpty";
import todoCan from "../functions/todoCan";
import { useCategoryWebSocket } from "../websockets/useCategoryWebSocket";

export default function (project, category) {
  const [token, setToken] = useToken();
  const [todos, setTodos] = useTodoAtom(project, category);
  useCategoryWebSocket(category, todos, setTodos);
  useEffect(async () => {
    const res = await TODO.get_todos(category);
    if (res) {
      setTodos(res.map((res) => todoCan(res)));
    } else {
      alert("err!");
    }
  }, []);
  const registerTodo = async (e, message, checklist, tag) => {
    const res = await TODO.make_todos(
      category,
      token,
      message,
      checklist.filter((res) => res != ""),

      tag.id
    );
    if (res) {
    } else {
      alert("오류!");
    }
  };
  const deleteTodo = async (todo) => {
    // console.log(todo);
    // return;
    const res = await TODO.delete_todos(token, category, todo);
    if (res) {
    } else {
      alert("err!");
    }
  };

  const modifyTodo = async (e, todo) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const result = await TODO.modify_todos(
      token,
      category,
      todo,
      data.get("message")
    );
    if (result) {
    } else {
      alert("err!");
    }
  };
  return [todos, setTodos, registerTodo, deleteTodo, modifyTodo];
}
