import React from "react";
import { Form, Modal, Button } from "antd";
import { ADD_OR_EDIT_MAP,MODAL_WIDTH } from "@/constants";
import { ENTITY } from "./Conf";
import { getAddOrEditFormFromEntity } from "@/utils";
class AddOrEditForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			type: null
		};
		this.addOrEditOk = this.addOrEditOk.bind(this);
		this.addOrEditCancel = this.addOrEditCancel.bind(this);
	}

	addOrEditOk() {
		const {
			props: { close }
		} = this;
		close();
	}
	addOrEditCancel() {
		const {
			props: { close }
		} = this;
		close();
	}
	render() {
		const {
			props: {
				form: { getFieldDecorator },
				modalWidth,
				addOrEdit
			}
		} = this;
		const title = ADD_OR_EDIT_MAP[addOrEdit];

		return (
			<div
				className="add-or-edit"
				style={{ display: `${addOrEdit ? "block" : "none"}` }}
			>
				<Modal
					width={modalWidth ||MODAL_WIDTH}
					visible={!!addOrEdit}
					destroyOnClose={1}
					title={title}
					footer={[
						<Button
							key="back"
							size="large"
							onClick={this.addOrEditCancel}
						>
							取消
						</Button>,
						<Button
							key="submit"
							type="primary"
							size="large"
							onClick={this.addOrEditOk}
						>
							提交
						</Button>
					]}
				>
					<Form layout="inline" onSubmit={this.handleSubmit}>
						{getAddOrEditFormFromEntity(ENTITY, getFieldDecorator)}
					</Form>
				</Modal>
			</div>
		);
	}
}
const WrappedAddOrEditForm = Form.create({ name: "AddOrEditForm" })(
	AddOrEditForm
);
export default WrappedAddOrEditForm;
