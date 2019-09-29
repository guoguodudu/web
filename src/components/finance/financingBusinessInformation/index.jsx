import React from "react";
import {Tooltip, Card, Icon, Table,Divider, Button, Form, Upload, Modal} from "antd";
import { ENTITY } from "./conf";
import {
	delayChangePageNumberReloadData,
	changePageNumberReloadData,
	getFieldFromEntity,
	//operationMenu,
	close,
	add,
	// edit,
	getColumnsByEntity,
	reset,
	initFunderCode,
	refreshQuery,
	initSupCode,
	initLegalCode,
} from "@/utils";
import {
	setRowClassName,
	// renderTooltipText,
	doubleClick,
	successInfo,
	checkIsNull,
	checkNull,
	TABLE_PROPS,
	// checkButtPermission
	checkButtPermissionTF
} from "@/Common";
import { financeApl,updateFile } from "@/api";
import { UPLOAD_TEXT_TOOLTIP, ONE, PAGE_SIZE} from "@/constants";
import AddOrEdit from "./addOrEdit";
import FinApl from "./FinApl";
import ConfirmBack from "./ConfirmBack";
import Approve from "./Approve";
import {PRE_FILE} from "../../../api/path";
import UploadModal from "./UploadModal";
import Click from '@/components/base/Click';

const ENTITY_KEYS = Object.keys(ENTITY);

class FinancingBusinessInformation extends React.Component {
	constructor(props) {
		super(props);
		let user = JSON.parse(localStorage.getItem('user'));
		this.state = {
			repayAddFileList:[],
			funderPayAddFileList:[],
			title:"融资业务信息",
			list: [],
			addOrEdit: null,
			stateMap: new Map(),
			fileListMap: new Map(),
			stateMapInit: new Map(),
			userGroupCode: user.orgGroupCode,
			userOrgType: user.orgType,
		};

		this.subQuery = this.subQuery.bind(this);
		this.setRowClassName = setRowClassName.bind(this);
		const {
			props: {
				location: { pathname: pageId }
			}
		} = this;
		this.pageId = pageId;
		// 资金方和供应商才有操作列
		console.log('this.state.userOrgType',this.state.userOrgType);
		if(this.state.userOrgType === 'SUP' || this.state.userOrgType === 'FUNDER'){
			this.gotColumns = [
				...getColumnsByEntity(ENTITY,ENTITY_KEYS),
				this.operationFinAPl(),
				checkButtPermissionTF(pageId, "editButt") ?this.operationFinAPlEdit():null
			].filter(b => b);
		}else{
			this.gotColumns = [
				...getColumnsByEntity(ENTITY,ENTITY_KEYS),
				checkButtPermissionTF(pageId, "editButt") ?this.operationFinAPlEdit():null
			].filter(b => b);
		}
		this.delayChangePageNumberReloadData = delayChangePageNumberReloadData.bind(
			this
		);
		this.timeout = null;
		this.canAjax = true;
		this.changePageNumberReloadData = changePageNumberReloadData.bind(this);
		this.close = close.bind(this);
		this.add = add.bind(this);
		this.doubleClick = doubleClick.bind(this)
		this.initFunderCode = initFunderCode.bind(this)
		this.initSupCode = initSupCode.bind(this)
		this.initLegalCode = initLegalCode.bind(this)
		this.clearTimeouts.bind(this)
		this.gotListOnChange = {
			supCode: this.supCodeGotListOnChange.bind(this)
		}
		this.formTopRef = React.createRef()
		this.operationFinAPlEdit = this.operationFinAPlEdit.bind(this)
		this.showUploadModal = this.showUploadModal.bind(this)
		this.hideUploadModal = this.hideUploadModal.bind(this)
		this.refreshQuery = refreshQuery.bind(this)
	} 
	componentDidMount() {
		this.timeouts = [];
		this.initSupCode();
	}

	componentWillUnmount(){
		this.clearTimeouts()
	}
	supCodeGotListOnChange(d){
		this.initLegalCode({supCode:d});
		this.initFunderCode({supCode:d});	
		this.formTopRef.current.resetFields([ 'funderCode','legalCode'])
		// this.formTopRef.current.resetSub()
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
		financeApl
			.list(values)
			.then(res => {
				console.log(res);
				this.setState({ ...res });
				return;
			})
			.catch(e => {})
			.finally(() => {
				this.canAjax = true;
				this.setState({
					loading: false
				});
			});
	}

	finApply(record){
		console.log('finApply111',record);
		this.setState({
			finAplVisible: true,
			approveVisible:false,
			finRecord: record
		})
	}

