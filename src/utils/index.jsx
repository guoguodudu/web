import React from "react";
import { DatePicker,Select, Button, Tooltip, Form, Input, message } from "antd";
import {
	FORM_TYPE_DATE_YMD,
	PAGE_SIZE,
	FORM_TYPE_TEXT,
	FORM_TYPE_IMG,
	DATETIME_FORMAT_YMD,
	DEFAULT_SELECT_WIDTH,
	EXCEL_DOWNLOAD_TYPE,
	FORM_TYPE_SELECT,
	FORM_FIELD_WIDTH_ADD_OR_EDIT,
	INPUT_RULE_IS_REQUIRED_CONFIG,
	HAS_BIG_PERMISSION
} from "../constants";
import { financeaplDetailDownloadTemp, financeaplDetail } from "@/api";
import moment from "moment";
import {downFile, renderTooltipText } from "../Common";
import { selectList } from "@/mapper";
import ImgPreview from "./ImgPreview";
import { SelectField } from "@/components/fields";

// import { checkButtPermission } from "../Common";
/**
 * Created by hao.cheng on 2017/4/28.
 */
// 获取url的参数
export const queryString = () => {
	let _queryString = {};
	const _query = window.location.search.substr(1);
	const _vars = _query.split("&");
	_vars.forEach((v, i) => {
		const _pair = v.split("=");
		if (!_queryString.hasOwnProperty(_pair[0])) {
			_queryString[_pair[0]] = decodeURIComponent(_pair[1]);
		} else if (typeof _queryString[_pair[0]] === "string") {
			const _arr = [_queryString[_pair[0]], decodeURIComponent(_pair[1])];
			_queryString[_pair[0]] = _arr;
		} else {
			_queryString[_pair[0]].push(decodeURIComponent(_pair[1]));
		}
	});
	return _queryString;
};

export function authRequireRule (){
	const user = JSON.parse(localStorage.getItem("user"));
	const uOrgType = user.orgType;
	if (HAS_BIG_PERMISSION.includes(uOrgType)){
		return undefined
	}else{

	}
	return INPUT_RULE_IS_REQUIRED_CONFIG
}

// 是否有大权限
export function gotIfHasBigPermission (){
	const user = JSON.parse(localStorage.getItem("user"));
	const uOrgType = user.orgType;
	return HAS_BIG_PERMISSION.includes(uOrgType)
}


export const getFieldFromEntity = (entity, getFieldDecorator,ALL_GOT_MAPPER={},gotListOnChange={}) => {
	return Object.keys(entity).map(en => {
		const { nSearch, name,searchType,gotListL, searchWidth,searchInputWitdh,
			inputWidth,gotListV,searchAuth } = entity[en];
		if (nSearch) return null;
		const basicProps = {
			label:name,
			key:en,
		}
		switch (searchType) {
			case FORM_TYPE_TEXT:
				return (
					<Form.Item {...basicProps}>
						{getFieldDecorator(en, {})(
							<Input type="text" placeholder={name} />
						)}
					</Form.Item>
				);	
			case FORM_TYPE_SELECT:
				const tConfifg = searchAuth?authRequireRule():undefined
				return (
					<SelectField {...basicProps} formItemWidth={searchWidth||DEFAULT_SELECT_WIDTH}
						searchInputWitdh={searchInputWitdh}
						fieldDecoratorKey={en}
						inputWidth={inputWidth}
						getFieldDecorator={getFieldDecorator} gotList={ALL_GOT_MAPPER[en]}
						gotListL={gotListL}
						gotListV={gotListV}
						gotListOnChange={gotListOnChange[en]}
						config={tConfifg}
					/>
				);
			default:
				return (
					<Form.Item {...basicProps}>
						{getFieldDecorator(en, {})(
							<Input type="text" placeholder={name} />
						)}
					</Form.Item>
				);		
		}
	});
};

