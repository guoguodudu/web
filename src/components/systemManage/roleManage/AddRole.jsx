import React from 'react';
import {selectUtils} from '../../../SelectUtils.jsx';
import { Modal,Button,Input,Row,Col,Select,Transfer } from 'antd';
import {successInfo,sysErrorInfo,errorInfo,checkNull } from '../../../Common.jsx';
import {selectList} from '../../../mapper.js';

import axios from 'axios';

class AddRole extends React.Component {

    state = {
        mockData: [],
        targetKeys: [],
    };

    componentWillMount() {
        console.log("------AddRole----componentWillMount---------------");
    }

    componentDidMount() {
        console.log("------AddRole----componentDidMount---------------");
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("------AddRole----componentWillReceiveProps---------------",nextProps);
        if(nextProps.visiable){
            this.setState({
                parent:nextProps.parent,
                visible:nextProps.visiable,
                //初始化页面状态
                roleName: '',
                orgType: undefined,
                depCode: undefined,
                mockData: [],
                targetKeys: [],
            });
        }
    }

    handleOk3 = () => {
        console.log("AddRole----submit----this.state--------------",this.state);
        if(checkNull(this.state.roleName,'角色名称')){
            return ;
        }
        if(checkNull(this.state.orgType,'机构类型')){
            return ;
        }
        if(checkNull(this.state.depCode,'部门')){
            return ;
        }

        var thi = this;
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/roleapi/add',{
            "roleName": this.state.roleName,
            "orgType": this.state.orgType,
            "depCode": this.state.depCode,
            "depName": selectList('department',this.state.depCode),
            "status": "ACTIVE",
            "createId": localStorage.getItem('userName'),
            "permIdList": this.state.targetKeys
        }).then(
            function (response) {
                console.log('200--',response)
                if(response.data.STATUS === "200"){
                    successInfo("路由规则新增成功");
                    thi.setState({ loading3: false, visible: false });
					thi.state.parent.state.parent.queryRoleList();
					thi.props.parent.setState({addRoleVisible:false})
                } else {
                    errorInfo("新增失败");
                }
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    };

    handleCancel3 = () => {
		this.setState({ visible: false });
		this.props.parent.setState({addRoleVisible:false});		
    };

    getMock = (value) => {
        const targetKeys = [];
        const mockData = [];
        var thi = this;
        var url ='';
        if(value==='FSERVICE'||value==='TSERVICE'){
            url = '/permiapi/queryPermissionList';
        } else {
            url = '/permiapi/queryPermBusiList';
        }

        axios.post(localStorage.getItem('IP_PORT_BACKEND')+url,
            {"status": "ACTIVE"}
            ).then(function (response) {
                console.log("response",response);
                if(response.data.STATUS==='200'){
                    var pList = response.data.List;

                    for (let i = 0; i < pList.length; i++) {
                    const pData = {
                        key: pList[i].permId,
                        title: pList[i].permName,
                    };

                    mockData.push(pData);

                    }
                    thi.setState({ mockData, targetKeys });
                } else {
                    errorInfo("权限信息查询失败")
                }
            }).catch(function (error) {
                sysErrorInfo(error)
            });
    }


    filterOption = (inputValue, option) => option.title.indexOf(inputValue) > -1

    handleChange = (targetKeys) => {
        console.log('targetKeys',targetKeys);
        this.setState({ targetKeys });
    }

    handleRoleName = (e) => {
        this.setState({ roleName: e.target.value });
    }

    handleSearch = (dir, value) => {
        console.log('search:', dir, value);
    };

    handleOrgType = (value) => {
        this.setState({
            orgType: value,
        });
        // eslint-disable-next-line
        this.getMock(value);
    }

    handleDepCode = (value) => {
        this.setState({
            depCode: value,
		});
    }

    render() {
        return (
            <div className="gutter-example">
                <Modal
                width="730px"
                visible={this.state.visible}
                title="新增角色"
                onOk={this.handleOk3}
                onCancel={this.handleCancel3}
                footer={[
                    <Button key="back" size="large" onClick={this.handleCancel3}>取消</Button>,
                    <Button key="submit" type="primary" size="large" loading={this.state.loading3} onClick={this.handleOk3}>
                        提交
                    </Button>,
                ]}
                >
                    <Row>
                        <Col span={11}>
                            <Row>
                                <Col span={8}>角色名称： </Col>
                                <Col span={16}><Input style={{ width: '200px' }} size="default" value={this.state.roleName} onChange={this.handleRoleName} /></Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>机构类型： </Col>
                                <Col span={16}>
                                    <Select style={{ width: '200px' }} onChange={this.handleOrgType} value={this.state.orgType} >
                                        {selectUtils('serviceOrgType')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>部门： </Col>
                                <Col span={16}>
                                    <Select style={{ width: '200px' }} onChange={this.handleDepCode} value={this.state.depCode} >
                                        {selectUtils('department')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                        </Col>
                    </Row>
                    <hr />
                    <br />
                    <Row>
                    <Col span={1} />
                    <Col span={23}>
                        <Transfer
                            listStyle={{
                                width: 290,
                                height: 290,
                            }}
                            titles={['未选择权限','已选择权限']}
                            dataSource={this.state.mockData}
                            showSearch
                            filterOption={this.filterOption}
                            targetKeys={this.state.targetKeys}
                            onChange={this.handleChange}
                            onSearch={this.handleSearch}
                            render={item => item.title}
                        />
                    </Col>

                    </Row>
                </Modal>
            </div>
        );
    }
}

export default AddRole;