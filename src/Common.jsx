import React from "react";
import {
	Modal,
	notification,
	Row,
	message,
	Select,
	Col,
	Tooltip,
} from "antd";
import axios from "axios";
import numeral from "numeral";
import moment from "moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MODAL_SPAN_N, MODAL_WIDTH } from "@/constants";
import {supInfo,funderInfo,legalInfo} from "@/api";
// import { selectList } from "./mapper";
import {renderFieldByTypeMapperValue} from './utils';
// 检查list中所有元素，从【map】中取出，判断元素是否为空，以及数据格式和类型是否正确,结果为true表示校验通过，false表示未通过
// 注意：列出所有警告
export function checkMap(map, list) {
	let checkResult = true;
	list.forEach( (item) => {
		if(item['checkNull']==='Y' && checkIsNull(map.get(item['key']))){
			message.error("【"+ item['name']+"】不能为空", 5);
			checkResult = false;
			return;
		}
		if(item['type'] === 'str2' && !checkIsNull(map.get(item['key']))){
			if(isChinese(map.get(item['key']))){
				message.error("【"+ item['name']+"】不能为纯汉字", 5);
				checkResult = false;
				return;
			}
			if(!isChineseAndNum(map.get(item['key']))){
				message.error("【"+ item['name']+"】只能为汉字+数字，或纯数字", 5);
				checkResult = false;
				return;
			}
		}
		if(item['type'] === 'num1' && !checkIsNull(map.get(item['key']))){
			if(!checkIsNum(map.get(item['key']))){
				message.error("【"+ item['name']+"】非数字格式", 5);
				checkResult = false;
				return;
			}
		}
		if(item['type'] === 'num2' && !checkIsNull(map.get(item['key']))){
			if(!checkIsNum2(map.get(item['key']))){
				message.error("【"+ item['name']+"】非数字格式", 5);
				checkResult = false;
				return;
			}
		}
		if(item['type'] === 'num3' && !checkIsNull(map.get(item['key']))){
			if(!checkIsNum2(map.get(item['key']))){
				message.error("【"+ item['name']+"】非数字格式", 5);
				checkResult = false;
				return;
			}
			if(parseFloat(map.get(item['key'])) <= 0){
				message.error("【"+ item['name']+"】不能小于0", 5);
				checkResult = false;
				return;
			}
		}
		if(item['type'] === 'num4' && !checkIsNull(map.get(item['key']))){
			if(!checkIsNum(map.get(item['key']))){
				message.error("【"+ item['name']+"】非数字格式", 5);
				checkResult = false;
				return;
			}
			if(parseFloat(map.get(item['key'])) < 0){
				message.error("【"+ item['name']+"】含有非法符号【-】，请删除", 5);
				checkResult = false;
				return;
			}
		}
		if(item['type'] === 'phone' && !checkIsNull(map.get(item['key']))){
			if(!checkPhone(map.get(item['key']))){
				message.error("【"+ item['name']+"】不符合手机号格式", 5);
				checkResult = false;
				return;
			}
		}
		if(item['type'] === 'email' && !checkIsNull(map.get(item['key']))){
			if(!validateEmail(map.get(item['key']))){
				message.error("【"+ item['name']+"】不符合邮箱格式", 5);
				checkResult = false;
				return;
			}
		}
		if(!checkIsNull(item['length']) && !checkIsNull(map.get(item['key']))){
			if(map.get(item['key']).length > item['length']){
				message.error("【"+ item['name']+"】长度不能超过"+item['length']+"位", 5);
				checkResult = false;
				return;
			}
		}
	});
	return checkResult;
}

