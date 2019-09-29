import * as PATH from "./path";
import axios from "axios"
import axio from "./axios";
import { message, Modal} from "antd";
import { FILE_CANT_MORE } from "@/constants";
import { removeAllSpace, checkIsNull } from "../Common";
import {clearJson} from "@/utils";

export const dumpAllPath = () => {
	console.log(PATH);
};

export const updatePwd = data => {
	return axio.post(PATH.AUTH_USERAPI_UPDATEPWD, data, {
		withCredentials: true
	});
};

export const userApi = {
	login: (data) => axio.post(PATH.USER_LOGIN, data),
	forget: (data) => axio.post(PATH.USER_FORGET, data),
	logout: () => axio.post(PATH.USER_LOGOUT),
}

export const contractConf = {
	add: (data) => axio.post(PATH.CONTRACT_CONF_ADD,clearJson(data)),
	update: (data) => axio.post(PATH.CONTRACT_CONF_UPDATE,data),
	list: (data) => axio.post(PATH.CONTRACT_CONF_LIST,clearJson(data), {
		withCredentials: true
	}).then(res=>{
		return res.data.retObj
	}),
	stock: (data) => axio.post(PATH.CONTRACT_CONF_STOCK,data, {
		withCredentials: true
	}).then(res=>{
		return res.data.retObj
	}),
};


// 融资业务信息
export const financeApl = {
	add: () => axio.post(PATH.FINANCE_APL_ADD),
	delete: () => axio.post(PATH.FINANCE_APL_DELETE),
	update: (data) => axio.post(PATH.FINANCE_APL_UPDATE,data),
	list: data =>
		axio.post(PATH.FINANCE_APL_LIST, data, {
				withCredentials: true
			})
			.then(res => {
				return res.data.retObj;
			}),
	approve: (data) => axio.post(PATH.FINANCE_APL_APPROVE,data),
	confirmGiveAmt: (data) => axio.post(PATH.FINANCE_APL_CONFIRMGIVEAMT,data),
	confirmGiveAmtReturn: (data) => axio.post(PATH.FINANCE_APL_CONFIRMGIVEAMTRETURN,data),
	confirmFinUseAmt: (data) => axio.post(PATH.FINANCE_APL_CONFIRMFINUSE,data),
	confirmFinUseAmtReturn: (data) => axio.post(PATH.FINANCE_APL_CONFIRMFINUSEAMTRETURN,data),
	confirmBack: (data) => axio.post(PATH.FINANCE_APL_CONFIRMBACK,data),

};



// 供应合同表信息 增删改查
export const supCon = {
    add: (data) => axio.post(PATH.SUP_CON_ADD, data),
    delete: (data) => axio.post(PATH.SUP_CON_DELETE, data),
	update: (data) => axio.post(PATH.SUP_CON_UPDATE, data),
	list: (data={}) => axio.post(PATH.SUP_CON_LIST,data, {
		withCredentials: true
	}).then(res=>{
		return res.data.retObj
	})
};

// 核心企业主体信息增删改查
export const legalInfo = {
    add: (data) => axio.post(PATH.LEGAL_INFO_ADD, data),
    delete: (data) => axio.post(PATH.LEGAL_INFO_DELETE, data),
	update: (data) => axio.post(PATH.LEGAL_INFO_UPDATE, data),
	list: (data={}) => axio.post(PATH.LEGAL_INFO_LIST,data, {
		withCredentials: true
	}).then(res=>{
		return res.data.retObj
	}),
	condition: (data={}) => axio.post(PATH.LEGAL_INFO_CONDITION,data, {
		withCredentials: true
	}).then(res=>{
		return res.data.retObj
	})
};

// 融资业务回款账户 增删改查
export const repayAccountLog = {
    add: (data) => axio.post(PATH.REPAY_ACCONT_LOG_ADD, data),
    delete: (data) => axio.post(PATH.REPAY_ACCONT_LOG_DELETE, data),
	update: (data) => axio.post(PATH.REPAY_ACCONT_LOG_UPDATE, data),
	list: (data={}) => axio.post(PATH.REPAY_ACCONT_LOG_LIST,data, {
		withCredentials: true
	}).then(res=>{
		return res.data.retObj
	})
};

//该方法只能上传JPG 、JPEG 、BMP 、PNG 、PDF 格式的文件，若要上传其他格式，请另写方法，修改检查的文件类型
export const updateFile = {
	up: info => {
		console.log(info);
		if (info.fileList.length > 1) {
			message.error(FILE_CANT_MORE, 5);
			return Promise.reject(FILE_CANT_MORE);
		}
		if (checkIsNull(info.fileList[0])) {
			return Promise.reject("无文件");
		}
		if (info.file.status !== "uploading") {

            //限制图片 格式、size、分辨率
            const isJPG = info.fileList[0].type === 'image/jpeg';
            const isJPEG = info.fileList[0].type === 'image/jpeg';
            const isGIF = info.fileList[0].type === 'image/bmp';
            const isPNG = info.fileList[0].type === 'image/png';
            const isPDF = info.fileList[0].type === 'application/pdf';
 
            if (!(isJPG || isJPEG || isGIF || isPNG || isPDF)) {
                Modal.error({
                    title: '只能上传JPG 、JPEG 、BMP 、PNG 、PDF 格式的文件',
                });
                return Promise.reject("只能上传JPG 、JPEG 、BMP 、PNG 、PDF 格式的文件");
            }

            // 限制文件大小，如有需要打开
            const isLt2M = info.fileList[0].size / 1024 / 1024 < 10;
            if (!isLt2M) {
                Modal.error({
                    title: '文件超过10M限制，不允许上传',
                });
                return Promise.reject("文件超过10M限制，不允许上传");
            }

		    const formData = new FormData();
		    let fileName = removeAllSpace(info.file.name);
			formData.append("uploadFile", info.fileList[0].originFileObj);
			formData.append("fileName", fileName);
			return axio
				.post(PATH.UP_FILE, formData, {
					headers: {
						"content-type": "application/x-www-form-urlencoded"
					}
				})
				.then(res => {
					return res.data;
				});
		}
		if (info.file.status === "done") {
			message.success(`【${info.file.name}】文件上传成功`);
			return "";
		} else if (info.file.status === "error") {
			message.error(`【${info.file.name}】文件上传失败`);
			return "error";
		}
	}
};

