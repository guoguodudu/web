import React from "react";
import { supInfo } from "@/api";
import {Button, Card, Form, Select} from "antd";
import SupInfoTable from "./SupInfoTable";
import {checkIsNull,initSupCodeAndShortName} from "../../../Common";
import {selectUtils} from '../../../SelectUtils.jsx';
const FormItem = Form.Item;

class SupInfoList extends React.Component {

	state = {
		List:[]
	}
	componentWillMount() {
		let supInfo = initSupCodeAndShortName();
		this.setState({
			supCodeList: supInfo.supCodeList,
			supShortNameList: supInfo.supShortNameList,
		});
		this.handleFilterSubmit();
	}

	async queryList(data) {
		let result = await supInfo.list(data)
			.catch(function(error) {})//防止异常
			.finally(() => {
				this.setState({ loading: false });
			});
		console.log("查询结果=",result);
		if(!checkIsNull(result) && result.length > 0){
			this.setState({ List: result });
		}else{
			this.setState({ List: [] });
		}
	}

	queryListForSupCode(data) {
		return supInfo.list(data).catch(function(error) {})//防止异常
	}

	handleSupCode = (value) => {
		this.setState({ supCode: value });
	}

	handleSupShortName = (value) => {
		this.setState({ supShortName: value });
	}

	handleSupStatus = (value) => {
		this.setState({ supStatus: value });
	}

	reset= () => {
		this.setState({
			supCode: undefined,
			supShortName: undefined,
			supStatus: undefined
		});
	}

	handleFilterSubmit = (value) => {
		let data = {
			supCode: this.state.supCode,
			supShortName: this.state.supShortName,
			supStatus: this.state.supStatus
		}
		this.queryList(data);
	}

	render() {
		console.log("render----list", this.state.List);
		const { loading } = this.state;
		return (
			<div className="gutter-example">
				<Card title="供应商列表" bordered={false}>
					<Form layout="inline" className="ant-advanced-search-form" >

						<FormItem label={'供应商代码：'}>
							<Select style={{ width: 120 }}
									onChange={this.handleSupCode}
									placeholder={"请选择"}
									value={this.state.supCode} >
								{this.state.supCodeList}
							</Select>
						</FormItem>

						<FormItem label={'供应商简称：'}>
							<Select style={{ width: 120 }}
									onChange={this.handleSupShortName}
									placeholder={"请选择"}
									value={this.state.supShortName} >
								{this.state.supShortNameList}
							</Select>
						</FormItem>

						<FormItem label={'供应商状态：'}>
							<Select style={{ width: 120 }}
									onChange={this.handleSupStatus}
									placeholder={"请选择"}
									value={this.state.supStatus} >
								{selectUtils('ruleStatus')}
							</Select>
						</FormItem>

						<FormItem>
							<Button type="primary" onClick={this.handleFilterSubmit}>查询</Button>
						</FormItem>

						<Button onClick={this.reset}>重置</Button>
					</Form>

					<SupInfoTable
						List={this.state.List}
						parent={this}
						loading={loading}
					/>
				</Card>
			</div>
		);
	}
}

export default SupInfoList;