// 检查list中所有元素，从【map】中取出，判断元素是否为空，以及数据格式和类型是否正确,结果为true表示校验通过，false表示未通过
// 注意：仅列出第一个警告
export function checkMapOneError(map, list) {
	let checkResult = true;
	for (let i = 0; i < list.length; i++) {
		if(list[i]['checkNull']==='Y' && checkIsNull(map.get(list[i]['key']))){
			message.destroy();	//清除其他相同报错信息
			message.error("【"+ list[i]['name']+"】不能为空", 5);
			checkResult = false;
			break;
		}
		if(list[i]['type'] === 'str2' && !checkIsNull(map.get(list[i]['key']))){
			if(isChinese(map.get(list[i]['key']))){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】不能为纯汉字", 5);
				checkResult = false;
				break;
			}
			if(!isChineseAndNum(map.get(list[i]['key']))){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】只能为汉字+数字，或纯数字", 5);
				checkResult = false;
				break;
			}
		}
		if(list[i]['type'] === 'num1' && !checkIsNull(map.get(list[i]['key']))){
			if(!checkIsNum(map.get(list[i]['key']))){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】非数字格式", 5);
				checkResult = false;
				break;
			}
		}
		if(list[i]['type'] === 'num2' && !checkIsNull(map.get(list[i]['key']))){
			if(!checkIsNum2(map.get(list[i]['key']))){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】非数字格式", 5);
				checkResult = false;
				break;
			}
		}
		if(list[i]['type'] === 'num3' && !checkIsNull(map.get(list[i]['key']))){
			if(!checkIsNum2(map.get(list[i]['key']))){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】非数字格式", 5);
				checkResult = false;
				break;
			}
			if(parseFloat(map.get(list[i]['key'])) <= 0){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】不能小于0", 5);
				checkResult = false;
				break;
			}
		}
		if(list[i]['type'] === 'num4' && !checkIsNull(map.get(list[i]['key']))){
			if(!checkIsNum(map.get(list[i]['key']))){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】非数字格式", 5);
				checkResult = false;
				break;
			}
			if(parseFloat(map.get(list[i]['key'])) < 0){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】含有非法符号【-】，请删除", 5);
				checkResult = false;
				break;
			}
		}
		if(list[i]['type'] === 'phone' && !checkIsNull(map.get(list[i]['key']))){
			if(!checkPhone(map.get(list[i]['key']))){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】不符合手机号格式", 5);
				checkResult = false;
				break;
			}
		}
		if(list[i]['type'] === 'email' && !checkIsNull(map.get(list[i]['key']))){
			if(!validateEmail(map.get(list[i]['key']))){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】不符合邮箱格式", 5);
				checkResult = false;
				break;
			}
		}
		if(!checkIsNull(list[i]['length']) && !checkIsNull(map.get(list[i]['key']))){
			if(map.get(list[i]['key']).length > list[i]['length']){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】长度不能超过"+list[i]['length']+"位", 5);
				checkResult = false;
				return;
			}
		}
	}
	return checkResult;
}

// 检查list中所有元素，从【state】对象中取出，判断元素是否为空，以及数据格式和类型是否正确,结果为true表示校验通过，false表示未通过
// 注意：列出所有警告
export function checkState(stateObj, list) {
	let checkResult = true;
	list.forEach( (item) => {
		if(item['checkNull']==='Y' && checkIsNull(stateObj[item['key']])){
			message.error("【"+ item['name']+"】不能为空", 5);
			checkResult = false;
			return;
		}
		if(item['type'] === 'str2' && !checkIsNull(stateObj[item['key']])){
			if(isChinese(stateObj[item['key']])){
				message.error("【"+ item['name']+"】不能为纯汉字", 5);
				checkResult = false;
				return;
			}
			if(!isChineseAndNum(stateObj[item['key']])){
				message.error("【"+ item['name']+"】能为汉字+数字，或纯数字", 5);
				checkResult = false;
				return;
			}
		}
		if(item['type'] === 'num1' && !checkIsNull(stateObj[item['key']])){
			if(!checkIsNum(stateObj[item['key']])){
				message.error("【"+ item['name']+"】非数字格式", 5);
				checkResult = false;
				return;
			}
		}
		if(item['type'] === 'num2' && !checkIsNull(stateObj[item['key']])){
			if(!checkIsNum2(stateObj[item['key']])){
				message.error("【"+ item['name']+"】非数字格式", 5);
				checkResult = false;
				return;
			}
		}
		if(item['type'] === 'num3' && !checkIsNull(stateObj[item['key']])){
			if(!checkIsNum2(stateObj[item['key']])){
				message.error("【"+ item['name']+"】非数字格式", 5);
				checkResult = false;
				return;
			}
			if(parseFloat(stateObj[item['key']]) <= 0 ){
				message.error("【"+ item['name']+"】不能小于0", 5);
				checkResult = false;
				return;
			}
		}
		if(item['type'] === 'num4' && !checkIsNull(stateObj[item['key']])){
			if(!checkIsNum(stateObj[item['key']])){
				message.error("【"+ item['name']+"】非数字格式", 5);
				checkResult = false;
				return;
			}
			if(parseFloat(stateObj[item['key']]) < 0 ){
				message.error("【"+ item['name']+"】含有非法符号【-】，请删除", 5);
				checkResult = false;
				return;
			}
		}
		if(item['type'] === 'phone' && !checkIsNull(stateObj[item['key']])){
			if(!checkPhone(stateObj[item['key']])){
				message.error("【"+ item['name']+"】不符合手机号格式", 5);
				checkResult = false;
				return;
			}
		}
		if(item['type'] === 'email' && !checkIsNull(stateObj[item['key']])){
			if(!validateEmail(stateObj[item['key']])){
				message.error("【"+ item['name']+"】不符合邮箱格式", 5);
				checkResult = false;
				return;
			}
		}
		if(!checkIsNull(item['length']) && !checkIsNull(stateObj[item['key']])){
			if(stateObj[item['key']].length > item['length']){
				message.error("【"+ item['name']+"】长度不能超过"+item['length']+"位", 5);
				checkResult = false;
				return;
			}
		}
	});
	return checkResult;
}