// 供应商信息增删改查
export const supInfo = {
    add: (data) => axio.post(PATH.SUP_INFO_ADD, data),
    delete: (data) => axio.post(PATH.SUP_INFO_DELETE, data),
	update: (data) => axio.post(PATH.SUP_INFO_UPDATE, data),
	list: (data={}) => axio.post(PATH.SUP_INFO_LIST,data, {
		withCredentials: true
	}).then(res=>{
		return res.data.retObj
	}),
	condition: (data={}) => axio.post(PATH.SUP_INFO_CONDITION,data, {
		withCredentials: true
	}).then(res=>{
		return res.data.retObj
	})
};

// 资金方信息增删改查
export const funderInfo = {
	add: (data) => axio.post(PATH.FUNDER_INFO_ADD,data),
	delete: (data) => axio.post(PATH.FUNDER_INFO_DELETE,data),
	update: (data) => axio.post(PATH.FUNDER_INFO_UPDATE,data),
	list: (data={}) => axio.post(PATH.FUNDER_INFO_LIST,data, {
		withCredentials: true
	}).then(res=>{
		return res.data.retObj
	}),
	condition: (data={}) => axio.post(PATH.FUNDER_INFO_CONDITION,data, {
		withCredentials: true
	}).then(res=>{
		return res.data.retObj
	})
};


// 应收账款
export const financeaplDetail = {
	// 查询供应商列表
	supplierList: (data = {}) => axio.post(PATH.SUPPLIER_LIST, data).then(res=>{
		return res.data.retObj
	}).catch(e=>{
		// 在这里只处理需要处理的异常
	}),
	// 查询主体法人代码列表
	// 参数：
	// 供应商代码supCode
	supconList: (data = {}) => axio.post(PATH.SUPCON_LIST, data).then(res=>{
		return res.data.retObj
	}).catch(e=>{
		// 在这里只处理需要处理的异常
	}),
	// 查询应收账款明细列表
	// 供应商代码supCode
	// 厂区工号factoryWorkNo
	// 应收账款编号accReceiveCode
	// 日期起startDate
	// 日期止endDate
	financeaplDetailList: (data = {}) =>
		axio.post(PATH.FINANCEAPL_DETAIL_LIST, clearJson(data)).then(res=>{
			return res.data.retObj
		}).catch(e=>{
			// 在这里只处理需要处理的异常
	}),
	// 提交参数+文件上传
	// private String supCode;// 供应商代码
	// private String supConCode;// 供应合同编号
	// private String legalCode;// 法人代码
	// private LocalDate supConDate;// 年月
	// private MultipartFile file;// 文件
	financeaplDetailSubmit: (data = {}) =>
		axio.post(PATH.FINANCEAPL_DETAIL_SUBMIT, data),
	// 下载
	financeaplDetailDownload: (data={})=> axios.post(PATH.FINANCEAPL_DETAIL_DOWNLOAD, data,{
		responseType: 'arraybuffer'
	}),
	financeaplDetailFunderList: (data = {}) => axio.post(PATH.FINANCEAPL_DETAIL_FUNDER_LIST, data).then(res=>{
		return res.data.retObj
	}).catch(e=>{
		// 在这里只处理需要处理的异常
	}),	
};

export const financeaplDetailDownloadTemp = (data={})=> axios.post(PATH.FINANCEAPL_DETAIL_DOWNLOAD_TEMP, data,{
	responseType: 'arraybuffer'
})

export const signTemplate = {
	add: (data) => axio.post(PATH.SIGN_TEMP_ADD,clearJson(data)),
	update: (data) => axio.post(PATH.SIGN_TEMP_UPDATE,data),
	updateStatus: (data) => axio.post(PATH.SIGN_TEMP_UPD_STATUS,data),
	list: (data) => axio.post(PATH.SIGN_TEMP_LIST,clearJson(data), {
		withCredentials: true
	}).then(res=>{
		return res.data.retObj
	}),
	fileFddSubmit: (data = {}) =>
		axio.post(PATH.SIGN_TEMP_FDDSUBMIT, data),
	fileSubmit: (data = {}) =>
		axio.post(PATH.SIGN_TEMP_SUBMIT, data),
	queryTempId: (data) => axio.post(PATH.SIGN_TEMP_QRYTEMPID,data, {
		withCredentials: true
	}).then(res=>{
		return res.data.retObj
	}),
};

export const signParm = {
	update: (data) => axio.post(PATH.SIGN_PARM_UPDATE,data),
	list: (data) => axio.post(PATH.SIGN_PARM_LIST,clearJson(data), {
		withCredentials: true
	}).then(res=>{
		return res.data.retObj
	}),

};

// 上传文件
export const uploadSigleFile = (jsonFile)=>{
	const {name} = jsonFile
	const formData = new FormData();
	formData.append("uploadFile", jsonFile);
	formData.append("fileName", name);
	return axio.post(PATH.UP_FILE, formData, {
		headers: {
			// "content-type": "application/x-www-form-urlencoded"
			'Content-Type': 'multipart/form-data'
		}
	}).then(res=>{
		return res.data.retObj;
	})
}
