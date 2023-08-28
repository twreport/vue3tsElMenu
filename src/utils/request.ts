import axios from "axios";
import { AxiosResponse } from "axios";
import { ElMessage } from "element-plus";

const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    // 超时设置
    timeout: 15000,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
})

request.interceptors.request.use(
    (config) => {
        return config;
    }
);

request.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status === 200) {
            //如果正常返回没有错误
            if ('err' in response.data) {
                //如果有错误但能够正常返回且需要弹窗
                if ('msg' in response.data) {
                    ElMessage.error(response.data.msg);
                }
            } else {
                //如果restful标准自定接口返回的msg没有值，则不弹窗，只要有值就必弹窗
                if ('msg' in response.data) {
                    ElMessage.success(response.data.msg);
                }
            }
            return response.data;
        } 
        return Promise.reject(response.statusText);
    }
)

export default request;