export const editRow = function(record) {
	console.log("edit record", record);
	this.setState({
		editingRecord: record
	});
	edit.call(this);
};
export const operationMenu = (pageId, that) => {
	return {
		title: "操作",
		dataIndex: "operator999",
		width: 160,
		key: "operator999",
		fixed: "right",
		render: (text, record, index) => {
			return (
				<div
					key="999"
					className="editable-Row-operations"
					// style={{ display: checkButtPermission(pageId, "editButt") }}
					style={{ display: "block" }}
				>
					{text === 1 ? (
						<span>
							<Tooltip title="编辑">
								<Button
									type="primary"
									style={{
										height: "16px",
										border: "none",
										fontSize: "16px",
										background: "transparent",
										color: "#08c",
										title: "编辑"
									}}
									icon="edit"
									onClick={() => editRow.call(that, record)}
								/>
							</Tooltip>
							<Tooltip title="激活">
								<Button
									type="primary"
									style={{
										height: "16px",
										border: "none",
										fontSize: "16px",
										background: "transparent",
										color: "#08c",
										title: "激活"
									}}
									icon="arrow-up"
									onClick={() =>
										that.activeRule(record["id"])
									}
								/>
							</Tooltip>
							<Tooltip title="复制">
								<Button
									type="primary"
									style={{
										height: "16px",
										border: "none",
										fontSize: "16px",
										background: "transparent",
										color: "#08c",
										title: "复制"
									}}
									icon="copy"
									onClick={() => that.copyRule(record["id"])}
								/>
							</Tooltip>
							<Tooltip title="删除">
								<Button
									type="primary"
									style={{
										height: "16px",
										border: "none",
										fontSize: "16px",
										background: "transparent",
										color: "#B00",
										title: "删除"
									}}
									icon="delete"
									onClick={() =>
										that.deleteRule(record["id"])
									}
								/>
							</Tooltip>
						</span>
					) : text === 2 || true ? (
						<span>
							<Tooltip title="编辑">
								<Button
									type="primary"
									style={{
										height: "16px",
										border: "none",
										fontSize: "16px",
										background: "transparent",
										color: "#08c",
										title: "编辑"
									}}
									icon="edit"
									onClick={() => editRow.call(that, record)}
								/>
							</Tooltip>
							<Tooltip title="禁用">
								<Button
									type="primary"
									style={{
										height: "16px",
										border: "none",
										fontSize: "16px",
										background: "transparent",
										color: "#08c",
										title: "禁用"
									}}
									icon="arrow-down"
									onClick={() =>
										that.inactiveRule(record["id"])
									}
								/>
							</Tooltip>
							<Tooltip title="复制">
								<Button
									type="primary"
									style={{
										height: "16px",
										border: "none",
										fontSize: "16px",
										background: "transparent",
										color: "#08c",
										title: "复制"
									}}
									icon="copy"
									onClick={() => that.copyRule(record["id"])}
								/>
							</Tooltip>
						</span>
					) : (
						<span>
							<Tooltip title="编辑">
								<Button
									type="primary"
									style={{
										height: "16px",
										border: "none",
										fontSize: "16px",
										background: "transparent",
										color: "#08c",
										title: "编辑"
									}}
									icon="edit"
									onClick={() => editRow.call(that, record)}
								/>
							</Tooltip>
							<Tooltip title="激活">
								<Button
									type="primary"
									style={{
										height: "16px",
										border: "none",
										fontSize: "16px",
										background: "transparent",
										color: "#08c",
										title: "激活"
									}}
									icon="arrow-up"
									onClick={() =>
										that.activeRule(record["id"])
									}
								/>
							</Tooltip>
							<Tooltip title="复制">
								<Button
									type="primary"
									style={{
										height: "16px",
										border: "none",
										fontSize: "16px",
										background: "transparent",
										color: "#08c",
										title: "复制"
									}}
									icon="copy"
									onClick={() => that.copyRule(record["id"])}
								/>
							</Tooltip>
						</span>
					)}
				</div>
			);
		}
	};
};