// 检查list中所有元素，从【state】对象中取出，判断元素是否为空，以及数据格式和类型是否正确,// 结果为true表示校验通过，false表示未通过
// 注意：仅列出第一个警告
export function checkStateOneError(stateObj, list) {
	let checkResult = true;
	for (let i = 0; i < list.length; i++) {
		if(list[i]['checkNull']==='Y' && checkIsNull(stateObj[list[i]['key']])){
			message.destroy();	//清除其他相同报错信息
			message.error("【"+ list[i]['name']+"】不能为空", 5);
			checkResult = false;
			break;
		}
		if(list[i]['type'] === 'str2' && !checkIsNull(stateObj[list[i]['key']])){
			if(isChinese(stateObj[list[i]['key']])){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】不能为纯汉字", 5);
				checkResult = false;
				break;
			}
			if(!isChineseAndNum(stateObj[list[i]['key']])){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】只能为汉字+数字，或纯数字", 5);
				checkResult = false;
				break;
			}
		}
		if(list[i]['type'] === 'num1' && !checkIsNull(stateObj[list[i]['key']])){
			if(!checkIsNum(stateObj[list[i]['key']])){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】非数字格式", 5);
				checkResult = false;
				break;
			}
		}
		if(list[i]['type'] === 'num2' && !checkIsNull(stateObj[list[i]['key']])){
			if(!checkIsNum2(stateObj[list[i]['key']])){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】非数字格式", 5);
				checkResult = false;
				break;
			}
		}
		if(list[i]['type'] === 'num3' && !checkIsNull(stateObj[list[i]['key']])){
			if(!checkIsNum2(stateObj[list[i]['key']])){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】非数字格式", 5);
				checkResult = false;
				break;
			}
			if(parseFloat(stateObj[list[i]['key']]) <= 0){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】不能小于0", 5);
				checkResult = false;
				break;
			}
		}
		if(list[i]['type'] === 'num4' && !checkIsNull(stateObj[list[i]['key']])){
			if(!checkIsNum(stateObj[list[i]['key']])){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】非数字格式", 5);
				checkResult = false;
				break;
			}
			if(parseFloat(stateObj[list[i]['key']]) < 0){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】含有非法符号【-】，请删除", 5);
				checkResult = false;
				break;
			}
		}
		if(list[i]['type'] === 'phone' && !checkIsNull(stateObj[list[i]['key']])){
			if(!checkPhone(stateObj[list[i]['key']])){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】不符合手机号格式", 5);
				checkResult = false;
				break;
			}
		}
		if(list[i]['type'] === 'email' && !checkIsNull(stateObj[list[i]['key']])){
			if(!validateEmail(stateObj[list[i]['key']])){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】不符合邮箱格式", 5);
				checkResult = false;
				break;
			}
		}
		if(!checkIsNull(list[i]['length']) && !checkIsNull(stateObj[list[i]['key']])){
			if(stateObj[list[i]['key']].length > list[i]['length']){
				message.destroy();	//清除其他相同报错信息
				message.error("【"+ list[i]['name']+"】长度不能超过"+list[i]['length']+"位", 5);
				checkResult = false;
				return;
			}
		}
	}
	return checkResult;
}

export function _strMapToObj(strMap){
	let obj= Object.create(null);
	for (let[k,v] of strMap) {
		obj[k] = v;
	}
	return obj;
}
/**
 *map转换为json
 */
export function _mapToJson(map) {
	return JSON.stringify(_strMapToObj(map));
}


export function _objToStrMap(obj){
	let strMap = new Map();
	for (let k of Object.keys(obj)) {
		strMap.set(k,obj[k]);
	}
	return strMap;
}
/**
 *json转换为map
 */
export function _jsonToMap(jsonObj){
	return _objToStrMap(jsonObj);
}

// 系统错误信息-中间模态框
export function sysErrorInfo(error) {
	// 清除掉过多的errorInfo
	Modal.destroyAll();
	console.log("error:", error);
	Modal.error({
		title: "提示信息",
		content: "系统错误，请联系系统管理员"
	});
	return;
}

// 弹出系统异常的错误消息
export function messageError() {
	message.destroy();
	message.error("系统异常", 2.5);
}

