import { useEffect, useState } from "react";
import { useToken, useWarnMsg } from ".";
import { TODO } from "../API/todo";
import { useCurrentProject } from "../Atom";
import { useProjectWebSocket } from "../websockets/useProjectWebsocket";
export default function useCategories() {
  const [token, setToken] = useToken();
  const [categories, setCategories] = useState([]);
  const [curPro, setCurPro] = useCurrentProject();
  const [warn, setWarn] = useWarnMsg();
  const ws = useProjectWebSocket(curPro, categories, setCategories);
  useEffect(async () => {
    if (curPro.project_id) {
      const res = await TODO.get_categories(curPro);
      if (res) {
        setCategories(res);
      } else {
        setCategories(categories);
      }
    }
  }, [curPro]);
  const catRemover = async (e, category) => {
    e.preventDefault();
    const res = await TODO.delete_category(token, curPro, category);
    if (res) {
    } else {
      alert("오류");
    }
  };

  const catMaker = async (e) => {
    const data = new FormData(e.currentTarget);
    e.preventDefault();
    const categoryName = data.get("categoryname");
    if (categoryName.trim().length == 0) {
      alert("카테고리를 입력해주세요");
      return;
    }
    if (categories.length <= 2) {
      const res = await TODO.make_category(token, curPro, categoryName);
      if (!res) {
        alert("err!");
      }
    } else {
      setWarn("카테고리는 세개까지만 만들 수 있어요");
    }
  };
  return [categories, setCategories, catRemover, catMaker];
}
