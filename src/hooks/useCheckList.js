import { useState } from "react";
import { useToken } from ".";
import { TODO } from "../API/todo";

export default function (todos, setTodos, todo) {
  const [token, setToken] = useToken();
  const [alMessage, setAlMessage] = useState(false);

  const makeCheck = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const checkMessage = data.get("message");
    if (checkMessage.trim().length == 0) {
      setAlMessage(true);
      return;
    }
    const res = await TODO.make_check(token, todo, checkMessage);
    if (res) {
      // console.log(res);
      // setTodos(
      //   todos.map((_res) => {
      //     if (todo.id == _res.id) {
      //       return {
      //         ..._res,
      //         checkList: [
      //           ..._res.checkList,
      //           {
      //             id: res.id,
      //             checked: res.checked,
      //             message: res.message,
      //           },
      //         ],
      //       };
      //     }
      //     return _res;
      //   })
      // );
    } else {
      alert("err!");
    }
  };
  const modifyCheck = async (check) => {
    const res = await TODO.modify_check(token, check);
    if (res) {
      // setTodos(
      //   todos.map((_res) => {
      //     if (todo.id == _res.id) {
      //       return {
      //         ..._res,
      //         checkList: _res.checkList.map((val) => {
      //           if (val.id == check.id) {
      //             return {
      //               id: res.id,
      //               message: res.message,
      //               checked: res.checked,
      //             };
      //           }
      //           return val;
      //         }),
      //       };
      //     }
      //     return _res;
      //   })
      // );
    } else {
      alert("err!");
    }
  };
  const deleteCheck = async (check) => {
    const res = await TODO.delete_check(token, check);
    if (res) {
      // setTodos(
      //   todos.map((_res) => {
      //     if (todo.id == _res.id) {
      //       return {
      //         ..._res,
      //         checkList: _res.checkList.filter((val) => {
      //           return val.id != check.id;
      //         }),
      //       };
      //     }
      //     return _res;
      //   })
      // );
    } else {
      alert("err!");
    }
  };

  return [alMessage, setAlMessage, modifyCheck, deleteCheck, makeCheck];
}