// 将查询到的数据list传入，会根据是否有数据来反馈交互
export function handleQueryListOk(list) {
	message.destroy();
	// 如果list不存在或者list不是数组就什么也不做
	if (list && Array.isArray(list) && list.length) {
		message.success("查询成功", 1.5);
	} else {
		message.warning("暂无数据", 2.5);
		return false;
	}
}
//用于显示后台返回的具体错误信息
export function ContentErrorInfo(error) {
	console.log("error:", error);
	Modal.error({
		title: "提示信息",
		content: error
	});
	return;
}

//用于显示后台返回的具体正确信息
export function ContentSuccInfo(message) {
	console.log("message:", message);
	Modal.success({
		title: "提示信息",
		content: message
	});
	return;
}

// 右上角弹出一个警告信息
export function warningInfo(msg) {
	notification.destroy()
	notification["warning"]({
		message: msg, //标题
		// description: msg,//详细时间
		duration: 8 //持续时间
	});
	return;
}

// 右上角弹出成功消息通知
export function successInfo(msg) {
	notification.destroy()
	notification["success"]({
		message: msg, //标题
		// description: msg,//详细信息
		duration: 5 //持续时间
	});
}

// 右上角弹出错误消息通知
export function errorInfo(msg) {
	notification.destroy()
	notification["error"]({
		message: msg, //标题
		// description: msg,//详细信息
		duration: 5 //持续时间
	});
	return;
}

export function isRealNum(val) {
	// isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
	if (val === "" || val === undefined) {
		return false;
	}
	if (!isNaN(val)) {
		return true;
	} else {
		return false;
	}
}

export function isNumRange(val, start, end) {
	if (isRealNum(val)) {
		if (val < end && val >= start) {
			return true;
		}
	}
	return false;
}

export function isNumRange1(val, start, end) {
	if (isRealNum(val)) {
		if (val <= end && val >= start) {
			return true;
		}
	}
	return false;
}

export function checkNumNull(value, name) {
	if (value === null || value === undefined) {
		warningInfo("【" + name + "】不能为空！");
		return true;
	}
	return false;
}

export function checkNull(value, name) {
	if (value === null ||
		value === undefined ||
		(typeof value==='string' && value.constructor===String && value.trim() === "")) {
		warningInfo("【" + name + "】不能为空！");
		return true;
	}
	if (value === "请选择") {
		warningInfo("【" + name + "】必选！");
		return true;
	}
	return false;
}

export function checkIsNull(value) {
	if (value === null
		|| value === undefined
		|| (typeof value==='string' && value.constructor===String && value.trim() === "")) {
		return true;
	}
	return false;
}

export function checkEmpty(value) {
	if (
		value === null ||
		value === undefined ||
		value.trim() === "" ||
		value === "请选择"
	) {
		return true;
	}
	return false;
}
//检查用户密码格式
export function checkPwd(value) {
	var pPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/;
	if (!pPattern.test(value)) {
		ContentErrorInfo(
			"密码必须最少6位，包括至少1个大写字母，1个小写字母，1个数字"
		);
		return true;
	} else {
		return false;
	}
}

// 将时间格式：
// 2019-02-25T03:23:33.000+0000
// 转换为：
// 2019-02-25 03:23:33
export function dateFormat(value) {
	if (value === null || value === undefined || value.trim() === "") {
		return "";
	} else {
		return value.replace(/T/g, " ").substring(0, 19);
	}
}

//正则表达式检查是否是纯数字，[数字不带小数点]
export function checkIsNum(value) {
	if (!/^-?[0-9]+$/.test(value)) {
		return false; //非纯数字
	}
	return true;
}

//正则表达式检查是否是纯数字，[数字可能带小数点]
export function checkIsNum2(value) {
	if (!/^-?[0-9]+.?[0-9]*$/.test(value)) {
		return false; //非纯数字
	}
	return true;
}

//正则表达式检查是否为11位有效手机号码
export function isPoneAvailable(pone, name) {
	var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
	if (!myreg.test(pone)) {
		warningInfo("【" + name + "】无效！");
		return true;
	} else {
		return false;
	}
}

//判断array中是否包含obj
export function contain(array, obj) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] === obj)
			//如果要求数据类型也一致，这里可使用恒等号===
			return true;
	}
	return false;
}

//判断array中是否包含obj
export function contains(array, obj) {
	var startArry = obj.substring(0, 1);
	var strLen = obj.length;

	// 循环查到的字符串
	for (var j = 0; j < array.length - strLen + 1; j++) {
		if (array.charAt(j) === startArry) {
			//从匹配到的第一个字段开始比较
			if (array.substring(j, j + strLen) === obj) {
				//如果从j开始的字符与str匹配，那ok
				return true;
			}
		}
	}
	return false;
}

//array中删除指定元素val
export function remove(array, val) {
	var index = array.indexOf(val);
	if (index > -1) {
		array.splice(index, 1); //删除指定位置的一个元素
	}
	return array;
}

