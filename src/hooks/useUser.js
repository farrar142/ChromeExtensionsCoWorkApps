import { memo } from "react";
import { useAccountsInfo, useToken, useWarnMsg } from ".";
import { AUTH } from "../API/todo";
import { useDM } from "../Atom";
import { useUserWebSocket } from "../websockets/useUserWebSocket";
function isTokenEquals(next, prev) {
  return next.token === prev.token;
}
export default (token) => {
  const [user, setUser] = useAccountsInfo();
  const [DM, setDM] = useDM();
  const [warn, setWarn] = useWarnMsg();
  const ws = useUserWebSocket(user);

  const modifyName = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const result = await AUTH.modify_username(token, form.get("username"));
    if (result) {
      setUser(result);
    }
  };
  const addFriend = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const result = await AUTH.add_friend(token, form.get("username"));
    if (result) {
      setUser({
        ...user,
        friends: result,
      });
    } else {
      setWarn(`${form.get("username")}이름을 가진 친구가 없어요`);
    }
  };
  const removeFriend = async (id) => {
    const result = await AUTH.remove_friend(token, id);
    if (result) {
      setUser({
        ...user,
        friends: result,
      });
    } else {
      setWarn("에러가 났어요.");
    }
  };
  const requestDM = async (friend) => {
    const result = await AUTH.request_dm(token, friend);
    const exist = DM.filter((res) => res.id == friend.id).length != 0;
    if (!exist) {
      setDM([...DM, friend]);
    }
  };
  return [modifyName, addFriend, removeFriend, requestDM];
};
