import React from 'react';
import { Card } from 'antd';
import RoleListTable from './RoleListTable';
import axios from 'axios';
import {sysErrorInfo,errorInfo } from '../../../Common.jsx';


class RoleList extends React.Component {

    state = {
        List: [],
    };

    componentWillMount() {

        this.queryRoleList()

    }

    queryRoleList() {
        var thi = this;
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/roleapi/query',{

        }).then(function (response) {
            if(response.data.STATUS === "200"){
                thi.setState({
                    List: response.data.List
                });
            } else {
                errorInfo("查询失败")
			}
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }
    render() {
        console.log("render----list",this.state.List);
        return (
            <div className="gutter-example">
                <Card title="角色列表" bordered={false}>
                    <RoleListTable List={this.state.List} parent={this} />
                </Card>
            </div>
        );
    }
}

export default RoleList;