//短信服務商 返回服務商集合
export function initSmsProviider(str) {
	var groupCodeList = [];
	axios
		.post(
			localStorage.getItem("IP_PORT_BACKEND") +
				"/smsapi/querySmsProviderCodeName",
			{
				smsChannel: str
			}
		)
		.then(function(response) {
			if (response.data.List) {
				for (var i = 0; i < response.data.List.length; i++) {
					if (response.data.List[i] !== null) {
						groupCodeList.push(
							<Select.Option
								key={response.data.List[i].smsChannel}
							>
								{response.data.List[i].openName}
							</Select.Option>
						);
					}
				}
			}
		})
		.catch(function(error) {
			sysErrorInfo(error);
		});
	return groupCodeList;
}

//初始化集团，返回集团数组选项
export function initGroupCode(orgType) {
    var groupCodeList = [];
    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/funder/queryOrgProfileList',
    {
        "orgType": orgType
    }).then(function (response) {
        if(response.data.result === 1) {
            console.log("---respons-----e",response.data.retObj);
            if (!!response.data.retObj) {
                for (var i = 0; i < response.data.retObj.length; i++) {
                    if (response.data.retObj[i] !== null) {
                        groupCodeList.push(<Select.Option
                            key={response.data.retObj[i].orgCode}>{response.data.retObj[i].orgName}</Select.Option>);
                    }
                }
            }
        }
    }).catch(function (error) {
        sysErrorInfo(error);
    });
    return groupCodeList;
}
//初始化公司，返回公司数组选项
export function initCompCode(orgType, group) {
	var compCodeList = [];
	axios
		.post(
			localStorage.getItem("IP_PORT_BACKEND") +
				"/confapi/queryOrgProfileList",
			{
				orgType: orgType,
				orgGroupCode: group === "请选择" ? undefined : group
			}
		)
		.then(function(response) {
			for (var i = 0; i < response.data.List.length; i++) {
				if (response.data.List[i] !== null) {
					compCodeList.push(
						<Select.Option key={response.data.List[i].code}>
							{response.data.List[i].shortname}
						</Select.Option>
					);
				}
			}
		})
		.catch(function(error) {
			sysErrorInfo(error);
		});
	return compCodeList;
}
//初始化网点，返回网点数组选项
export function initSiteCode(orgType, group, comp) {
	var siteCodeList = [];
	axios
		.post(
			localStorage.getItem("IP_PORT_BACKEND") +
				"/confapi/queryOrgProfileList",
			{
				orgType: orgType,
				orgGroupCode: group === "请选择" ? undefined : group,
				orgCompCode: comp === "请选择" ? undefined : comp
			}
		)
		.then(function(response) {
			for (var i = 0; i < response.data.List.length; i++) {
				if (response.data.List[i] !== null) {
					siteCodeList.push(
						<Select.Option key={response.data.List[i].code}>
							{response.data.List[i].shortname}
						</Select.Option>
					);
				}
			}
		})
		.catch(function(error) {
			sysErrorInfo(error);
		});
	return siteCodeList;
}

// 初始化合同编号 ，返回数组
export function initOrgConSn() {
	var conSnList = [];
	axios
		.post(
			localStorage.getItem("IP_PORT_BACKEND") + "/orgconapi/qryConSnList",
			{}
		)
		.then(function(response) {
			if (response.data.List != null) {
				for (var i = 0; i < response.data.List.length; i++) {
					if (response.data.List[i] != null) {
						conSnList.push(
							<Select.Option key={response.data.List[i].code}>
								{response.data.List[i].code}
							</Select.Option>
						);
					}
				}
			}
		})
		.catch(function(error) {
			sysErrorInfo(error);
		});
	return conSnList;
}

//初始化供应商代码，返回供应商数组选项
export function initSupCode() {
    var supCodeList = [];
	supInfo.condition().then(function (response) {
        for (var i = 0; i < response.length; i++) {
            if(response[i] !== null){
                supCodeList.push(<Select.Option key={response[i].supCode} >{response[i].supShortName}</Select.Option>);
            }
        }
    }).catch(function (error) {
        //sysErrorInfo(error);
    });
    return supCodeList;
}

//初始化供应商代码和简称，返回供应商数组选项
export function initSupCodeAndShortName() {
	let supCodeList = [];
	let supShortNameList = [];
	supInfo.condition().then(function (response) {
		for (var i = 0; i < response.length; i++) {
			if(response[i] !== null){
				supCodeList.push(<Select.Option key={response[i].supCode} >{response[i].supCode}</Select.Option>);
				supShortNameList.push(<Select.Option key={response[i].supShortName} >{response[i].supShortName}</Select.Option>);
			}
		}
	}).catch(function (error) {
		sysErrorInfo(error);
	});
	return {supCodeList,supShortNameList};
}

