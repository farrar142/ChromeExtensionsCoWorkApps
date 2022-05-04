import { NoEncryption } from "@material-ui/icons";
import { ConstructionOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { atom, atomFamily, useRecoilState, useSetRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";
import { uuid4 } from "./functions/uuid4";
import { useToken } from "./hooks";

const { persistAtom } = recoilPersist();
const ssrCompletedState = atom({
  key: "SsrCompleted",
  default: false,
});

export const useSsrComplectedState = () => {
  const setSsrCompleted = useSetRecoilState(ssrCompletedState);
  return () => setSsrCompleted(true);
};
const persistAtomEffect = (param) => {
  param.getPromise(ssrCompletedState).then(() => {
    return persistAtom(param);
  });
};
const containerOpenAtom = atomFamily({
  key: "containerOpenAtom",
  default: (section) => false,
  effects_UNSTABLE: [persistAtomEffect],
});
const toDoList = atomFamily({
  key: "toDoList",
  default: (title) => [],
  effects_UNSTABLE: [persistAtomEffect],
});
const categoryAtom = atomFamily({
  key: "categoryAtom",
  default: (title) => [],
  effects_UNSTABLE: [persistAtomEffect],
});
const checklistInputAtom = atomFamily({
  key: "checklistInputAtom",
  default: (title) => "",
  effects_UNSTABLE: [persistAtomEffect],
});
const commentInputAtom = atomFamily({
  key: "commentInputAtom",
  default: (title) => "",
  effects_UNSTABLE: [persistAtomEffect],
});
const snackBarOpenAtom = atom({
  key: "snackBarOpenAtom",
  default: false,
});
const webSocketMessageAtom = atom({
  key: "webSocketMessageAtom",
  default: "",
  effects_UNSTABLE: [persistAtomEffect],
});
const kakaoAtom = atom({
  key: "kakaoAtom",
  default: "",
  effects_UNSTABLE: [persistAtomEffect],
});
const isExt = atom({
  key: "isExt",
  default: true,
  effects_UNSTABLE: [persistAtomEffect],
});
const browserId = atom({
  key: "browserId",
  default: btoa(uuid4()),
  effects_UNSTABLE: [persistAtomEffect],
});
const currentProject = atom({
  key: "currentProject",
  default: {},
  effects_UNSTABLE: [persistAtomEffect],
});
const myAllProjects = atom({
  key: "myAllProjects",
  default: [],
});
const curPage = atom({
  key: "curPage",
  default: 0,
  effects_UNSTABLE: [persistAtomEffect],
});
const curFocusAtom = atom({
  key: "curFocusAtom",
  default: "",
  effects_UNSTABLE: [persistAtomEffect],
});
const portalAtom = atom({
  key: "portalAtom",
  default: null,
});
const dmAtom = atom({
  key: "dmAtom",
  default: [],
  effects_UNSTABLE: [persistAtomEffect],
});
const dmOpenAtom = atomFamily({
  key: "dmOpenAtom",
  default: (idx) => false,
  effects_UNSTABLE: [persistAtomEffect],
});
const dmNoticeAtom = atom({
  key: "dmNoticeAtom",
  default: [],
  effects_UNSTABLE: [persistAtomEffect],
});
const dmMessagesAtom = atomFamily({
  key: "dmMessagesAtom",
  default: (id) => [],
  effects_UNSTABLE: [persistAtomEffect],
});
const WebSocketFamily = atomFamily({
  key: "WebSocketFamily",
  default: (id) => null,
});

const isDarkAtom = atom({
  key: "isDarkAtom",
  default: true,
  effects_UNSTABLE: [persistAtomEffect],
});
const editProjectAtom = atomFamily({
  key: "editProjectAtom",
  default: (id) => true,
});
const alarmNoticeAtom = atomFamily({
  key: "alarmNoticeAtom",
  default: (id) => [],
  effects_UNSTABLE: [persistAtomEffect],
});
export function useAlarmNotice(val) {
  const [getter, setter] = useRecoilState(alarmNoticeAtom(val));
  function handler(e) {
    setter(e);
  }
  return [getter, handler];
}
export function useEditProject(val) {
  const [getter, setter] = useRecoilState(editProjectAtom(val));
  function handler(e) {
    setter(e);
  }
  return [getter, handler];
}
export function useDarkMode() {
  const [getter, setter] = useRecoilState(isDarkAtom);
  function handler(e) {
    setter(e);
  }
  return [getter, handler];
}
export function useWebSocket(value = null) {
  const [ws, setWs] = useRecoilState(WebSocketFamily(value));
  const [token, setToken] = useToken();
  // if (ws) {
  //   ws.onopen = (e) => {
  //     const authorize = JSON.stringify({
  //       message: "authorize",
  //       token: token.token,
  //     });
  //     ws.send(authorize);
  //   };
  // }
  useEffect(() => {
    if (ws == null) {
      const _ws = new WebSocket(
        value + "?token=" + token.token + "&dummy=test2"
      );
      setWs(_ws);
      // console.log(`Weboscket ${value} Opened`);
    }

    return () => {
      // ws.close();
      if (ws) {
        ws.close();
        console.log(`Weboscket ${value} closed`);
      }
      setWs(null);
    };
  }, [value]);
  return ws;
}
export function useDmMessages(id) {
  const [dm, setDM] = useRecoilState(dmMessagesAtom(id));
  function handler(e) {
    setDM(e);
  }
  return [dm, handler];
}
export function useDmNotice() {
  const [dm, setDM] = useRecoilState(dmNoticeAtom);
  function handler(e) {
    setDM(e);
  }
  return [dm, handler];
}
export function useDmOpen(id) {
  const [open, setOpen] = useRecoilState(dmOpenAtom(id));
  function handler(e) {
    setOpen(e);
  }
  return [open, setOpen];
}
export function useDM() {
  const [dm, setDM] = useRecoilState(dmAtom);
  function handler(e) {
    setDM(e);
  }
  return [dm, handler];
}
export function usePortal() {
  const [portal, setPortal] = useRecoilState(portalAtom);
  const [render, setRender] = useState();
  function handler(e) {
    setPortal(e);
  }
  useEffect(() => {
    if (render !== portal) {
      setRender(portal);
    }
  });
  return [render, handler];
}

export function useCurFocusElem() {
  const [state, setState] = useRecoilState(curFocusAtom);
  function handler(e) {
    setState(e);
    const target = window.document.querySelector("#" + e);
    target.focus();
  }
  function focus() {
    if (state) {
      try {
        const target = window.document.querySelector("#" + state);
        target.focus();
      } catch {}
    }
  }
  return [state, handler, focus];
}
export function useChecklistInput(todo_id) {
  const key = `/${todo_id}/checklist`;
  const [open, setOpen] = useRecoilState(checklistInputAtom(key));
  function handler(a) {
    setOpen(a);
  }
  return [open, handler];
}
export function useCommentInput(todo_id) {
  const key = `/${todo_id}/comment`;
  const [open, setOpen] = useRecoilState(commentInputAtom(key));
  function handler(a) {
    setOpen(a);
  }
  return [open, handler];
}
export function useTodoAtom(project, category) {
  const key = `${project.project_id}/${category.id}/todoAtom`;
  const [latest, setLatest, focus] = useCurFocusElem(); //이놈이 변경되면 투두가 렌더링됨...왜?
  const [open, setOpen] = useRecoilState(toDoList(key));
  function handler(a) {
    setOpen(a);
    focus();
  }
  return [open, handler];
}

export function useCurPage() {
  const [attr, setAttr] = useRecoilState(curPage);
  function handler(e) {
    setAttr(e);
  }
  return [attr, handler];
}
export function useGetAllProjects() {
  const [attr, setAttr] = useRecoilState(myAllProjects);
  function handler(e) {
    setAttr(e);
  }
  return [attr, handler];
}
export function useCurrentProject() {
  const [attr, setAttr] = useRecoilState(currentProject);
  function handler(e) {
    setAttr(e);
  }
  return [attr, handler];
}
export function useBrowserId() {
  const [id, setId] = useRecoilState(browserId);
  return id;
}
export function useExt() {
  const [ext, setExt] = useRecoilState(isExt);
  function handler(e) {
    setExt(e);
  }
  return [ext, handler];
}
export function useKakao() {
  const [link, setLink] = useRecoilState(kakaoAtom);
  function handler(e) {
    setLink(e);
  }
  return [link, handler];
}
export function useWebSocketMessage() {
  const [message, setMessage] = useRecoilState(webSocketMessageAtom);
  function handler(e) {
    setMessage(e);
  }
  return [message, handler];
}
export function useSnackBarOpen() {
  const [open, setOpen] = useRecoilState(snackBarOpenAtom);
  function handler(a) {
    setOpen(a);
  }
  return [open, handler];
}
export function useCategoryAtom(section) {
  const [open, setOpen] = useRecoilState(categoryAtom(section));
  function handler(a) {
    setOpen(a);
  }
  return [open, handler];
}

export function useConOpenAtom(section) {
  const [open, setOpen] = useRecoilState(containerOpenAtom(section));
  function handler() {
    setOpen(!open);
  }
  return [open, handler];
}

export function AccountsInfoFactory(name, id) {
  return {
    username: name,
    id: id,
    friends: [],
  };
}

// ssr option end
export const cursorLoadingAtom = atom({
  key: "cursorLoading",
  default: false,
});
export const systemMessageState = atom({
  key: "systemMessage",
  default: {},
  effects_UNSTABLE: [persistAtomEffect],
});

export const AccountsInfoState = atom({
  key: "accountsInfo",
  default: AccountsInfoFactory("", 0),
  effects_UNSTABLE: [persistAtomEffect],
});

export const Token = atom({
  key: "loginToken",
  default: null,
  effects_UNSTABLE: [persistAtomEffect],
});

function hookCan(state) {
  const [attr, setAttr] = useRecoilState(state);
  function handler(e) {
    setAttr(e);
  }
  return [attr, handler];
}
