import React from 'react';
import { legalInfo } from "@/api";
import { Card,Button, Form } from 'antd';

import LegalnfoTable from "./LegalnfoTable";
import {checkIsNull} from '../../../Common.jsx';
const FormItem = Form.Item;
class LegalnfoList extends React.Component {

	state = {
        List: [],
	};
	
	componentWillMount() {
		this.handleFilterSubmit();
	}
	
	async queryList(data) {
		let result = await legalInfo.list(data)
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
		return legalInfo.list(data).catch(function(error) {})//防止异常
	}

	handleFilterSubmit = ()=>{
        console.log("---------this.state-------",this.state);
        var jsonStr = {}
        console.log("---------json-------",jsonStr);
        this.queryList(jsonStr);
	}

	render() {
		console.log("render----list", this.state.List);
		const { loading } = this.state;
		return (
			<div className="gutter-example">
				<Card title="核心企业主体信息" bordered={false}>
					 <Form layout="inline" className="ant-advanced-search-form" >
						<FormItem>
                        	<Button type="primary" onClick={this.handleFilterSubmit}>查询</Button>
                        </FormItem>
                    </Form>

					<LegalnfoTable
						List={this.state.List}
						parent={this}
						loading={loading}
					/>
				</Card>
			</div>
		);
	}
}

export default LegalnfoList;