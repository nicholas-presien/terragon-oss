import { envsafe, num, str } from "envsafe";
import { devDefaultWwwPort } from "./common";

export const env = envsafe({
  WWW_PORT: num({
    devDefault: devDefaultWwwPort,
  }),
  NGROK_DOMAIN: str({
    allowEmpty: true,
    default: "",
  }),
  NGROK_AUTH_TOKEN: str({
    allowEmpty: true,
    default: "",
  }),
  CUSTOM_TUNNEL_COMMAND: str({
    allowEmpty: true,
    default: "",
  }),
});
