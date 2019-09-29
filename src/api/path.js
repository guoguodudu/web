import IP_CONFIG from "../ip_config";

export const getBaseUrl = serverName => {
	const filterIp = IP_CONFIG.ips.filter(i => i.key === serverName);
	if (filterIp.length) {
		return filterIp[0].value;
	} else {
		return null;
	}
};
// 后端服务
export const IP_PORT_BACKEND = getBaseUrl("IP_PORT_BACKEND");
// 签章服务
export const IP_PORT_SIGN = getBaseUrl("IP_PORT_SIGN");

export const IP_PORT_FRONTEND = getBaseUrl("IP_PORT_FRONTEND");
// 静态文件访问地址：
export const IP_PORT_BACKEND_STATIC = getBaseUrl("IP_PORT_BACKEND_STATIC");

// 案件查询
export const ACC_CORE_SALES_QUERY = IP_PORT_BACKEND + "/somepath";

// 修改密码的接口地址
export const AUTH_USERAPI_UPDATEPWD = IP_PORT_BACKEND + "/userapi/updatePwd";

// 登录校验
export const USER_LOGIN = IP_PORT_BACKEND + "/shiroapi/login_check";
// 忘记密码
export const USER_FORGET = IP_PORT_BACKEND + "/shiroapi/forgetPwd";
// 登出
export const USER_LOGOUT = IP_PORT_BACKEND + "/shiroapi/logout";

export const CONTRACT_CONF_LIST = IP_PORT_BACKEND + '/contractConf/queryBean';
export const CONTRACT_CONF_ADD = IP_PORT_BACKEND + '/contractConf/add';
export const CONTRACT_CONF_UPDATE = IP_PORT_BACKEND + '/contractConf/update';
export const CONTRACT_CONF_DELETE = IP_PORT_BACKEND + '/contractConf/delete';
export const CONTRACT_CONF_STOCK = IP_PORT_BACKEND + "/contractConf/queryStockOrgList";
// 融资业务信息 增删改查
export const FINANCE_APL_ADD = IP_PORT_BACKEND + "/financeapl/add";
export const FINANCE_APL_DELETE = IP_PORT_BACKEND + "/financeapl/delete";
export const FINANCE_APL_UPDATE = IP_PORT_BACKEND + "/financeapl/update";
export const FINANCE_APL_LIST = IP_PORT_BACKEND + "/financeapl/list";
export const FINANCE_APL_APPROVE = IP_PORT_BACKEND + "/financeapl/approve";
export const FINANCE_APL_CONFIRMGIVEAMT = IP_PORT_BACKEND + "/financeapl/confirmGiveAmt";
export const FINANCE_APL_CONFIRMGIVEAMTRETURN = IP_PORT_BACKEND + "/financeapl/confirmGiveAmtReturn";
export const FINANCE_APL_CONFIRMFINUSE = IP_PORT_BACKEND + "/financeapl/confirmFinUse";
export const FINANCE_APL_CONFIRMFINUSEAMTRETURN = IP_PORT_BACKEND + "/financeapl/confirmFinUseAmtReturn";
export const FINANCE_APL_CONFIRMBACK = IP_PORT_BACKEND + "/financeapl/confirmBack";

// 供应合同表信息 增删改查
export const SUP_CON_ADD = IP_PORT_BACKEND + "/subCon/add";
export const SUP_CON_DELETE = IP_PORT_BACKEND + "/subCon/delete";
export const SUP_CON_UPDATE = IP_PORT_BACKEND + "/subCon/update";
export const SUP_CON_LIST = IP_PORT_BACKEND + "/subCon/query";

// 供应商信息表 增删改查 上传文件
export const SUP_INFO_ADD = IP_PORT_BACKEND + "/supInfo/add";
export const SUP_INFO_DELETE = IP_PORT_BACKEND + "/supInfo/delete";
export const SUP_INFO_UPDATE = IP_PORT_BACKEND + "/supInfo/update";
export const SUP_INFO_LIST = IP_PORT_BACKEND + "/supInfo/query";
export const SUP_INFO_CONDITION = IP_PORT_BACKEND + "/supInfo/disSinfoquery";

