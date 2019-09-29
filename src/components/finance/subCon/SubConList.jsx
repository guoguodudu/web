import React from 'react';
import { supCon } from "@/api";
import { Card, Button, Form,Select } from 'antd';
import SubConTable from "./SubConTable";
import {checkIsNull,initLegalInfo,initSupCode } from '../../../Common.jsx';
const FormItem = Form.Item;
class SubConList extends React.Component {

	state = {
        List: [],
	};
	
	componentWillMount() {
        let legalInfo = initLegalInfo ();
        let supInfo = initSupCode();

		this.setState({
			legalCodeList: legalInfo,
			subCodeList: supInfo,
		});
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            legalCode:'请选择',
            supCode:'请选择',
        });
    }

    async queryList(data) {
		let result = await supCon.list(data)
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

	handleFilterSubmit = ()=>{
        console.log("---------this.state-------",this.state);
        var jsonStr = {
            "legalCode" : this.state.legalCode==='请选择'? undefined : this.state.legalCode,
            "supCode" : this.state.supCode==='请选择'? undefined : this.state.supCode,
        }
        console.log("---------json-------",jsonStr);
        this.queryList(jsonStr);
    }

    reset= () => {
		this.setState({
			legalCode:'请选择',
            supCode:'请选择',
		});
	}

    handleLegalCode = (value) => {
        this.setState({legalCode: value});
    }

    handleSubCode = (value) => {
        this.setState({supCode: value});
    }

	render() {
        console.log("render----list", this.state.List);
        console.log("this.state.legalCodeList ." , this.state.legalCodeList)
		const { loading } = this.state;
		return (
			<div className="gutter-example">
				<Card title="供应合同表" bordered={false}>
					<Form layout="inline" className="ant-advanced-search-form" >
                        <FormItem label={'主体法人单位简称：'}>
                            <Select style={{ width: 120 }} onChange={this.handleLegalCode} value={this.state.legalCode} >
                                {this.state.legalCodeList}
                            </Select>
                        </FormItem>

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

					<SubConTable
						List={this.state.List}
						parent={this}
						loading={loading}
					/>
				</Card>
			</div>
		);
	}
}

export default SubConList;