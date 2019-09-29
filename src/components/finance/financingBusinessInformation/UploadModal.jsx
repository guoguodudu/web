import React, { Component } from "react";
import {
	message,
	Modal,
	Button,
	Form,
	Upload,
	Divider,
	DatePicker
} from "antd";
import { UploadFile } from "@/components/fields";
import {
	UPLOAD_TXT as title,
	MODAL_WIDTH,
	PLEASE_UPLOAD_ONE_FILE,
	EXCEL_OR_IMG_TYPE,
	DATETIME_FORMAT_YMD
} from "@/constants";
import {
	gotSupconListOnChange,
	getDisabledStartEndDateByEvent,
	gotSupplierListOnChange
	// DIS_COST_STANDARD_AFTER
} from "@/utils";
import { financeApl, uploadSigleFile } from "@/api";
import moment from "moment";
// import { successInfo, messageError } from "../../../Common";

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
		this.allOkPassAjax = this.allOkPassAjax.bind(this);
	}

	allOkPassAjax (){
		const {
			props: {
				refreshQuery,
				cancel,
			}
		} = this;
		message.success("上传成功！");
		cancel();		
		refreshQuery();
	}
	OK() {
		// console.log("OK ~~~~~~~~~~~~");
		const {
			allOkPassAjax,
			props: {
				form,
				// refreshQuery,
				// cancel,
				uploadModalShowRecord: { id }
			}
		} = this;
		form.validateFields((err, values) => {
			console.log(values);
			if (err) {
				console.log(err);
				return false;
			} else {
			}
			const { funderPayAdd, repayAdd,financeDate } = values;
			uploadSigleFile(funderPayAdd).then(funderPayAddRes => {
				console.log(funderPayAddRes)
				uploadSigleFile(repayAdd).then(repayAddRes => {
					const financeDateFormated = financeDate.format(DATETIME_FORMAT_YMD)
					financeApl
						.update({
							id,
							funderPayAdd: funderPayAddRes,
							repayAdd: repayAddRes,
							financeDate: financeDateFormated
						})
						.then(res => {
							allOkPassAjax()
						})
						.catch(e => {
							message.error("上传失败！");
						});
				});
			},err=>{
				console.log(err)
			});
			return false;
		});
	}

	render() {
		const {
			props: {
				visible,
				cancel,
				form: { getFieldDecorator },
				modalWidth,
				uploadModalShowRecord: { financeDate }
			},
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
					<Form layout="inline" labelCol={{ span: 6 }}>

					<Form.Item label="融资起日" labelCol={5}>
							{getFieldDecorator(
								"financeDate",{
									initialValue: moment(financeDate, DATETIME_FORMAT_YMD)
								}
							)(
								<DatePicker
									format={DATETIME_FORMAT_YMD}
					// defaultValue={moment(financeDate, DATETIME_FORMAT_YMD)}									
								/>
							)}
						</Form.Item>

						{/* 资金方放款凭证地址 */}
						<Form.Item label="资金方放款凭证" className="mt-10">
							{getFieldDecorator("funderPayAdd", {
								rules: [
									{
										required: true,
										message: PLEASE_UPLOAD_ONE_FILE
									}
								]
							})(
								<UploadFile
									parent={this}
									filelistK="funderPayAddFileList"
									formField="funderPayAdd"
									ACCEPT_FILE_TYPE={EXCEL_OR_IMG_TYPE}
								/>
							)}
						</Form.Item>

						<Divider />
						{/* 回款凭证地址 */}
						<Form.Item label="回款凭证地址" className="mt-10">
							{getFieldDecorator("repayAdd", {
								rules: [
									{
										required: true,
										message: PLEASE_UPLOAD_ONE_FILE
									}
								]
							})(
								<UploadFile
									parent={this}
									filelistK="repayAddFileList"
									formField="repayAdd"
									ACCEPT_FILE_TYPE={EXCEL_OR_IMG_TYPE}
								/>
							)}
						</Form.Item>
					</Form>
					<Upload />
				</Modal>
			</div>
		);
	}
}

const WrappedUploadModal = Form.create({ name: "UploadModal" })(UploadModal);
export default WrappedUploadModal;