//初始化富金服的资金方代码代码，返回数组选项
export function initFunderCode() {
    var funderCodeList = [];
    funderInfo.condition({orgType:"FUNDER"}).then(function (response) {
        for (var i = 0; i < response.length; i++) {
            if(response[i] !== null){
                funderCodeList.push(<Select.Option key={response[i].orgCode} >{response[i].orgName}</Select.Option>);
            }
        }
    }).catch(function (error) {
        //sysErrorInfo(error);
    });
    return funderCodeList;
}

//初始主体法人代码，返回主体法人单位名称数组选项
export function initLegalInfo() {
    let legalInfoList = [];
	legalInfo.condition().then(function (response) {
        for (var i = 0; i < response.length; i++) {
            if(response[i] !== null){
                legalInfoList.push(<Select.Option key={response[i].legalCode}>{response[i].legalCompSname}</Select.Option>);
            }
        }
    }).catch(function (error) {
        sysErrorInfo(error);
    });
    return legalInfoList;
}

//正则表达式检查是否是邮箱
export function checkIsEmail(value) {
	var reg = new RegExp(
		"^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
	);
	if (!reg.test(value)) {
		return false; //非邮箱
	}
	return true;
}

export function checkButtList() {
	const list = JSON.parse(localStorage.getItem("permission"));
	const listValues = Object.values(list);
	const listValuesReduce = listValues.reduce((acc, cur) => {
		return [...acc, ...cur];
	}, []);
	const buttList = listValuesReduce.filter(item => item.buttCode);
	return buttList;
}
//判断页面的按钮是否有权限
export function checkButtPermission(pageId, buttonId) {
	const buttList = JSON.parse(localStorage.getItem("buttList"));
	const btnGot = buttList.filter(itemBtn => {
		return itemBtn.pageCode === pageId && itemBtn.buttCode === buttonId;
	});
	return !!btnGot.length ? "" : "none";
}

//判断页面的按钮是否有权限,返回true或者false
export function checkButtPermissionTF(pageId, buttonId) {
	const buttList = JSON.parse(localStorage.getItem("buttList"));
	const btnGot = buttList.filter(itemBtn => {
		return itemBtn.pageCode === pageId && itemBtn.buttCode === buttonId;
	});
	return !!btnGot.length
}

//获取今天
export function getTody(type) {
	var date = new Date();
	return date.format(type);
}

//判断失效时间是否大于今天
export function isGreaterToday(dateString, value) {
	var month = dateString.substring(5, 7);
	const expireDate = new Date(
		dateString.substring(0, 4),
		month - 1,
		dateString.substring(8, 10)
	);
	const toDate = new Date(
		new Date().getFullYear(),
		new Date().getMonth(),
		new Date().getDate()
	);

	if (expireDate <= toDate) {
		warningInfo("【" + value + "】需大于今天");
		return true;
	}
	return false;
}

//判断还款日是否大于今天
export function isSmallerToday(dateString, value) {

	var month = dateString.substring(5, 7);
	const expireDate = new Date(
		dateString.substring(0, 4),
		month - 1,
		dateString.substring(8, 10)
	);

	const toDate = new Date(
		new Date().getFullYear(),
		new Date().getMonth(),
		new Date().getDate()
	);

	if (expireDate > toDate) {
		warningInfo("【" + value + "】需小于等于今天");
		return true;
	}
	return false;
}

export function renderTextColumns(data, index, key, text) {
	return text;
}

// 这个方法即使参数错误也不会导致页面奔溃
export function renderTextColumnsString(data, index, key, text) {
	return text ? "" + text : "";
}

// table表单中显示字符串
export function renderString(text) {
	return text ? "" + text : "";
}
// 处理日期格式，表格中的显示，将 [2019, 12, 29, 3, 55, 52, 262000000]
// 格式的日期显示为 2019-06-11
export function renderDateColumn(date = "", l = 3) {
	if (("" + date).includes("-")) {
		return date;
	} else {
	}
	if (l === 3) {
		return (
			(date &&
				date
					.slice(0, l)
					.map(i => (i > 9 ? i : "0" + i))
					.join("-")) ||
			""
		);
	} else if (l === 6) {
		return (
			(date &&
				date
					.slice(0, 3)
					.map(i => (i > 9 ? i : "0" + i))
					.join("-") +
					" " +
					date
						.slice(3, 6)
						.map(i => (i > 9 ? i : "0" + i))
						.join(":")) ||
			""
		);
	}
	return "";
}

// 此函数入参
// text -- table中的列表cell中的文字
// lengthLimit -- 需要截取的位置，从0截取到到这个位置
// 效果：显示三个点
// 鼠标移动上去显示详细

