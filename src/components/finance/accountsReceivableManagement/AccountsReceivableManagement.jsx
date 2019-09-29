import React from "react";
import { Card, Table, Divider, Button, Form, DatePicker, Input } from "antd";
import { hasAdd, ENTITY } from "./Conf";
import {
	delayChangePageNumberReloadData,
	changePageNumberReloadData,
	// getFieldFromEntity,
	operationMenu,
	close,
	add,
	// edit,
	getColumnsByEntity,
	reset,
	gotSupplierListOnChange,
	gotSupconListOnChange,
	authRequireRule,
	gotIfHasBigPermission,
	financeaplDetailDownload
} from "@/utils";
import {
	setRowClassName,
	TABLE_PROPS,
	checkButtPermissionTF,
	checkButtPermission,
	// downFile
} from "@/Common";
import { financeaplDetail } from "@/api";
import {
	// EXCEL_DOWNLOAD_TYPE,
	PLEASE_INPUT,
	DATETIME_FORMAT_YMD,
	// DATETIME_FORMAT_YM,
	ONE,
	PAGE_SIZE
} from "@/constants";
import AddOrEdit from "./AddOrEdit";
import { SelectField } from "@/components/fields";
import UploadModal from "./UploadModal";

const ENTITY_KEYS = Object.keys(ENTITY);
// const { MonthPicker } = DatePicker;

class AccountsReceivableManagement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			addOrEdit: null,
			gotSupplierList: [],
			gotSupconList: []
		};
		this.subQuery = this.subQuery.bind(this);
		this.setRowClassName = setRowClassName.bind(this);
		const {
			props: {
				location: { pathname: pageId }
			}
		} = this;
		this.pageId = pageId;
		this.gotColumns = [
			...getColumnsByEntity(ENTITY, ENTITY_KEYS),
			checkButtPermissionTF(pageId, "editButt")
				? operationMenu(pageId, this)
				: null
		].filter(b => b);
		this.delayChangePageNumberReloadData = delayChangePageNumberReloadData.bind(
			this
		);
		this.timeout = null;
		this.canAjax = true;
		this.changePageNumberReloadData = changePageNumberReloadData.bind(this);
		this.close = close.bind(this);
		this.add = add.bind(this);
		this.upload = this.upload.bind(this);
		this.initSupplierList = this.initSupplierList.bind(this);
		this.gotSupplierListOnChange = gotSupplierListOnChange.bind(this);
		this.gotSupconListOnChange = gotSupconListOnChange.bind(this);
		this.cancelUploadModal = this.cancelUploadModal.bind(this);
		this.download = this.download.bind(this);
	}
	componentWillMount(){
		this.setState({
			HAS_BIG_PERMISSION:gotIfHasBigPermission()
		})
	}
	componentDidMount() {
		this.timeouts = [];
		this.initSupplierList();
	}
	// 初始主体法人下拉列表
	async initSupplierList() {
		const gotSupplierList = await financeaplDetail.supplierList();
		this.setState({
			gotSupplierList
		});
		console.log("gotSupplierList", gotSupplierList);
		// financeaplDetail.supplierList().then(res => {
		// 	console.log("financeaplDetail res", res);
		// }).catch(e=>{
		// 	console.log(e)
		// });
	}

	download() {
		const {
			state: { queryArgsCache }
		} = this;
		financeaplDetailDownload(queryArgsCache)
		// financeaplDetail
		// 	.financeaplDetailDownload(queryArgsCache)
		// 	.then(res => {
		// 		// 下载这个报表excel文件
		// 		const blob = new Blob([res.data], {
		// 			type: EXCEL_DOWNLOAD_TYPE
		// 		});
		// 		downFile(blob, "应收账款管理" + +new Date() + ".xlsx");
		// 	})
		// 	.catch(e => {
		// 		console.log(e);
		// 	});
	}
	setTimeout() {
		this.timeouts.push(setTimeout.apply(null, arguments));
	}

	clearTimeouts() {
		this.timeouts.forEach(clearTimeout);
	}

	subQuery(values) {
		this.setState({
			pageNum: ONE,
			queryArgsCache: values
		});
		this.query({
			...values,
			pageNum: ONE,
			pageSize: PAGE_SIZE
		});
	}
	query(values = {}) {
		if (this.canAjax) {
			this.canAjax = false;
			this.setState({
				loading: true
			});
		} else {
			return false;
		}
		financeaplDetail
			.financeaplDetailList(values)
			.then(res => {
				this.setState({ ...res }, () => {
					// console.log(this.state);
				});
				return;
			})
			.catch(e => {})
			.finally(() => {
				setTimeout(()=>{
					this.canAjax = true;
				},1000)
				this.setState({
					loading: false
				});
			});
	}
	upload() {
		console.log("upload");
		this.setState({ uploadModalShow: true });
	}
	cancelUploadModal() {
		this.setState({ uploadModalShow: false });
	}
	render() {
		// endRow: 0
		// hasNextPage: false
		// hasPreviousPage: false
		// isFirstPage: false
		// isLastPage: false
		// list: [{…}]
		// navigateFirstPage: 0
		// navigateLastPage: 0
		// navigatePages: 0
		// navigatepageNums: null
		// nextPage: 0
		// pageNum: 1
		// pageSize: 1
		// pages: 0
		// prePage: 0
		// size: 0
		// startRow: 0
		// total: 1

		const {
			addOrEdit,
			loading,
			total,
			pageNum,
			pageSize,
			list,
			gotSupplierList,
			gotSupconList,
			uploadModalShow,
			HAS_BIG_PERMISSION
		} = this.state;

		const rlist = list.map((i, idx) => {
			i.key = idx + 9;
			return i;
		});
		const pagination = {
			current: pageNum,
			pageSize: pageSize,
			// total: Math.ceil(TotalNum/CurPageNum),
			total: total,
			showTotal:(total)=>{
				return `共${total}条`
			},
			onChange: (page, pageSize) => {
				// 更改页码重新载入数据
				this.delayChangePageNumberReloadData(page);
			}
		};
		const hasDownload = rlist && (Array.isArray(rlist) && rlist.length);
		return (
			<div className="page-box">
				<Card title="应收账款管理" bordered={false}>
					<WrappedFormTop
						gotSupconList={gotSupconList}
						gotSupplierList={gotSupplierList}
						subQuery={this.subQuery}
						upload={this.upload}
						HAS_BIG_PERMISSION={HAS_BIG_PERMISSION}
						gotSupplierListOnChange={this.gotSupplierListOnChange}
						gotSupconListOnChange={this.gotSupconListOnChange}
					/>
					<Divider />
					{hasAdd && (
						<div
							style={{
								display: checkButtPermission(
									this.pageId,
									"addButt"
								)
							}}
						>
							<Button
								type="primary"
								className="mb-10"
								icon="plus"
								onClick={() => this.add()}
							>
								新增模板
							</Button>
						</div>
					)}
					{(hasDownload && (
						<Button onClick={this.download} className="mb-10">
							下载
						</Button>
					)) ||
						null}

					<Table
						{...TABLE_PROPS(this, ENTITY_KEYS, ENTITY)}
						dataSource={rlist}
						columns={this.gotColumns}
						pagination={pagination}
						loading={loading}
					/>
				</Card>
				{addOrEdit && (
					<AddOrEdit addOrEdit={addOrEdit} close={this.close} modalWidth="1000px" />
				)}
				{uploadModalShow && (
					<UploadModal
						gotSupplierList={gotSupplierList}
						visible={uploadModalShow}
						modalWidth="900px" 
						cancel={this.cancelUploadModal}
					/>
				)}
			</div>
		);
	}
}

