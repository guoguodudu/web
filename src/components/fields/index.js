import React, { Component } from "react";
import { Form, Select, Upload, Icon } from "antd";
import { getBase64, generateOptionsByList } from "@/utils";
import {
	EXCEL_TYPE,
	PLEASE_SELECT,
	DEFAULT_FIELD_DECORATOR_KEY,
	DEFAULT_SELECT_WIDTH
} from "@/constants";

export function SelectField(props) {
	const {
		getFieldDecorator,
		placeholder = PLEASE_SELECT,
		fieldDecoratorKey = DEFAULT_FIELD_DECORATOR_KEY,
		inputWidth = DEFAULT_SELECT_WIDTH,
		label,
		gotList,
		gotListL,
		gotListV,
		gotListOnChange,
		config,
		formItemWidth
	} = props;
	console.log([gotList, gotListL, gotListV]);
	return (
		<Form.Item label={`${label || ""}`} style={{ width: formItemWidth }}>
			{getFieldDecorator(`${fieldDecoratorKey}`, config)(
				<Select
					onChange={gotListOnChange}
					placeholder={placeholder}
					style={{ width: inputWidth }}
				>
					{generateOptionsByList(gotList, gotListL, gotListV)}
				</Select>
			)}
		</Form.Item>
	);
}

export class UploadFile extends Component {

	render() {
		const {
			props: { parent,filelistK='filelist', formField, ACCEPT_FILE_TYPE=EXCEL_TYPE}
		} = this;

		const {
			props: { form }
		} = parent;
		const imgUrlKey = `${filelistK}ImgUrl`
		const uProps = {
			multiple: false,
			accept: ACCEPT_FILE_TYPE,
			onRemove: file => {
				parent.setState(state => {
					const index = state[filelistK].indexOf(file);
					const newFileList = state.fileList.slice();
					newFileList.splice(index, 1);
					if (
						Array.isArray(newFileList) &&
						newFileList.length === 0
					) {
						form.setFieldsValue({
							[formField]: undefined
						});
					} else {
					}
					return {
						[filelistK]: newFileList
					};
				});
			},
			beforeUpload: file => {
				parent.setState(state => ({
					// fileList: [...state.fileList, file]
					[filelistK]: [file]
				}));
				
				console.log(file)
				form.setFieldsValue({
					[formField]: file
				});
				const {type} = file
				console.log(type);
				if (type.indexOf('image')>-1){
					getBase64(file, imageUrl =>
						parent.setState({
							[imgUrlKey]: imageUrl
						}),
					  );
				}else{

				}
				return false;
			},
			fileList: parent.state[filelistK]
		};
		const thisImgUrl = parent.state[imgUrlKey]
		return (
			<div className="upload-box-outer">
				<Upload.Dragger name="files" {...uProps}>
					<div className="upload-box">
					{thisImgUrl ? <img src={thisImgUrl} alt="数据表文件" style={{ width: '100%' }} /> : <>
					<p className="ant-upload-drag-icon">
							<Icon type="inbox" />
						</p>
						<p className="ant-upload-text">点击或者拖拽上传文件</p></>}				
					</div>
				</Upload.Dragger>
			</div>
		);
	}
}