export function renderTooltipText(text = "", lengthLimit) {
	// eslint-disable-next-line
	text = (text && "" + text) || "";
	return text.length > lengthLimit ? (
		<Tooltip title={text}>
			<span>{text.substring(0, lengthLimit) + "..."}</span>
		</Tooltip>
	) : (
		<span>{text}</span>
	);
}

export function renderMoneyColumns(data, index, key, text) {
	return "￥" + numeral(text).format("0,0.00");
}

export function formatBigDecimal(text) {
	return "￥" + numeral(text).format("0,0.00");
}

export function renderMoneySixColumns(data, index, key, text) {
	return "￥" + numeral(text).format("0.[00000]");
}

export function amtChange(value) {
	return "￥" + numeral(value).format("0,0.00");
}

// 由于在table中插值的时候，selectList空值查找的结果会返回一个数组，
// 而table中直接插入数组到单元格会引起报错，所以采用下面这个函数包一下，
// 处理空值异常
export function renderSafeSelectL(sl, text) {
	return Array.isArray(sl) ? text : sl;
}

// table中一行单击改变颜色-组合套餐
export const onClickRow = function(
	event,
	record,
	rowIndex,
	stateKeyName = "rowId",
	recordKey = "id"
) {
	this.setState(
		{
			[stateKeyName]: record[recordKey]
		}
		// ,()=>{
		// 	console.log('onClickRow onClickRow onClickRow onClickRow')
		// }
	);
	event.stopPropagation();
	return false;
};
// table中一行单击改变颜色-组合套餐
export const setRowClassName = function(
	record,
	stateKeyName = "rowId",
	recordKey = "id"
) {
	return record[recordKey] === this.state[stateKeyName] ? "clickRowStyl" : "";
};

/**
 *
 * 删除空值
 * 使用场景：
 * 提交json到服务器之前，用于把json中的空值字段，
 * 请选择字段都去除，只发送带有具体值的字段到服务器中，
 *
 * @param {*} str
 * @returns 剔除空值之后的json
 */
export const removeNullValue = function(str) {
	const newObj = {};
	while (!str) {
		return {};
	}
	Object.keys(str).forEach(okey => {
		const thatValue = str[okey];
		if (thatValue && ("" + thatValue).trim().length) {
			if (typeof thatValue === "string" || thatValue instanceof String) {
				// newObj[okey] = thatValue.trim().replace(/\s/g,'')
				if (thatValue.replace(/\s/g, "") === "请选择") {
				} else {
					// newObj[okey] = thatValue.replace(/\s/g,'')
					newObj[okey] = thatValue.trim();
				}
			} else {
				newObj[okey] = thatValue;
			}
		}
	});
	return newObj;
};

// 改变组件内的一个字段值
export const changeOneState = function(e) {
	if (e) {
		console.log(e);
		if (e.target) {
			const { value: targetV, name } = e.target;
			console.log(targetV);
			this.setState(
				{
					[name]: targetV
				},
				() => {
					console.log(this.state);
				}
			);
		} else {
		}
	}
};

// 删除所有的空格
export const removeAllSpace = function(str) {
	if (str === null || str === undefined) return "";
	return ("" + str).replace(/\s/g, "");
};

// 默认日期
// 返回日期对象
export const getDateRangeDefault = (type = "YMD") => {
	let DATETIME_FORMAT;
	if (type === "YM") {
		DATETIME_FORMAT = "YYYY-MM";
	} else if (type === "YMD") {
		DATETIME_FORMAT = "YYYY-MM-DD";
	} else {
		DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
	}
	const DATE_NOW = new Date();
	const START_DATETIME = moment(
		new Date(
			DATE_NOW.getFullYear(),
			DATE_NOW.getMonth(),
			DATE_NOW.getDate(),
			0,
			0,
			0
		)
	);
	const END_DATETIME = moment(
		new Date(
			DATE_NOW.getFullYear(),
			DATE_NOW.getMonth(),
			DATE_NOW.getDate(),
			23,
			59,
			59
		)
	);
	const START_DATETIME_VALUE = moment(START_DATETIME, DATETIME_FORMAT).format(
		DATETIME_FORMAT
	);
	const END_DATETIME_VALUE = moment(END_DATETIME, DATETIME_FORMAT).format(
		DATETIME_FORMAT
	);
	return {
		START_DATETIME,
		END_DATETIME,
		START_DATETIME_VALUE,
		END_DATETIME_VALUE,
		DATETIME_FORMAT
	};
};

// 日期onchange函数
export const onChangeRangePicker = function(dates, dateStrings) {
	console.log(dates, dateStrings);
	this.setState({
		START_DATETIME: dates[0],
		START_DATETIME_VALUE: dateStrings[0],
		END_DATETIME: dates[1],
		END_DATETIME_VALUE: dateStrings[1]
	});
};