	approve1(record){
		console.log('approve1--approve1',record);
		this.setState({
            finAplVisible: false,
			approveVisible:true,
			record: record,
			entity_keys:ENTITY_KEYS,
			level:'one'
        });
		
	}
	approve2(record){
		console.log('approve2',record);
		this.setState({
            finAplVisible: false,
			approveVisible:true,
			record: record,
			entity_keys:ENTITY_KEYS,
			level:'two'
        });
	}

	confirmGiveAmt(record){
		console.log('confirmGiveAmt');
		this.state.stateMap.set("ldLicAddUp", record.funderPayAdd);
		const buttonList = (
					<>
						<Button onClick={() => this.preview(this.state.stateMap.get('ldLicAddUp'))} style={{ width: '95px', marginRight: '10px' }}> 预览</Button>
						<Upload onChange={this.uploadFile.bind(this,"ldLicAddUp")}
								beforeUpload={this.beforeUpload}
								fileList={this.state.fileListMap.get('ldLicAddUp')}
						>
							<Button disabled={!checkIsNull(this.state.stateMap.get('ldLicAddUp'))} style={{ width: '95px' }}> 上传</Button>
						</Upload>
						<Button key="back" type="primary" onClick={() => this.confirmGiveAmtOrBack(record)} >
							同意
				</Button>
			{/*	<Button key="submit" type="primary" onClick={() => this.confirmGiveAmtOrReturn(record)} >
					退回
				</Button>*/}
			</>
		)
		doubleClick(
			"1",
			record,
			"null",
			ENTITY_KEYS,
			ENTITY,
			buttonList)
	}

	confirmFinUse(record){
		console.log('confirmFinUse');
		this.state.stateMap.set("repayAdd", record.repayAdd);
		const buttonList = (
			<>
				<Button onClick={() => this.preview(this.state.stateMap.get('repayAdd'))} style={{ width: '95px', marginRight: '10px' }}> 预览</Button>
				<Upload onChange={this.uploadFile.bind(this,"repayAdd")}
						beforeUpload={this.beforeUpload}
						fileList={this.state.fileListMap.get('repayAdd')}
				>
					<Button disabled={!checkIsNull(this.state.stateMap.get('repayAdd'))} style={{ width: '95px' }}> 上传</Button>
				</Upload>
				<Button key="back" type="primary" onClick={() => this.confirmFinUseOrBack(record)} >
					同意
				</Button>
				{/*<Button key="submit" type="primary" onClick={() => this.confirmFinUseOrReturn(record)} >
					退回
				</Button>*/}
			</>
		)
		doubleClick(
			"1",
			record,
			"null",
			ENTITY_KEYS,
			ENTITY,
			buttonList)
	}

	confirmBackAmt(record){
		console.log('confirmBackAmt',record);
		this.setState({
			confirmBackVisible: true,
			approveVisible:false,
			finRecord: record
		})

	}
	
	confirmFinUseOrReturn(record){
		var thi = this;
		financeApl.confirmFinUseAmtReturn({
			id:record.id,
		}).then(res => {
			successInfo("操作成功");
			this.query(this.state.queryArgsCache);
			Modal.destroyAll();
		}).catch(e => {})
			.finally(() => {
				thi.setState({ visible3: false, loading3: false });

			});
	}
	confirmFinUseOrBack(record){
		if(checkNull(this.state.stateMap.get('repayAdd'),"请上传凭证")){
			return;
		}
		financeApl.confirmFinUseAmt({
			id:record.id,
			repayAdd:this.state.stateMap.get('repayAdd')
		}).then(res => {
			successInfo("操作成功");
			this.query(this.state.queryArgsCache);
			Modal.destroyAll();
		}).catch(e => {})
			.finally(() => {
				this.canAjax = true;
				this.setState({
					loading: false
				});
			});
	}
// 显示上传文件的弹窗
	showUploadModal(record){
		console.log('record record record record record record')
		console.log(record)
		this.setState({
			uploadModalShow: true,
			uploadModalShowRecord: record,
		})
	}
	hideUploadModal(record){
		this.setState({
			uploadModalShow: false,
			uploadModalShowRecord: undefined
		})
	}
	confirmGiveAmtOrReturn(record){
		var thi = this;
		financeApl.confirmGiveAmtReturn({
			id:record.id,
		}).then(res => {
			successInfo("操作成功");
			this.query(this.state.queryArgsCache);
			Modal.destroyAll();
		}).catch(e => {})
			.finally(() => {
				thi.setState({ visible3: false, loading3: false });

			});
	}
	confirmGiveAmtOrBack(record){
		if(checkNull(this.state.stateMap.get('ldLicAddUp'),"请上传凭证")){
			return;
		}
		financeApl.confirmGiveAmt({
			id:record.id,
			funderPayAdd:this.state.stateMap.get('ldLicAddUp')
		}).then(res => {
			successInfo("操作成功");
			this.query(this.state.queryArgsCache);
			Modal.destroyAll();


		}).catch(e => {})
			.finally(() => {
				this.canAjax = true;
				this.setState({
					loading: false
				});
			});
	}
	preview = (fileInfo) => {
		console.log('fileInfo',fileInfo);
		if(checkNull(fileInfo,"凭证为空")){
			return;
		}
		let rstInfo = JSON.parse(fileInfo);
		let fileType = (rstInfo.name.substring(rstInfo.name.lastIndexOf(".")+1));
		window.open(PRE_FILE + fileType + "/"+ rstInfo.fid);
	}
	//  阻止upload组件自动提交
	beforeUpload(file){
		return false;
	}
	uploadFile = async(id, info) => {//  上传文件到文件服务器
		let result = await updateFile.up(info)
			.catch(function (error) {//防止报错
				console.log(error)
			});
		if(!checkIsNull(result)){
			let locInfo = result.retObj;
			this.state.stateMap.set(id, locInfo);
			this.state.fileListMap.set(id, info.fileList);

			this.state.stateMap.set(id.substring(0,id.length-2), locInfo);

		}else{
			this.state.stateMap.set(id, undefined);
			this.state.fileListMap.set(id, []);
			//删除当前文件或上传失败，恢复最开始的文件
			this.state.stateMap.set(id.substring(0,id.length-2), this.state.stateMapInit.get(id.substring(0,id.length-2)));
		}
		this.setState({ stateMap: this.state.stateMap, fileListMap: this.state.fileListMap});
	}

