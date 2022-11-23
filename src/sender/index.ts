import getXhrSend from './xhrSender';
import { SendMethod } from '../types';
const send: SendMethod = getXhrSend();
export default send;
export { send, getXhrSend };