export default AccountsReceivableManagement;

class FormTop extends React.Component {
	constructor(props) {
		super(props);
		this.reset = reset.bind(this);
	}
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (err){
				return false
			}else{}
			const {
				props: { subQuery }
			} = this;
			console.log("valuesvaluesvaluesvalues");
			console.log(values);
			const { startDate, endDate } = values;
			subQuery({
				...values,
				startDate: startDate
					? startDate.format(DATETIME_FORMAT_YMD)
					: undefined,
				endDate: endDate
					? endDate.format(DATETIME_FORMAT_YMD)
					: undefined
			});
		});
	};

	render() {
		const {
			props: {
				upload,
				gotSupplierList,
				gotSupplierListOnChange,
				gotSupconList,
				gotSupconListOnChange,
				HAS_BIG_PERMISSION,
				form: { getFieldDecorator }
			}
		} = this;

		return (
			<Form layout="inline" onSubmit={this.handleSubmit}>
				{/* {getFieldFromEntity(ENTITY, getFieldDecorator)} */}
				<SelectField
					config={authRequireRule()}
					fieldDecoratorKey="supCode"
					getFieldDecorator={getFieldDecorator}
					inputWidth="120px"
					gotListOnChange={gotSupplierListOnChange}
					placeholder="请选择"
					label="供应商简称"
					gotList={gotSupplierList}
					gotListL="supShortName"
					gotListV="supCode"
				/>
				<SelectField
					fieldDecoratorKey="legalCode"
					getFieldDecorator={getFieldDecorator}
					inputWidth="120px"
					gotListOnChange={gotSupconListOnChange}
					placeholder="请选择"
					label="主体法人单位简称"
					gotList={gotSupconList}
					gotListL="legalCompSname"
					gotListV="legalCode"
				/>
				<Form.Item label="应收账款编号">
					{getFieldDecorator("accReceiveCode")(
						<Input allowClear placeholder={PLEASE_INPUT} />
					)}
				</Form.Item>

				<Form.Item label="结算开始日期起日">
					{getFieldDecorator("startDate")(
						<DatePicker format={DATETIME_FORMAT_YMD} />
					)}
				</Form.Item>

				<Form.Item label="结算开始日期止日">
					{getFieldDecorator("endDate")(
						<DatePicker format={DATETIME_FORMAT_YMD} />
					)}
				</Form.Item>

				<Form.Item>
					<Button type="primary" htmlType="submit">
						查询
					</Button>
					<Button onClick={this.reset}>重置</Button>
					{/* 只有技服主体有权限能看到 */}
					{HAS_BIG_PERMISSION&&<Button onClick={upload}>上传</Button>}
				</Form.Item>
			</Form>
		);
	}
}

const WrappedFormTop = Form.create({ name: "accounts-receivable-management" })(
	FormTop
);
