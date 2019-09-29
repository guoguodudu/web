import React, { Component } from "react";
import { Modal, Button, Form, Upload, DatePicker, InputNumber } from "antd";
import { UploadFile, SelectField } from "@/components/fields";
import {
	UPLOAD_TXT as title,
	MODAL_WIDTH,
	DATETIME_FORMAT_YMD,
	DATETIME_FORMAT_YM,
	PLEASE_UPLOAD_ONE_FILE,
	SELECT_RULE_IS_REQUIRED_CONFIG,
	INPUT_RULE_IS_REQUIRED_CONFIG,
	DIS_COST_STANDARD_AFTER_TXT
} from "@/constants";
import {
	gotSupconListOnChange,
	getDisabledStartEndDateByEvent,
	gotSupplierListOnChange,
	disabledAfterToday,
	// financeaplDetailDownload
	financeaplDetailDownloadTempUtil,
	// DIS_COST_STANDARD_AFTER
} from "@/utils";
import {financeaplDetail} from "@/api";
import { successInfo } from "../../../Common";

const { MonthPicker } = DatePicker;

class UploadModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gotSupconList: [],
			fileList: []
		};
		this.gotSupplierListOnChange = gotSupplierListOnChange.bind(this);
		this.gotSupconListOnChange = gotSupconListOnChange.bind(this);
		this.OK = this.OK.bind(this);
		this.getDisabledStartEndDateByEvent = getDisabledStartEndDateByEvent.bind(
			this
		);
		this.financeaplDetailDownloadTemplate = this.financeaplDetailDownloadTemplate.bind(this);

	}

	financeaplDetailDownloadTemplate(){
		
		financeaplDetailDownloadTempUtil({accReceiveCode:-1})
	}

	OK() {
		// console.log("OK ~~~~~~~~~~~~");
		const {
			props: { form, cancel }
		} = this;
		form.validateFields((err, values) => {
			console.log(values);
			if (err) {
				console.log(err);
				return false;
			} else {
			}
			const {
				file,
				legalCode,
				supCode,
				supConDate,
				disCostStandard,
				financeDate,
				repayExpcDate
			} = values;
			const {state:{actingSupconListItem:{
				supConCode
			}}}= this
			
			const postForm = new FormData()			
			postForm.append("legalCode",legalCode)
			postForm.append("supCode",supCode)
			postForm.append("file",file)
			postForm.append("supConCode",supConCode)
			postForm.append("financeDate",financeDate.format(DATETIME_FORMAT_YMD))
			postForm.append("repayExpcDate",repayExpcDate.format(DATETIME_FORMAT_YMD))
			postForm.append("disCostStandard",disCostStandard)
			postForm.append("supConDate",supConDate.format(DATETIME_FORMAT_YM))
			console.log(values);
			console.log(postForm);
			// return false
			financeaplDetail.financeaplDetailSubmit(postForm).then(res=>{
				successInfo("提交成功");
				cancel();
			}).catch(e=>{
			})
			// console.log(values);
		});
	}

	render() {
		const {
			props: {
				visible,
				cancel,
				modalWidth,
				gotSupplierList,
				form: { getFieldDecorator }
			},
			state: { gotSupconList, actingSupconListItem}
		} = this;

		return (
			<div className="upload-modal">
				<Modal
					width={modalWidth ||MODAL_WIDTH}
					// visible={!!addOrEdit}
					destroyOnClose={1}
					visible={visible}
					title={title}
					onCancel={cancel}
					footer={[
						<Button key="back" size="large" onClick={cancel}>
							取消
						</Button>,
						<Button
							key="submit"
							type="primary"
							size="large"
							onClick={this.OK}
						>
							提交
						</Button>
					]}
				>
					<Form layout="inline">
						<SelectField
							fieldDecoratorKey="supCode"
							getFieldDecorator={getFieldDecorator}
							inputWidth="120px"
							gotListOnChange={this.gotSupplierListOnChange}
							placeholder="请选择"
							label="供应商"
							gotList={gotSupplierList}
							gotListL="supShortName"
							config={SELECT_RULE_IS_REQUIRED_CONFIG}
							gotListV="supCode"
						/>
						<SelectField
							fieldDecoratorKey="legalCode"
							getFieldDecorator={getFieldDecorator}
							inputWidth="120px"
							gotListOnChange={this.gotSupconListOnChange}
							placeholder="请选择"
							config={SELECT_RULE_IS_REQUIRED_CONFIG}
							label="法人主体"
							gotList={gotSupconList}
							gotListL="legalCompSname"
							gotListV="legalCode"
						/>
						
						<Form.Item label="劳务派遣费用标准">
							{getFieldDecorator(
								"disCostStandard",
								INPUT_RULE_IS_REQUIRED_CONFIG
							)(
							<InputNumber min={0} className="addon-after" />
							)}
							{DIS_COST_STANDARD_AFTER_TXT}
						</Form.Item>

						<Form.Item label="日期止日">
							{getFieldDecorator(
								"supConDate",
								SELECT_RULE_IS_REQUIRED_CONFIG
							)(
								<MonthPicker
									disabled={!actingSupconListItem}
									format={DATETIME_FORMAT_YM}
									disabledDate={
										this.getDisabledStartEndDateByEvent
									}
								/>
							)}
						</Form.Item>

						<Form.Item label="融资起日">
							{getFieldDecorator(
								"financeDate",
								SELECT_RULE_IS_REQUIRED_CONFIG
							)(
								<DatePicker
									disabled={!actingSupconListItem}
									format={DATETIME_FORMAT_YMD}
									disabledDate={
										disabledAfterToday
									}
								/>
							)}
						</Form.Item>

						<Form.Item label="预计还款日">
							{getFieldDecorator(
								"repayExpcDate",
								SELECT_RULE_IS_REQUIRED_CONFIG
							)(
								<DatePicker
									disabled={!actingSupconListItem}
									format={DATETIME_FORMAT_YMD}
									disabledDate={
										disabledAfterToday
									}
								/>
							)}
						</Form.Item>					
						<br />
						<Form.Item label="文 件" className="mt-10">
							{getFieldDecorator("file", {
								rules: [
									{
										required: true,
										message: PLEASE_UPLOAD_ONE_FILE
									}
								]
							})(<UploadFile parent={this} formField="file" />)}
						</Form.Item>
						<a className="blue" style={{marginLeft:"10px"}} onClick={this.financeaplDetailDownloadTemplate} target="_blank">下载模板文件</a>

					</Form>
					<Upload />
				</Modal>
			</div>
		);
	}
}

const WrappedUploadModal = Form.create({ name: "UploadModal" })(UploadModal);
export default WrappedUploadModal;
