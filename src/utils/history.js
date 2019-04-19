import { createHashHistory } from "history";
export default createHashHistory({
  basename: window.location.pathname,
});
