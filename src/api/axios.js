import axios from "axios";
import history from "../history";
// import { removeNullValue } from "../Common";
import { message } from "antd";
import { NETWORK_ERR_MSG, NETWORK_ERR_CODE } from "@/constants";
import {warningInfo} from "../Common";
// Create an instance using the config defaults provided by the library
// At this point the timeout config value is `0` as is the default for the library
const axio = axios.create({
	headers: {
		"Content-Type": "application/json;charset=UTF-8"
	}
});

// Override timeout default for the library
// Now all requests using this instance will wait 2.5 seconds before timing out
axio.defaults.timeout = 200000;
axio.defaults.withCredentials = true;

// Add a request interceptor
// axio.interceptors.request.use(
// 	function(config) {
// 		// Do something before request is sent
// 		// config = removeNullValue(config);
// 		// console.log("axios.interceptors.request")
// 		// console.log(config)

// 		return config;
// 	},
// 	function(error) {
// 		// Do something with request error
// 		return Promise.reject(error);
// 	}
// );

axio.interceptors.response.use(
	function(response) {
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		const hasData = response && response.data;

		if (hasData && response.data.retCode === 103) {
			// console.log("由于103未登录，所以到了登录页面");
			history.push("/login");
			response.data = {}
			return response;
		} else {
		}

		// 当服务器返回result结果为0的时候，抛出异常
		if (hasData && response.data.result === 1) {
			if (response.data.retCode === 1) {
				message.destroy();
				// message.success(response.data.retMsg);
			}
		} else if (hasData && response.data.result === 0) {
			// 弹出系统异常
			// sysErrorInfo();
			//message.info(response.data.retMsg);
			warningInfo(response.data.retMsg);
			return Promise.reject();
		} else {
			return Promise.reject( response);
		}

		return response;
	},
	function(error) {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		// console.log(error);
		// console.log({ ...error });
	// 当网络请求为500的时候，说明网络连接错误了，这个时候弹出一个消息
		if (
			error &&
			error.response &&
			error.response.status === NETWORK_ERR_CODE
		) {
			message.error(NETWORK_ERR_MSG);
			return Promise.reject(NETWORK_ERR_CODE);
		}
		return Promise.reject(error);
	}
);
// Override timeout for this request as it's known to take a long time
export default axio;
