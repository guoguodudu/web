import React from "react";
import { Form, Modal, Button } from "antd";
import { ADD_OR_EDIT_MAP,MODAL_WIDTH } from "@/constants";
import { ENTITY } from "./conf";
import { getAddOrEditFormFromEntity } from "@/utils";
import {contractConf,supInfo} from "@/api";

class AddOrEditForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
		this.addOrEditOk = this.addOrEditOk.bind(this);
		this.addOrEditCancel = this.addOrEditCancel.bind(this);		
	}
	
	componentDidMount(){
		const {
			props: {
				form: { setFieldsValue },
				editingRecord
			}
		} = this;
		setFieldsValue(editingRecord)
		this.initFunderCode()
		this.initSupCode()
	}

	initFunderCode() {
        contractConf.stock({}).then((funderCodeList)=> {
			console.log('funderCodeListfunderCodeListfunderCodeListfunderCodeListfunderCodeList')
			console.log(funderCodeList)
			const {state:{ALL_GOT_MAPPER}} = this
            this.setState({
                ALL_GOT_MAPPER: {
					...ALL_GOT_MAPPER,
					funderCodeName:funderCodeList
				}
            });
        }).catch(function (error) {
        });
    }

    initSupCode() {
        supInfo.condition({}).then( (supCodeList) =>{
			console.log('supCodeListsupCodeListsupCodeListsupCodeListsupCodeListsupCodeListsupCodeList')
			console.log(supCodeList);
			const {state:{ALL_GOT_MAPPER}} = this
            this.setState({
                ALL_GOT_MAPPER: {
					...ALL_GOT_MAPPER,
					supCodeName:supCodeList
				}
            });
        }).catch(function (error) {
        });
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
			state: {
				ALL_GOT_MAPPER
			},
			props: { addOrEdit,title:pTitle,
			form: { getFieldDecorator } }
		} = this;
		const title = ADD_OR_EDIT_MAP[addOrEdit];

		console.log('ALL_GOT_MAPPERALL_GOT_MAPPERALL_GOT_MAPPER',ALL_GOT_MAPPER);
		return (
			<div
				className="add-or-edit"
				style={{ display: `${addOrEdit ? "block" : "none"}` }}
			>
				<Modal
					width={MODAL_WIDTH}
					visible={!!addOrEdit}
					destroyOnClose={1}
					title={title+pTitle}
					onCancel={this.addOrEditOk}
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
						{getAddOrEditFormFromEntity(ENTITY, getFieldDecorator,addOrEdit,ALL_GOT_MAPPER)}
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
