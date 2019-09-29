import React from 'react';
import { Select,Card,Form,Button } from 'antd';
import PermissionListTable from './PermissionListTable';
import axios from 'axios';
import {selectPageUtils,selectButtonUtils, selectGroupUtils} from '../../../SelectUtils.jsx';
import '../../../style/table.less';
import {sysErrorInfo, handleQueryListOk} from '../../../Common.jsx';

const FormItem = Form.Item;
class PermissionList extends React.Component {

    state = {
        List: [],
    };

    queryPermissionList(str) {

        var thi = this;
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/permiapi/queryPermissionList',
            str
            ).then(function (response) {
                console.log("response",response);
                if(response.data.STATUS==='200'){
                    thi.setState({
                        List: response.data.List
					});
					handleQueryListOk(response.data.List);
                } else {
                    sysErrorInfo()
                }

        }).catch(function (error) {
            sysErrorInfo(error)
        });
    }


    handleFilterSubmit = ()=>{
        
        var jsonStr = {
			"pageCode": this.state.pageCode,
			"buttCode": this.state.buttCode,
			"groupId" : this.state.groupId,

        }
        console.log("---------json-------",jsonStr);
        this.queryPermissionList(jsonStr);
	}
	reset = ()=>{
        this.setState({
            pageCode:undefined,
			buttCode: undefined,
			groupId: undefined,
        });
    }
	
	handlePageCode = (value) => {
        this.setState({
            pageCode: value,
            buttCode: undefined
        });
    }

    handleButtCode = (value) => {
        this.setState({
            buttCode: value,
        });
    }

    handleGroupId = (value) => {
        this.setState({
			groupId: value,
		});
    }

    render() {
        return (
            <div className="gutter-example">
                <Card title="权限维护" bordered={false}>
				<Form layout="inline" className="ant-advanced-search-form" >
                        <FormItem label={'分组名称：'}>
							<Select value={this.state.groupId} onChange={this.handleGroupId} style={{ width: 180 }} >
								{selectGroupUtils()}
							</Select>
                        </FormItem>
                        <FormItem label={'页面名称：'}>
							<Select value={this.state.pageCode} onChange={this.handlePageCode} disabled={this.state.pageCodeFalg} style={{ width: 180 }} >
								{selectPageUtils()}
							</Select>
                        </FormItem>
						<FormItem label={'按钮名称：'}>
							<Select value={this.state.buttCode} onChange={this.handleButtCode} disabled={this.state.buttCodeFalg} style={{ width: 180 }} >
								{selectButtonUtils(this.state.pageCode)}
							</Select>
                        </FormItem>
                        <FormItem>
                        <Button type="primary" onClick={this.handleFilterSubmit}>查询</Button>
                        <Button onClick={this.reset}>重置</Button>
                        </FormItem>
                    </Form>
					<PermissionListTable List={this.state.List} parent={this} />
                </Card>
            </div>
        );
    }
}

export default PermissionList;