export const operationFinAPl = (pageId, that) => {
	return {
		title: "操作",
		dataIndex: "operatorFinAPl",
		width: 160,
		key: "operatorFinAPl",
		fixed: "right",
		render: (text, record, index) => {
			return (
				<div
					key="fin_apl_operation"
					className="editable-Row-operations"
					// style={{ display: checkButtPermission(pageId, "editButt") }}
					style={{ display: "block" }}
				>
					<span>
						<Button
							type="primary"
							style={{
								height: "16px",
								border: "none",
								fontSize: "16px",
								background: "transparent",
								color: "#08c",
								title: "申请"
							}}
							icon="edit"
							onClick={() => editRow.call(that, record)}
						/>
						<Button
							type="primary"
							style={{
								height: "16px",
								border: "none",
								fontSize: "16px",
								background: "transparent",
								color: "#08c",
								title: "审批"
							}}
							icon="arrow-up"
							onClick={() => that.activeRule(record["id"])}
						/>
					</span>
				</div>
			);
		}
	};
};

export const changePageNumberReloadData = function(pageNum, NotReloadData) {
	this.setState(
		{
			pageNum
		},
		() => {
			const { queryArgsCache } = this.state;
			!NotReloadData &&
				this.query({
					...queryArgsCache,
					pageNum,
					pageSize: PAGE_SIZE
				});
		}
	);
};

export const delayChangePageNumberReloadData = function(page) {
	this.clearTimeouts();
	// pageNum , NotReloadData
	// 页码以及 不触发请求、当第二个值为true时、只改变页码而不发起数据请求
	this.changePageNumberReloadData(page, true);
	this.setTimeout(() => {
		this.changePageNumberReloadData(page);
	}, 1000);
};

export const close = function() {
	this.setState({
		addOrEdit: false
	});
};

export const add = function() {
	this.setState({
		addOrEdit: "add"
	});
};

// 编辑，z
export const edit = function() {
	this.setState({
		addOrEdit: "edit"
	});
};

// 编辑的时候的弹窗模块，根据传入的entity生成
export const getAddOrEditFormFromEntity = (
	entity,
	getFieldDecorator,
	addOrEdit,
	ALL_GOT_MAPPER={}
) => {
	return Object.keys(entity).map(en => {
		const { nAddOrEdit, name, nAdd, nEdit, addEditType, aeWidth,gotListL
			,gotListV } = entity[en];
		if (
			nAddOrEdit ||
			(addOrEdit === "add" && nAdd) ||
			(addOrEdit === "edit" && nEdit)
		)
			return null;

		const basicProps = {
			label:name,
			key:en,
			style:{
			width:FORM_FIELD_WIDTH_ADD_OR_EDIT }
		}
		switch (addEditType) {
			case FORM_TYPE_DATE_YMD:
				return (
					<Form.Item {...basicProps}>
						{getFieldDecorator(en, {})(
							<DatePicker
								format={DATETIME_FORMAT_YMD}									
							/>
						)}
					</Form.Item> 
				);
			case FORM_TYPE_SELECT:
				console.log('gotListL',gotListL)
				console.log('gotListV',gotListV)
				console.log('gotListV',ALL_GOT_MAPPER)
				console.log('gotListV',en)
				return (
					<SelectField {...basicProps} formItemWidth={aeWidth||FORM_FIELD_WIDTH_ADD_OR_EDIT}
						fieldDecoratorKey={en}
						getFieldDecorator={getFieldDecorator} gotList={ALL_GOT_MAPPER[en]}
						gotListL={gotListL}
						gotListV={gotListV}
					/>
				);
			default:
				return (
					<Form.Item {...basicProps}>
						{getFieldDecorator(en, {})(
							<Input type="text" placeholder={name} />
						)}
					</Form.Item>
				);
		}
	});
};

// 表单中的重置
export const reset = function() {
	const {
		props: { form }
	} = this;
	form.resetFields();
};