	operationFinAPlEdit = (ENTITY,ENTITY_KEYS) => {
		//	根据当前记录的当前状态，展示不同的操作按钮，点击按钮，弹出对应的编辑页面，各个页面根据业务展示
		return {
			title: UPLOAD_TEXT_TOOLTIP,
			dataIndex: "operationFinAPlEdit",
			width: 80,
			key: "operationFinAPlEdit",
			fixed: "right",
			align: "center",
			render: (text, record, index) => {
				return (
					<div
						key="operationFinAPlEdit"
						style={{ display: "block" }}
					>
						<Tooltip placement="top" title={UPLOAD_TEXT_TOOLTIP}>
							<Icon type="to-top" style={{color:"#40a9ff", fontWeight:"700",fontSize:"20px"}} onClick={()=>this.showUploadModal(record)} />
				      	</Tooltip>
					</div>
				);
			}
		};
	};

	operationFinAPl = () => {
		//	根据当前记录的当前状态，展示不同的操作按钮，点击按钮，弹出对应的编辑页面，各个页面根据业务展示
		return {
			title: "操作",
			dataIndex: "operatorFinAPl",
			width: 160,
			key: "operatorFinAPl",
			fixed: "right",
			align: "center",
			render: (text, record, index) => {

				// let mainResult = this.queryList({mainConCode:record.mainConCode, status:'ACTIVE'});
				// let funderResult = this.queryList({funderConCode:record.funderConCode, status:'ACTIVE'});
				// console.log('mainResult---',mainResult);
				// console.log('funderResult---',funderResult);
				// let mainConFunderCode = '';
				// let funderConFunderCode = '';
				// if(!checkIsNull(mainResult) && !checkIsNull(funderResult) && mainResult.length > 0 && funderResult.length > 0){
				// 	mainConFunderCode = mainResult[0].funderCode;
				// 	funderConFunderCode = funderResult[0].funderCode;
				// }
				console.log('AAAAAAAAAAAAA',record)

				return (
					<div
						key="fin_apl_operation"
						className="editable-Row-operations"
						style={{ display: "block" }}
					>
					<span>
						{	/*状态为INIT,且当前用户为该记录的【供应商】，才显示按钮*/
							(record.status === 'INIT' && (this.state.userOrgType === 'SUP') && this.state.userGroupCode === record.supCode) ?
								<Button onClick={() => this.finApply(record)} >发起融资申请</Button>
								:
								/*状态为APLD,且当前用户为该记录的【业务合同的资金方】，才显示按钮*/
								(record.status === 'APLD' && (this.state.userOrgType === 'FUNDER') && this.state.userGroupCode === record.mainConFunderCode) ?
									<Button onClick={() => this.approve1(record)} >一级审批</Button>
									:
									/*状态为APRY,且当前用户为该记录的【资金合同的资金方】，才显示按钮*/
									(record.status === 'APRY' && (this.state.userOrgType === 'FUNDER') && this.state.userGroupCode === record.funderConFunderCode) ?
										<Button onClick={() => this.approve2(record)} >二级审批</Button>
										:
										/*状态为APSY,且当前用户为该记录的【资金合同的资金方】，才显示按钮*/
										(record.status === 'APSY' && (this.state.userOrgType === 'FUNDER') && this.state.userGroupCode === record.funderConFunderCode) ?
											<Button onClick={() => this.confirmGiveAmt(record)} >确认放款</Button>
											:
											/*状态为PAYD,且当前用户为该记录的【供应商】，才显示按钮*/
											(record.status === 'PAYD' && (this.state.userOrgType === 'SUP') && this.state.userGroupCode === record.supCode) ?
												<Button onClick={() => this.confirmFinUse(record)} >确认资金用途</Button>
												:
												/*状态为USED,且当前用户为该记录的【资金合同的资金方】，才显示按钮【资金方确认已回款】*/
												(record.status === 'USED' && (this.state.userOrgType === 'FUNDER') && this.state.userGroupCode === record.funderConFunderCode) ?
													<Button onClick={() => this.confirmBackAmt(record)} >确认已回款</Button>
													:
													/*状态为FACD,且当前用户为该记录的【供应商】，才显示按钮【供应商确认已回款】*/
													(record.status === 'FACD' && (this.state.userOrgType === 'SUP') && this.state.userGroupCode === record.supCode) ?
														<Button onClick={() => this.confirmBackAmt(record)} >确认已回款</Button>
														:
														''	//其他不展示操作按钮
						}
					</span>
					</div>
				);
			}
		};
	};

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

