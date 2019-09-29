// 身份类型
export const TSERVICE = 'TSERVICE'
/*
有权限，
-融资业务信息操作-
-应收账款上传-
*/
export const HAS_BIG_PERMISSION = [TSERVICE]
// 字段的类型
export const FORM_TYPE_TEXT = "text";
export const FORM_TYPE_IMG = "img";
export const FORM_TYPE_DATE_YMD = "FORM_TYPE_DATE_YMD";
export const FORM_TYPE_SELECT = "FORM_TYPE_SELECT";

export const FORM_FIELD_WIDTH_ADD_OR_EDIT = "31%";
export const DEFAULT_SELECT_WIDTH = "150PX";
export const DEFAULT_FIELD_DECORATOR_KEY = "DEFAULT_FIELD_DECORATOR_KEY"
export const REMOTE = 'GET_FROM_REMOTE'
// 弹出modal框的宽度
export const MODAL_WIDTH = "1300px";

// 模态框中的col的span值
export const MODAL_SPAN_N = 6;

// 分页参数
export const PAGE_SIZE = 10;
export const UPLOAD_TXT = "上传";
export const PLEASE_INPUT = "请输入";
export const PLEASE_SELECT = "请选择";
export const UPLOAD_TEXT_TOOLTIP = '上传'
// 初始页码
export const ONE = 1;
// 添加或者编辑变量
export const ADD_OR_EDIT_MAP = {
	add: "新增",
	edit: "编辑"
};

// 常用的日期格式
export const DATETIME_FORMAT_YM = "YYYY-MM";
export const DATETIME_FORMAT_YMD = "YYYY-MM-DD";
export const DATETIME_FORMAT_YMDHMS = "YYYY-MM-DD HH:mm:ss";

// 错误码
export const NETWORK_ERR_CODE = 500;

// 错误信息
export const NETWORK_ERR_MSG = "网络错误";
export const FILE_CANT_MORE = "只能上传一个文件，请删除多余文件";
export const PLEASE_UPLOAD_ONE_FILE = "请上传一个文件";

// 请选择
export const SELECT_RULE_IS_REQUIRED_CONFIG = {
	rules: [{ required: true, message: PLEASE_SELECT }]
};
// 请输入
export const INPUT_RULE_IS_REQUIRED_CONFIG = {
	rules: [{ required: true, message: PLEASE_INPUT }]
};

export const EXCEL_TYPE = "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xls,.xlsx";

export const IMG_TYPE ='.png, .jpg, .jpeg'

export const EXCEL_OR_IMG_TYPE = '.png, .jpg, .jpeg,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xls,.xlsx';

export const EXCEL_DOWNLOAD_TYPE = "application/vnd.ms-excel;charset=UTF-8";

export const DIS_COST_STANDARD_AFTER_TXT = "元/小时/人"

export const TIME_OUT_CLICK = 1*1000
