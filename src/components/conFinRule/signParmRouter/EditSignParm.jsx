import React from 'react';
import { Modal,Button,Input,Row,Col ,Select} from 'antd';
import {selectUtils} from '../../../SelectUtils.jsx';
import {selectList} from '../../../mapper';
import {checkNull, successInfo, sysErrorInfo } from '../../../Common.jsx';
import {signParm} from "@/api";

class EditSignParm extends React.Component {

    state = {
        visible: false,
    };


    componentWillMount() {
        console.log("------EditSignParm---18---componentWillMount---------------");
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("------EditSignParm---22--nextProps--componentWillReceiveProps---------------",nextProps);

        if(nextProps.visiable){
            console.log("*****")
            //初始化时候只往Select里面加Option,不用关注层级关系

            this.setState({
                parent:nextProps.parent,
                visible:nextProps.visiable,
                tempId: nextProps.record.tempId,
                parmKey: nextProps.record.parmKey,
                parmValue: nextProps.record.parmValue,
                parmRemarks: nextProps.record.parmRemarks,

                id: nextProps.record.id
            });
            console.log("******this.setState****",this.state)
        }
    }

    handleOk = () => {

        var remark = selectList('ParmType',this.state.parmValue);

        if(checkNull(this.state.tempId,'模板ID')){
            return;
        }
        if(checkNull(this.state.parmKey,'参数KEY')){
            return;
        }

        if(checkNull(this.state.parmValue,'参数值字段')){
            return;
        }

        if(checkNull(remark,'参数值字段说明')){
            return;
        }

        var thi = this;
        console.log("this.state.parmRemarks *** ： " ,this.state.parmRemarks);
        signParm.update({
            "tempId": this.state.tempId,
            "parmKey": this.state.parmKey,
            "parmValue": this.state.parmValue,
            "parmRemarks": remark,
            "id": this.state.id
        }).then(function (response) {
            console.log('response-2',response)
            if(response.data.result === 1){
             
                successInfo("修改成功");
				thi.setState({ visible: false });
				thi.props.hideAllModal()
                thi.state.parent.state.parent.handleFilterSubmit();
            }
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }

    handleCancel = () => {
		this.setState({ visible: false });
		this.props.hideAllModal()
    };

    handleParmValue = (value) => {

		this.setState({
			parmValue: value,
			parmRemarks: value, 
		});
    }

    render() {
        return (
            <div className="gutter-example">
                        <Modal
                        width={'500px'}
                        visible={this.state.visible}
                        title="编辑签章模板参数值"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}

                        footer={[
                            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                                提交
                            </Button>,
                        ]}
                        >
                    <Row>
                        <Col span={24}>
                        <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>* 模板ID： </Col>
                                <Col span={16}>
                                    <Input id="tempId" style={{width:'180px'}} size="default" value={this.state.tempId} disabled />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>* 参数KEY： </Col>
                                <Col span={16}>
                                    <Input id="parmKey" style={{width:'180px'}} value={this.state.parmKey} disabled />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>参数值字段： </Col>
                                <Col span={16}>
                                    <Select value={this.state.parmValue} onChange={this.handleParmValue} style={{ width: '160px' }} >
                                        {selectUtils('ParmType')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>参数值字段说明： </Col>
                                <Col span={16}>
                                    <Select value={this.state.parmRemarks} style={{ width: '160px' }} disabled >
                                        {selectUtils('ParmType')}
                                    </Select>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    </Modal>
            </div>
        );
    }
}

export default EditSignParm;