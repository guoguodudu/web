import React from 'react';
import { supInfo,repayAccountLog } from "@/api";
import { Card, Button, Form,Select } from 'antd';

import RepayAccountLogTable from "./RepayAccountLogTable";
import {initSupCode,checkIsNull} from '../../../Common.jsx';
const FormItem = Form.Item;
class RepayAccountLogList extends React.Component {

	state = {
        List: [],
	};
	
	componentWillMount() {
        let supInfo = initSupCode();
		this.setState({
			subCodeList: supInfo,
		});
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            supCode:'请选择',
        });
    }

    async queryList(data) {
		let result = await repayAccountLog.list(data)
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

    // 供应商简称   查询表 SUPPLIER_INFO
    async initSubCode(data) {
        let result = await supInfo.list(data)
            .catch(function(error) {})//防止异常
            .finally(() => {
                this.setState({ loading: false });
            });
        console.log("initSubCode查询结果=",result);
        if(!checkIsNull(result) && result.length > 0){
            this.setState({ List: result });
        }else{
            this.setState({ List: [] });
        }
    }

	handleFilterSubmit = ()=>{
        console.log("---------this.state-------",this.state);
        var jsonStr = {
            "supCode" : this.state.supCode==='请选择'? undefined : this.state.supCode,
        }
        console.log("---------json-------",jsonStr);
        this.queryList(jsonStr);
    }

    reset= () => {
		this.setState({
			supCode:'请选择',
		});
	}

    handleSubCode = (value) => {
        this.setState({supCode: value});
    }

	render() {
		console.log("render----list", this.state.List);
		const { loading } = this.state;
		return (
			<div className="gutter-example">
				<Card title="融资业务回款账户" bordered={false}>
					<Form layout="inline" className="ant-advanced-search-form" >

                        <FormItem label={'供应商简称：'}>
                            <Select style={{ width: 120 }} onChange={this.handleSubCode} value={this.state.supCode} >
                                {this.state.subCodeList}
                            </Select>
                        </FormItem>

						<FormItem>
                        	<Button type="primary" onClick={this.handleFilterSubmit}>查询</Button>
                        </FormItem>

                        <FormItem>
                            <Button onClick={this.reset}>重置</Button>
                        </FormItem>
                    </Form>

					<RepayAccountLogTable
						List={this.state.List}
						parent={this}
						loading={loading}
					/>
				</Card>
			</div>
		);
	}
}

export default RepayAccountLogList;