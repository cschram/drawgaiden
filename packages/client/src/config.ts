import configJSON from "../../../config/client.json";
export interface Config {
    socketAPI: string;
}
const config: Config = configJSON;
export default config;