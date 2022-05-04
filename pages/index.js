import { useEffect, useState } from "react";
import SignIn from "../components/accounts/Signin";
import Signup from "../components/accounts/Signup";
import TodoMain from "../components/todos/TodoMain";
import { useSsrComplectedState } from "../src/Atom";
import {
  useAccountsInfo,
  useSysMsg,
  useToken,
  useTokenValidator,
} from "../src/hooks";
const SIGNIN = 1;
const TODOPAGE = 2;
const TEST = 3;
export default function (props) {
  const [token, setToken] = useToken();
  console.log(token);
  const [page, setPage] = useState(1);
  const [accountPage, setAccountPage] = useState(0);
  const setSsrCompleted = useSsrComplectedState();
  useEffect(setSsrCompleted, [setSsrCompleted]);
  useTokenValidator();
  if (!setSsrCompleted) {
    return <div></div>;
  }
  if (token) {
    return <TodoMain token={token}></TodoMain>;
  } else {
    if (accountPage == 0) {
      return <SignIn page={accountPage} setPage={setAccountPage}></SignIn>;
    } else {
      return <Signup page={accountPage} setPage={setAccountPage}></Signup>;
    }
  }
}