export function generateOptionsByList(
	list,
	gotListL = "label",
	gotListV = "value",
) {
	return (
		(list &&
			list.map((i, idx) => (
				<Select.Option
					value={i[gotListV]}
					key={`${i[gotListV]}-${idx}`}
				>
					{i[gotListL]}
				</Select.Option>
			))) ||
		null
	);
}

export function clearJson(myObj) {
	Object.keys(myObj).forEach(key => {
		const v = myObj[key];
		if (v == null || !("" + v).trim().length) {
			delete myObj[key];
		} else {
			if (typeof v === "string" || v instanceof String) {
				myObj[key] = v.trim();
			} else {
			}
		}
	});
	return myObj;
}

export async function getSupconListBySupCode(d) {
	const gotSupconList = await financeaplDetail.supconList(d);
	this.setState({
		gotSupconList
	});
	console.log("gotSupconList", gotSupconList);
}
export function gotSupplierListOnChange(e) {
	console.log("gotSupplierListOnChange");
	console.log(e);
	getSupconListBySupCode.call(this, { supCode: e });
}
export function gotSupconListOnChange(e) {
	console.log("gotSupconListOnChange");
	console.log(e);
	activeSupconListItem.call(this, e);
}

export function activeSupconListItem(d) {
	console.log("activeSupconListItem");
	console.log(d);
	const {
		state: { gotSupconList }
	} = this;
	this.setState(
		{
			actingSupconListItem: gotSupconList.find(it => it.legalCode === d)
		},
		() => {
			console.log(this.state);
		}
	);
}

export function disabledAfterToday(current) {
	return current && current < moment().startOf("day");
}

export function disabledStartEndDate(current, start, end) {
	if (!end) {
		return current && current < moment(start).startOf("month");
	} else {
	}
	// Can not select days before today and today
	// && current > moment("2019-09-09")
	// return current && current < moment("2019-09-09");
	return (
		current &&
		(current < moment(start).startOf("month") ||
			current > moment(start).endOf("month"))
	);
}

export function getDisabledStartEndDateByEvent(e) {
	const {
		state: {
			actingSupconListItem: { supConEndDate, supConStartDate }
		}
	} = this;
	return disabledStartEndDate(e, supConStartDate, supConEndDate);
}

export function getColumnsByEntity(ENTITY, ENTITY_KEYS) {
	return ENTITY_KEYS.map((en, idx) => {
		const { name, nTable, mapper, type } = ENTITY[en];
		if (nTable) {
			return null;
		}
		switch (type) {
			case FORM_TYPE_TEXT:
				return {
					title: "" + name,
					dataIndex: en,
					key: en + idx,
					width: 180,
					align: "center",
					render: text =>
						mapper
							? (text?selectList(mapper, text):null)
							: renderTooltipText(text, 20)
				};
			case FORM_TYPE_IMG:
				return {
					title: "" + name,
					dataIndex: en,
					key: en + idx,
					width: 180,
					align: "center",
					render: text => <ImgPreview jsonStr={text} />
				};

			default:
				return null;
		}
	});
}