		const {state:{
			addOrEdit,
			loading,
			total,
			pageNum,
			uploadModalShowRecord,
			pageSize,
			list,
			editingRecord,
			approveVisible,
			ALL_GOT_MAPPER,
			uploadModalShow,
			title
		}} = this;

		const rlist = list.map((i, idx) => {
			i.key = idx + 9;
			return i;
		});
		const pagination = {
			current: pageNum,
			pageSize: pageSize,
			// total: Math.ceil(TotalNum/CurPageNum),
			total: total,
			onChange: (page, pageSize) => {
				// 更改页码重新载入数据
				this.delayChangePageNumberReloadData(page);
			}
		};
		return (
			<div className="page-box">
				<Card title={title} bordered={false}>
					<WrappedFormTop ref={this.formTopRef} subQuery={this.subQuery} ALL_GOT_MAPPER={ALL_GOT_MAPPER} gotListOnChange={this.gotListOnChange} />
					<Divider />
					{/* <div style={{display : checkButtPermission(this.pageId,'editButt') }}> */}
					{/* <div style={{ display: "block" }}>
						<Button
							type="primary"
							className="mb-10"
							icon="plus"
							onClick={() => this.add()}
						>
							新增模板
						</Button>
					</div> */}
					<Table
						{...TABLE_PROPS(this,ENTITY_KEYS, ENTITY)}
						dataSource={rlist}
						columns={this.gotColumns}
						pagination={pagination}
						loading={loading}
					/>
				</Card>
				{addOrEdit&&<AddOrEdit title={title} addOrEdit={addOrEdit} close={this.close} editingRecord={editingRecord} />}
				<FinApl visible={this.state.finAplVisible} record={this.state.finRecord} parent={this} />
				{approveVisible&&<Approve visible={this.state.approveVisible} record={this.state.record} 
					entity_keys={this.state.entity_keys} level={this.state.level} parent={this} /> }
				<ConfirmBack visible={this.state.confirmBackVisible} record={this.state.finRecord} parent={this} />
				{uploadModalShow && (
					<UploadModal
						uploadModalShowRecord={uploadModalShowRecord}
						visible={uploadModalShow}
						modalWidth="600px"
						refreshQuery={this.refreshQuery}
						cancel={this.hideUploadModal}
					/>
				)}
			</div>
		);
	}
}

export default FinancingBusinessInformation;

class FormTop extends React.Component {
	constructor(props){
		super(props);
		this.reset = reset.bind(this);
	}
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (err){
				return false
			}else{

			}
			const {
				props: { subQuery }
			} = this;
			subQuery(values);
		});
	};


	render() {
		const {
			props:{
				ALL_GOT_MAPPER,
				gotListOnChange,
				form:{getFieldDecorator}
		}} = this
		return (
			<Form layout="inline" onSubmit={this.handleSubmit}>
				{getFieldFromEntity(ENTITY, getFieldDecorator,ALL_GOT_MAPPER,gotListOnChange)}
				<Form.Item>
					<Click style={{marginRight:"10px"}}>
						<Button type="primary" htmlType="submit">
							查询
						</Button>
					</Click>
					<Button onClick={this.reset}>重置</Button>
				</Form.Item>
			</Form>
		);
	}
}

const WrappedFormTop = Form.create({ name: "FinancingBusinessInformation" })(FormTop);
