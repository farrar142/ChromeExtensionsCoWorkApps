import { useToken } from "../hooks";

export default function (target) {
  const [token, setToken] = useToken();
  if (target.user_id == token.user_id) {
    return true;
  }
  if (target.author_id == token.user_id) {
    return true;
  }
  return false;
}