// 核心企业主体信息 增删改查
export const LEGAL_INFO_ADD = IP_PORT_BACKEND + "/legal/add";
export const LEGAL_INFO_DELETE = IP_PORT_BACKEND + "/legal/delete";
export const LEGAL_INFO_UPDATE = IP_PORT_BACKEND + "/legal/update";
export const LEGAL_INFO_LIST = IP_PORT_BACKEND + "/legal/query";
export const LEGAL_INFO_CONDITION = IP_PORT_BACKEND + "/legal/disQuery";

// 融资业务回款账户 增删改查
export const REPAY_ACCONT_LOG_ADD = IP_PORT_BACKEND + "/reAccLog/add";
export const REPAY_ACCONT_LOG_DELETE = IP_PORT_BACKEND + "/reAccLog/delete";
export const REPAY_ACCONT_LOG_UPDATE = IP_PORT_BACKEND + "/reAccLog/update";
export const REPAY_ACCONT_LOG_LIST = IP_PORT_BACKEND + "/reAccLog/query";

// 资金方信息表 增删改查 上传文件
export const FUNDER_INFO_ADD = IP_PORT_BACKEND + "/funder/add";
export const FUNDER_INFO_DELETE = IP_PORT_BACKEND + "/funder/delete";
export const FUNDER_INFO_UPDATE = IP_PORT_BACKEND + "/funder/update";
export const FUNDER_INFO_LIST = IP_PORT_BACKEND + "/funder/list";
export const FUNDER_INFO_CONDITION = IP_PORT_BACKEND + "/funder/queryOrgProfileList";

export const UP_FILE = IP_PORT_BACKEND + "/file/upFile";
export const PRE_FILE = IP_PORT_BACKEND_STATIC + "/file/preview/";

// 查询供应商列表
export const SUPPLIER_LIST =
	IP_PORT_BACKEND + "/financeapldetail/supplier/list";

// # 查询主体法人代码列表
// http://192.168.19.2:9086/financeapldetail/supcon/list
// 参数：
// 供应商代码supCode

export const SUPCON_LIST = IP_PORT_BACKEND + "/financeapldetail/supcon/list";

// 参数：
// 供应商代码supCode
// 厂区工号factoryWorkNo
// 应收账款编号accReceiveCode
// 日期起startDate
// 日期止endDate

export const FINANCEAPL_DETAIL_LIST =
	IP_PORT_BACKEND + "/financeapldetail/list";

// 参数：
// private String supCode;// 供应商代码
// private String supConCode;// 供应合同编号
// private String legalCode;// 法人代码
// private LocalDate supConDate;// 年月
// private MultipartFile file;// 文件
// http://192.168.19.2:9086/financeapldetail/submit

export const FINANCEAPL_DETAIL_SUBMIT =
	IP_PORT_BACKEND + "/financeapldetail/submit";

	// http://192.168.19.2:9086/financeapldetail/download
export const FINANCEAPL_DETAIL_DOWNLOAD = IP_PORT_BACKEND + "/financeapldetail/download";
export const FINANCEAPL_DETAIL_DOWNLOAD_TEMP = IP_PORT_BACKEND + "/financeapldetail/downloadTemp";

// # 查根据供应商ID查询资金方列表
// http://192.168.19.2:9086/financeapldetail/funder/list
// 参数：
// 供应商代码supCode

export const FINANCEAPL_DETAIL_FUNDER_LIST =
	IP_PORT_BACKEND + "/financeapldetail/funder/list";


export const SIGN_TEMP_ADD = IP_PORT_BACKEND + "/signTemplate/download";
export const SIGN_TEMP_UPDATE = IP_PORT_BACKEND + "/signTemplate/update";
export const SIGN_TEMP_UPD_STATUS = IP_PORT_BACKEND + "/signTemplate/updateSignTemplateStatus";
export const SIGN_TEMP_LIST = IP_PORT_BACKEND + "/signTemplate/query";
export const SIGN_TEMP_UPLOAD = IP_PORT_BACKEND + "/signTemplate/download";
export const SIGN_TEMP_FDDSUBMIT = IP_PORT_BACKEND + "/signTemplate/fddSubmit";
export const SIGN_TEMP_SUBMIT = IP_PORT_BACKEND + "/signTemplate/submit";
export const SIGN_TEMP_QRYTEMPID = IP_PORT_BACKEND + "/signTemplate/queryTempList";

export const SIGN_PARM_UPDATE = IP_PORT_BACKEND + "/signParm/update";
export const SIGN_PARM_LIST = IP_PORT_BACKEND + "/signParm/query";
