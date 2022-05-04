import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import {
  AccountsInfoFactory,
  AccountsInfoState,
  cursorLoadingAtom,
  systemMessageState,
  Token,
  useCurrentProject,
  useSnackBarOpen,
} from "../Atom";
import { AUTH } from "../API/todo";
export function isCategoryEditable() {
  const [curProject, setCurProject] = useCurrentProject();
  const [token, setToken] = useToken();
  const is = curProject.participant
    ? curProject.participant
        .map((res) => res)
        .filter(
          (res) =>
            (res.level == "ADMIN" || res.level == "STAFF") &&
            res.id == token.user_id
        ).length >= 1
    : false;
  return is;
}
export function useSysMsg(value = null) {
  const [message, setMessage] = useRecoilState(systemMessageState);
  const [open, setOpen] = useSnackBarOpen();
  // 함수 정의
  const handler = (msg) => {
    setMessage({ type: "success", message: msg });
    setOpen(true);
  };
  return [message, handler];
}
export function useWarnMsg(value = null) {
  const [message, setMessage] = useRecoilState(systemMessageState);
  const [open, setOpen] = useSnackBarOpen();
  // 함수 정의
  const handler = (msg) => {
    setMessage({ type: "warning", message: msg });
    setOpen(true);
  };
  return [message, handler];
}
export function useAccountsInfo(value = null) {
  const [accountsInfo, setAccountsInfo] = useRecoilState(AccountsInfoState);
  const handler = (values) => {
    setAccountsInfo(values);
  };
  return [accountsInfo, handler];
}
export function useToken(value = null) {
  const [token, setToken] = useRecoilState(Token);
  const handler = (token) => {
    setToken(token);
  };
  return [token, handler];
}
export function useTokenValidator() {
  const [token, setToken] = useRecoilState(Token);
  const [accountsInfo, setAccountsInfo] = useRecoilState(AccountsInfoState);
  const [message, setMsg] = useSysMsg();
  useEffect(async () => {
    if (token) {
      const result = await AUTH.get_info(token);
      if (result) {
        console.log("validated");
      } else {
        setToken(null);
        setMsg("로그아웃되었습니다");
        setAccountsInfo(AccountsInfoFactory(null, 0));
      }
    }
  }, [token]);
}
export function useLogout() {
  const [accountsInfo, setAccountsInfo] = useAccountsInfo();
  const [token, setToken] = useToken();
  const [msg, setMsg] = useSysMsg();
  function handler() {
    setToken(null);
    setMsg("로그아웃되었습니다");
    setAccountsInfo(AccountsInfoFactory(null, 0));
  }
  return handler;
}
export function useCursorLoading(value = null) {
  const [cursorLoading, setCursorLoading] = useRecoilState(cursorLoadingAtom);

  const handler = (tag) => {
    setCursorLoading(tag);
  };
  const mouseMove = (cursorLoading) => {
    // console.log(cursorLoading);
  };
  useEffect(() => {
    window.addEventListener("mousemove", mouseMove(cursorLoading));
    return () => {
      window.removeEventListener("mousemove", mouseMove(cursorLoading));
    };
  });
  return [cursorLoading, handler];
}

export function useTimeout(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setTimeout(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
export function useScrollPosition(value = null) {
  const [scrollPosition, setPosition] = useState(0);
  const listenToScroll = () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const scrolled = winScroll / height;
    // console.log(winScroll);
    setPosition(winScroll);
    return {
      theposition: scrolled,
    };
  };
  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => {
      window.removeEventListener("scroll", listenToScroll);
    };
  }, []);
  return scrollPosition;
}
export const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const setFromEvent = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", setFromEvent);

    return () => {
      window.removeEventListener("mousemove", setFromEvent);
    };
  }, []);

  return position;
};
export function useResize(value = null) {
  const [changed, setChanged] = useState(0);
  const handleResize = (e) => {
    setChanged(e);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return changed;
}
export function useDebounce(callback, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}
// export function usePortal() {
//   const [portal, setPortal] = useState(null);
//   const [render, setRender] = useState();
//   function handler(e) {
//     setPortal(e);
//   }
//   useEffect(() => {
//     if (render !== portal) {
//       setRender(portal);
//     }
//   });
//   return [render, handler];
// }