export function deepCompare() {
	var i, l, leftChain, rightChain;

	function compare2Objects(x, y) {
		var p;

		// remember that NaN === NaN returns false
		// and isNaN(undefined) returns true
		if (
			isNaN(x) &&
			isNaN(y) &&
			typeof x === "number" &&
			typeof y === "number"
		) {
			return true;
		}

		// Compare primitives and functions.
		// Check if both arguments link to the same object.
		// Especially useful on the step where we compare prototypes
		if (x === y) {
			return true;
		}

		// Works in case when functions are created in constructor.
		// Comparing dates is a common scenario. Another built-ins?
		// We can even handle functions passed across iframes
		if (
			(typeof x === "function" && typeof y === "function") ||
			(x instanceof Date && y instanceof Date) ||
			(x instanceof RegExp && y instanceof RegExp) ||
			(x instanceof String && y instanceof String) ||
			(x instanceof Number && y instanceof Number)
		) {
			return x.toString() === y.toString();
		}

		// At last checking prototypes as good as we can
		if (!(x instanceof Object && y instanceof Object)) {
			return false;
		}

		if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
			return false;
		}

		if (x.constructor !== y.constructor) {
			return false;
		}

		if (x.prototype !== y.prototype) {
			return false;
		}

		// Check for infinitive linking loops
		if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
			return false;
		}

		// Quick checking of one object being a subset of another.
		// todo: cache the structure of arguments[0] for performance
		for (p in y) {
			if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
				return false;
			} else if (typeof y[p] !== typeof x[p]) {
				return false;
			}
		}

		for (p in x) {
			if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
				return false;
			} else if (typeof y[p] !== typeof x[p]) {
				return false;
			}

			switch (typeof x[p]) {
				case "object":
				case "function":
					leftChain.push(x);
					rightChain.push(y);

					if (!compare2Objects(x[p], y[p])) {
						return false;
					}

					leftChain.pop();
					rightChain.pop();
					break;

				default:
					if (x[p] !== y[p]) {
						return false;
					}
					break;
			}
		}

		return true;
	}

	if (arguments.length < 1) {
		return true; //Die silently? Don't know how to handle such case, please help...
		// throw "Need two or more arguments to compare";
	}

	for (i = 1, l = arguments.length; i < l; i++) {
		leftChain = []; //Todo: this can be cached
		rightChain = [];

		if (!compare2Objects(arguments[0], arguments[i])) {
			return false;
		}
	}

	return true;
}

export function renderFieldByTypeMapperValue(t, m, v) {
	switch (t) {
		case FORM_TYPE_TEXT:
			return m ? selectList(m, v) : renderTooltipText(v, 20);
		case FORM_TYPE_IMG:
			return <ImgPreview jsonStr={v} />;
		default:
			return null;
	}
}


// 载入供应商列表
export async function initSupCode() {
	const gotSupplierList = await financeaplDetail.supplierList()

	const {state:{ALL_GOT_MAPPER}} = this
	this.setState({
		ALL_GOT_MAPPER: {
			...ALL_GOT_MAPPER,
			supCode:gotSupplierList
		}
	});
	
}

// 载入主体法人列表
export async function initLegalCode(d){	
	const gotSupconList = await financeaplDetail.supconList(d);	
	const {state:{ALL_GOT_MAPPER}} = this
	this.setState({
		ALL_GOT_MAPPER: {
		...ALL_GOT_MAPPER,
		legalCode:gotSupconList}
	})
}

export async function initFunderCode(d) {
	const gotFunderList = await financeaplDetail.financeaplDetailFunderList(d);	
	const {state:{ALL_GOT_MAPPER}} = this
	this.setState({
		ALL_GOT_MAPPER: {
			...ALL_GOT_MAPPER,
			funderCode:gotFunderList
		}
	});
}

export function getBase64(img, callback) {
	console.log(img);
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
  }
  

export function refreshQuery(){
	this.query(this.state.queryArgsCache);
}


export function financeaplDetailDownload(json){
	financeaplDetail
			.financeaplDetailDownload(json)
			.then(res => {
				// 下载这个报表excel文件
				const blob = new Blob([res.data], {
					type: EXCEL_DOWNLOAD_TYPE
				});
				downFile(blob, "应收账款管理" + +new Date() + ".xlsx");
			})
			.catch(e => {
				console.log(e);
			});
}



export function financeaplDetailDownloadTempUtil(json){
	financeaplDetailDownloadTemp(json)
			.then(res => {
				// 下载这个报表excel文件
				const blob = new Blob([res.data], {
					type: EXCEL_DOWNLOAD_TYPE
				});
				downFile(blob, "应收账款管理模板.xlsx");
			})
			.catch(e => {
				message.error('下载失败，请联系管理员')
				console.log(e);
			});
}
