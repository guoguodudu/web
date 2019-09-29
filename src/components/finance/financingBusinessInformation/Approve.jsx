import React from "react";
import { Modal, Button, Row, Col, Input } from "antd";
import { financeApl } from "@/api";
import { successInfo, checkNull,renderTooltipText } from "@/Common";
import { ENTITY } from "./conf";
import { selectList } from "../../../mapper";
import { MODAL_SPAN_N,MODAL_WIDTH } from "@/constants";
class Approve extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
		this.canAjax = true;		
	}
	
	componentDidMount(){
		
	}

	approveAgreeOrBack(record,type,level){
		if(checkNull(this.state.auditNote, "审批意见")){
			return;
		}
		var status='';
		var buttonName='';
		if(type==='agree'){
			if(level==='one'){
				status='APRY';
				buttonName='一级审核同意';
			}else if(level==='two'){
				status='APSY';
				buttonName='二级审核同意';
			}else {
				return;
			}
		}else if(type==='back'){
			if(level==='one'){
				status='APRN';
				buttonName='一级审核退回';
			}else if(level==='two'){
				status='APSN';
				buttonName='二级审核退回';
			}else {
				return;
			}
		}else {
			return;
		}
		if (this.canAjax) {
			this.canAjax = false;
			
		} else {
			return false;
		}
		financeApl.approve({
			id:record.id,
			sourceStatus:record.status,
			status:status,
			auditNote:this.state.auditNote,
			pageName:'融资业务信息页面',
			buttonName:buttonName
			}).then(res => {
				successInfo("操作成功");
				
			}).catch(e => {})
			.finally(() => {
				this.canAjax = true;
				this.props.parent.setState({approveVisible:false})
				this.props.parent.query(this.props.parent.state.queryArgsCache);
			});
	}
	handleCancel() {
		this.props.parent.setState({approveVisible:false})
	}

	//描述
    handleAuditNote = (e) => {
		this.setState({ auditNote: e.target.value});
	}
	
	render() {
		const {
			props:{visible,record,entity_keys,level}
		} = this;
		const r = record
		return (
			
				<Modal
					width={MODAL_WIDTH}
					visible={visible}
					destroyOnClose={1}
					title={"审批操作"}
					footer={[
						
						<Button
							key="cancel"
							type="primary"
							size="large"
							onClick={()=>this.handleCancel()}
						>
							取消
						</Button>
					]}
				>
				<div className="double-modal">
					<Row>
						{entity_keys.map((k, i) => {
							const rK = r[k];
							const {nRead,name,mapper} = ENTITY[k]
							if (
								r.hasOwnProperty(k) &&
								rK &&
								nRead === false
							) {
								return (

									<Col span={MODAL_SPAN_N} key={i} className="mb-10 flex-cen-bet">
										<span
											style={{
												width: "110px",
												display: "inline-block",
											}}
										>
											{name}: &nbsp;{" "}
										</span>
										<span className="blue">
											{mapper?selectList(mapper,rK):renderTooltipText(rK, 20)}
										</span>
									</Col>
								);
							} else {
								return null;
							}
						})}
					</Row>
					<Row justify="center" type="flex" gutter={24}>
						<Col span={4}>
							<Input.TextArea placeholder="审批意见" style={{width:250 }} onChange={this.handleAuditNote} value={this.state.auditNote} rows="6" />
						</Col>
						<Col span={2}>
							<br />
							<Button
								key="agree"
								size="large"
								type="primary"
								onClick={()=>this.approveAgreeOrBack(record,'agree',level)}
							>
								同意
							</Button>
							<br /> <br />
							<Button
								key="back"
								size="large"
								type="primary"
								onClick={()=>this.approveAgreeOrBack(record,'back',level)}
								>
								退回
							</Button>
						</Col>
						
					</Row>
				</div>	
				</Modal>
			
		);
	}
}
export default Approve;