// 单击复制到粘贴板
// 如果第二个参数传入了，则渲染出传入的组件
export const clickCopy = (text, el) =>
	!el ? (
		<CopyToClipboard text={text}>
			<span>{text}</span>
		</CopyToClipboard>
	) : (
		<CopyToClipboard text={text}>
			<span>{el}</span>
		</CopyToClipboard>
	);

// 下载文件
export const downFile = function(blob, fileName="下载文件"+ +new Date()) {
	if (window.navigator.msSaveOrOpenBlob) {
		navigator.msSaveBlob(blob, fileName);
	} else {
		var link = document.createElement("a");
		link.href = window.URL.createObjectURL(blob);
		link.download = fileName;
		link.click();
		window.URL.revokeObjectURL(link.href);
	}
};

// 用以兼容平板ipad的双击查看进件记录详情等，支持双击事件
// 使用方法：在组件中，先定义
// this.clicks = []
// this.timeout = null
// 然后将clickHandler绑定到组件的this上，
// 在onRow中传入对应的参数
// 效果：如果250毫秒内发生了二次点击，则执行doubleClick双击事件，
// 否则，执行singleClick
export function clickHandler(
	event,
	record,
	rowIndex,
	singleClick,
	doubleClick
) {
	event.preventDefault();
	this.clicks.push(new Date().getTime());
	window.clearTimeout(this.timeout);
	this.timeout = window.setTimeout(() => {
		if (
			this.clicks.length > 1 &&
			this.clicks[this.clicks.length - 1] -
				this.clicks[this.clicks.length - 2] <
				250
		) {
			doubleClick(event, record, rowIndex);
		} else {
			singleClick(event, record, rowIndex);
		}
	}, 250);
}

// 搜索，用以非分页的table做筛选搜索
export function search(e) {
	console.log(e.target.value);
	this.setState({
		sname: e.target.value.toString().trim()
	});
}

// 生成table的组件的props，以简化重复的代码
export const TABLE_PROPS = (that, ENTITY_KEYS, ENTITY) => {
	return {
		scroll: { x: "max-content", y: 400 },
		bordered: true,
		onRow: (record, rowIndex) => {
			return {
				onClick: event => {
					onClickRow.call(that, event, record, rowIndex);
				},
				onDoubleClick: event => {
					doubleClick.call(
						that,
						event,
						record,
						rowIndex,
						ENTITY_KEYS,
						ENTITY
					);
				}
			};
		},
		rowClassName: record => that.setRowClassName(record)
	};
};

// Table组件中的双击事件
export const doubleClick = function(e, r, ri, ENTITY_KEYS, ENTITY,customButton) {
	
	Modal.info({
		icon: "none",
		title: "",
		width: MODAL_WIDTH,
		okText:customButton?"取消":"确定",
		content: (
			<div className="double-modal">
			<Row>
				{ENTITY_KEYS.map((k, i) => {
					const rK = r[k];
					const {nRead,name,mapper,type} = ENTITY[k]
					if (
						r.hasOwnProperty(k) &&
						rK &&
						nRead === false
					) {
						return (

							<Col span={MODAL_SPAN_N} key={i} className="mb-10 flex-cen-bet">
								<span
									style={{
										width: "110px",
										display: "inline-block",
									}}
								>
									{name}: &nbsp;{" "}
								</span>
								<span className="blue">
								{
									renderFieldByTypeMapperValue(type,mapper,rK)
								}
								</span>
							</Col>
						);
					} else {
						return null;
					}
				})}
			</Row>
			{customButton&& <Row justify="center" type="flex" gutter={24}>
				<Col span={6}>
				{customButton}
				</Col>
			</Row>}
			
			</div>
		)
	});
};

// 校验是否为11位手机号码
export const checkPhone = phone => {
	!isNaN(phone) && (phone = "" + phone);
	return /^1[3456789]\d{9}$/.test(phone.replace(/\s/g, ""));
};

// 邮箱检测
export const validateEmail = email => {
	// var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	// var re = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
	const re = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
	return re.test(String(email));
};

// 验证内容中是否含有汉字
export const containChinese = (v) => {
	let re = new RegExp("[\\u4E00-\\u9FFF]+","g");
	return re.test(v);
}

// 验证内容中是否只有汉字
export const isChinese = (v) => {
	let re = new RegExp("^[\u4e00-\u9fa5]+$");
	return re.test(v);
}

// 验证内容中是否只有汉字和数字
export const isChineseAndNum = (v) => {
	let re = new RegExp("^[0-9\u4e00-\u9fa5]+$");
	return re.test(v);
}