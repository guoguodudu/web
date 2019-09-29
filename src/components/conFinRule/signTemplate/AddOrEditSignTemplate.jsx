import React from 'react';
import { Modal,Button,Input,Row,Col,Select, InputNumber,Form} from 'antd';
import {selectUtils} from '../../../SelectUtils.jsx';
import {warningInfo,successInfo,messageError} from '../../../Common.jsx';
import {
	PLEASE_UPLOAD_ONE_FILE
} from "@/constants";
import { selectList } from '../../../mapper.js';
import { UploadFile } from "@/components/fields";
import { signTemplate } from '../../../api/index.js';

//const dateFormat = 'YYYY-MM-DD HH:mm:ss';

class AddOrEditSignTemplate extends React.Component {

    componentWillMount() {
        this.setState({
            loading3: false,
            visible3: false,
            addSignTemplateVisiable:false,
            editSignTemplateVisiable:false,
            copySignTemplateVisiable:false,
            readSignTemplateVisiable:false,
        })
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        if(nextProps.addSignTemplateVisiable){//新增显示
            this.setState({
                record:undefined,
                showtype:"add",
                visible3: nextProps.addSignTemplateVisiable,
                visibleadd: nextProps.addSignTemplateVisiable,
                RowVisoble:false, //字段显示
                parent:nextProps.parent,

                id:undefined,
                tempId:undefined,
                tempName:undefined,
                tempKind:undefined,
                tempPath:undefined,
                dpFalg:undefined,
                insTerm:undefined,
                fserviceSign:undefined,
                fileType:undefined,

                fserviceSignKey:undefined,
                debtorSignKey:undefined,
                funderSignKey:undefined,
                parmNum:undefined,
                remarks:undefined,
                status:"DRAFT",
                type:'新增签章模板',

            });

        } else if(nextProps.editSignTemplateVisiable){//修改显示

            this.setState({
                record:nextProps.record,
                showtype:"edit",
                visible3: nextProps.editSignTemplateVisiable,
                visibleadd:false, //编辑时不显示上传文件按钮
                parent:nextProps.parent,
                RowVisoble:true, //字段显示
                id:nextProps.record.id,
                tempId:nextProps.record.tempId,
                tempName:nextProps.record.tempName,
                tempKind:nextProps.record.tempKind,
                tempPath:nextProps.record.tempPath,
                dpFalg:nextProps.record.dpFalg,
                insTerm:nextProps.record.insTerm,
                fserviceSign:nextProps.record.fserviceSign,
                fileType:nextProps.record.fileType,

                fserviceSignKey:nextProps.record.fserviceSignKey,
                debtorSignKey:nextProps.record.debtorSignKey,
                funderSignKey:nextProps.record.funderSignKey,
                parmNum:nextProps.record.parmNum,
                remarks:nextProps.record.remarks,
                status:nextProps.record.status,
                type:'编辑签章模板',
                checkConSn1: true,
                checkConSn2: false
            });
        } else if(nextProps.copySignTemplateVisiable){//复制显示
            this.setState({
                record:nextProps.record,
                showtype:"copy",
                visible3: nextProps.copySignTemplateVisiable,
                RowVisoble:false, //字段显示
                visibleadd:true,
                parent:nextProps.parent,
                id:undefined,
                oldtempId:nextProps.record.tempId, //旧的模板id
                oldparmNum:nextProps.record.parmNum, //旧的参数个数
                tempId:nextProps.record.tempId,
                tempName:nextProps.record.tempName,
                tempKind:nextProps.record.tempKind,
                tempPath:undefined, //复制时地址没有
                dpFalg:nextProps.record.dpFalg,
                insTerm:nextProps.record.insTerm,
                fserviceSign:nextProps.record.fserviceSign,
                fileType:nextProps.record.fileType,

                fserviceSignKey:nextProps.record.fserviceSignKey,
                debtorSignKey:nextProps.record.debtorSignKey,
                funderSignKey:nextProps.record.funderSignKey,
                parmNum:nextProps.record.parmNum,
                remarks:nextProps.record.remarks,
                status:nextProps.record.status,

                orgConSnFalg:false,
                type:'复制签章模板',
                checkConSn1: true,
                checkConSn2: false
            });

        }
        console.log("this.state",this.state);
    }

    //签章服务 传送模板
    sendToSign =(type) => {
        var thi = this;
        const {props:{form}} = this
        const gotUploadFile = form.getFieldValue("file")
        console.log("gotUploadFile",gotUploadFile)
        if(gotUploadFile){
            const postForm = new FormData()			
			
            postForm.append("file",gotUploadFile[0])
            postForm.append("oldtempId",type === "add" ? undefined : this.state.record.tempId)
            postForm.append("oldparmNum",type === "add" ? undefined : this.state.record.parmNum)
            postForm.append("olddpFalg",type === "add" ? undefined : this.state.record.dpFalg)
            postForm.append("oldinsTerm",type === "add" ? undefined : this.state.record.insTerm)
			
            postForm.append("tempId",this.state.tempId)
            postForm.append("tempName",this.state.tempName)
            postForm.append("tempKind",this.state.tempKind)
            postForm.append("dpFalg",this.state.dpFalg)
            postForm.append("insTerm",this.state.insTerm)
            postForm.append("fserviceSign",this.state.fserviceSign)
            postForm.append("fileType",this.state.fileType)
            postForm.append("fserviceSignKey",this.state.fserviceSignKey)
            postForm.append("debtorSignKey",this.state.debtorSignKey)
            postForm.append("parmNum",this.state.parmNum)
            postForm.append("status",this.state.status)
            postForm.append("remarks",this.state.remarks)
            postForm.append("actionType",type)
		
			signTemplate.fileFddSubmit(postForm).then(res=>{
				successInfo("提交成功");
				thi.handleCancel3();
			}).catch(e=>{
				messageError();
			})
        }else{
            return false
        }
        
    }

    //只新增修改不做 不做签章请求
    addTemplate = (type) => {
        var thi = this;
        const {props:{form}} = this
        const gotUploadFile = form.getFieldValue("file")
        console.log("gotUploadFile",gotUploadFile)
        if(gotUploadFile){
            const postForm = new FormData()			
			postForm.append("oldtempId",type === "add" ? undefined : this.state.record.tempId)
            postForm.append("oldparmNum",type === "add" ? undefined : this.state.record.parmNum)
            postForm.append("olddpFalg",type === "add" ? undefined : this.state.record.dpFalg)
            postForm.append("oldinsTerm",type === "add" ? undefined : this.state.record.insTerm)
			
			postForm.append("file",gotUploadFile[0])
            postForm.append("tempId",this.state.tempId)
            postForm.append("tempName",this.state.tempName)
            postForm.append("tempKind",this.state.tempKind)
            postForm.append("dpFalg",this.state.dpFalg)
            postForm.append("insTerm",this.state.insTerm)
            postForm.append("fserviceSign",this.state.fserviceSign)
            postForm.append("fileType",this.state.fileType)
            postForm.append("fserviceSignKey",this.state.fserviceSignKey)
            postForm.append("debtorSignKey",this.state.debtorSignKey)
            postForm.append("parmNum",this.state.parmNum)
            postForm.append("status",this.state.status)
            postForm.append("remarks",this.state.remarks)
            postForm.append("actionType",type)
			
			signTemplate.fileSubmit(postForm).then(res=>{
				successInfo("提交成功");
				thi.handleCancel3();
			}).catch(e=>{
				messageError();
			})
        }else{
            return false
        }
    }

    //只新增修改不做 不做签章请求
    editTemplate = () => {
        var thi = this;
        var jsonStr = {
            "id":this.state.id,
            "tempId":this.state.tempId,
            "tempName":this.state.tempName,
            "tempKind":this.state.tempKind,
            "tempPath":this.state.tempPath,
            "dpFalg":this.state.dpFalg,
            "insTerm":this.state.insTerm,
            "fserviceSign":this.state.fserviceSign,
            "fileType": this.state.fileType,
            "fserviceSignKey": this.state.fserviceSignKey,
            "debtorSignKey": this.state.debtorSignKey,
            "funderSignKey":this.state.funderSignKey,
            "parmNum":this.state.parmNum,
            "status":this.state.status,
            "remarks":this.state.remarks,
        };
        signTemplate.fileSubmit(jsonStr).then(
            function (response) {
                successInfo("修改成功");
				thi.handleCancel3();
			}).catch(e=>{
				messageError();
			})
    }

    handleOk = () => {
        //复制时 检查模板id 是否有改变
        if (this.state.showtype === 'copy') {
            if(this.state.record.tempId === this.state.tempId) {
                warningInfo("模板ID是唯一值,请修改后提交！");
                return;
            }
        }

        if(this.state.tempId === undefined ){
            warningInfo("模板ID不能为空！");
            return;
        }

        if(this.state.fileType === undefined ){
            warningInfo("请选择文件类型！");
            return;
        }

        if(this.state.dpFalg === undefined ){
            warningInfo("请选择是否含还款计划！");
            return;
        }

        if(this.state.fserviceSign === undefined ){
            warningInfo("请选择金融服务商是否签署！");
            return;
        } else if (this.state.fserviceSign === 'Y') {
            if (this.state.fserviceSignKey === undefined) {
                warningInfo("金融服务商需签署时，请设定金融服务商签章关键字！");
                return;
            }
        }

        //如果是签章模板 必须设定付款人签章关键字 & 资金方签章关键字
        if (this.state.tempKind ==='FDD') {
            if(this.state.debtorSignKey === undefined || this.state.funderSignKey === undefined) {
                warningInfo("模板类型是签章模板时，请设定付款人签署关键字和资金方签署关键字！");
                return;
            }
        }

        if(this.state.dpFalg === 'Y' ){
            if (this.state.insTerm <= 0) {
                warningInfo("含还款计划时, 期数必须大于0！");
                return;
            }
        } else {
            if (this.state.insTerm !== 0) {
                warningInfo("不含还款计划时, 期数必须是0！");
                return;
            }
        }

        //如果是新增和复制 则需要判断是否走 第三方
        if(this.state.showtype === "copy" || this.state.showtype === "add") {
            //如果是签章使用 先请求第三方成功后新增
            if (this.state.tempKind ==='FDD') {
                this.setState({ status: "ACTIVE",}); //如果要请求第三方 状态要用active 否则是草稿状态
                this.sendToSign(this.state.showtype);
            } else {
                //如果是PDF使用 只新增
                this.addTemplate(this.state.showtype);
            }

        } else {
            if (this.state.tempKind ==='FDD') {
                warningInfo("法大大签章合同, 不允许修改！");
            }else {
                //修改制作参数的修改 不做模板传送
                this.editTemplate("edit");
            }
            
        }
    };

    handleCancel3 = () => {
        this.setState({
            visible3: false,
            addSignTemplateVisiable:false,
            editSignTemplateVisiable:false,
            copySignTemplateVisiable:false,
            readSignTemplateVisiable:false,
		});
		this.props.parent.hideAllModal();
    };

    //文件类型
    handleFileType = (value) => {

        this.setState({
            fileType :value,
            fileTypeName:selectList('signfileType',value),
        });
    }

    //模板ID
    handleTempId = (e) => {
        this.setState({ tempId: e.target.value });
    }

    //模板使用类型
    handletempKind = (value) => {
        this.setState({ tempKind: value });
    }

    //是否含还款计划
    handledpFalg = (value) => {
        this.setState({ dpFalg: value });
    }

    //还款计划期数
    handleinsTerm = (value) => {
        this.setState({insTerm :value});
    }

    //金融服务商是否签署
    handlefserviceSign= (value) => {
        this.setState({ fserviceSign: value });
    }

    //金融服务商签章关键字
    handlefserviceSignKey= (e) => {
        this.setState({ fserviceSignKey: e.target.value });
    }

    //付款人签章关键字
    handledebtorSignKey= (e) => {
        this.setState({ debtorSignKey: e.target.value });
    }

    //资金方签章关键字
    handlefunderSignKey= (e) => {
        this.setState({ funderSignKey: e.target.value });
    }

    //描述
    handleDescription = (e) => {
        this.setState({ remarks: e.target.value});
    }
    //参数个数
    handleparmNum = (value) => {
        this.setState({ parmNum: value});
    }

    render() {
        const {props:{ form:{
            getFieldDecorator
        }}} = this
        return (
            <div className="gutter-example">
                        <Modal
                        width={'800px'}
                        visible={this.state.visible3}
						destroyOnClose={1}
                        title={this.state.type}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel3}
                        footer={[
                            <Button key="back" size="large" onClick={this.handleCancel3}>取消</Button>,
                            <Button key="submit" type="primary" size="large" loading={this.state.loading3} onClick={this.handleOk}>
                                提交
                            </Button>,
                        ]}
                        >
                    <Row >
                        <Col span={1} />
                        <Row>
                            <Col span={16}>
                            <Form.Item label="文 件" className="mt-10">
							{getFieldDecorator("file", {
								rules: [
									{
										required: true,
										message: PLEASE_UPLOAD_ONE_FILE
									}
								]
							})(<UploadFile parent={this} formField="file" />)}
						</Form.Item>
                            </Col>
                        </Row>
                    </Row>

                    <Row>
                        <Col span={1} />
                        <Col span={10}>

                            <br />
                            <Row>
                                <Col span={8} style={{ color: 'red' }} >模板ID： </Col>
                                <Col span={16}>
                                <Input style={{ width: 150 }} value={this.state.tempId} onChange={this.handleTempId} disabled={this.state.showtype==="edit" ? true : false } />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8} >模板使用类型： </Col>
                                <Col span={16}>
                                    <Select value={this.state.tempKind} style={{ width: 150 }} onChange={this.handletempKind} disabled={this.state.showtype==="edit" ? true : false } >
                                        {selectUtils('tempKind')}
                                    </Select>
                                </Col>
                            </Row>
                            {/* <br />
                            <Row>
                                <Col span={8} >模板名称： </Col>
                                <Col span={16}>
                                <Input style={{ width: 150 }} value={this.state.tempName} disabled={this.state.showtype==="edit" ? true : false } />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8} >模板存放地址： </Col>
                                <Input style={{ width: 150 }} value={this.state.tempPath} disabled={this.state.showtype==="edit" ? true : false } />
                            </Row> */}
                            <br />
                            <Row>
                                <Col span={8} >文件类型： </Col>
                                <Col span={16}>
                                    <Select value={this.state.fileType} style={{ width: 150 }} onChange={this.handleFileType} >
                                        {selectUtils('signfileType')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8} >是否含还款计划： </Col>
                                <Col span={16}>
                                    <Select value={this.state.dpFalg} style={{ width: 150 }} onChange={this.handledpFalg} disabled={this.state.showtype==="copy" ? true : false }>
                                        {selectUtils('ActiveStatus')}
                                    </Select>
                                </Col>
                            </Row>

                            <br />
                            <Row>
                                <Col span={8} >还款计划期数： </Col>
                                <Col span={16}>
                                    <InputNumber style={{ width: 150 }} value={this.state.insTerm} onChange={this.handleinsTerm} disabled={this.state.showtype==="copy" ? true : false } />
                                </Col>
                            </Row>

                            <br />
                            <Row>
                                <Col span={8} >参数个数： </Col>
                                <Col span={16}>
                                    <InputNumber style={{ width: 150 }} value={this.state.parmNum} onChange={this.handleparmNum} disabled={this.state.showtype==="copy" ? true : false } />
                                </Col>
                            </Row>

                        </Col>
                        <Col span={1} />
                        <Col span={10} >
                        <br />
                        <Row>
                                <Col span={8} >金融服务商是否签署： </Col>
                                <Col span={16}>
                                <Select value={this.state.fserviceSign} style={{ width: 150 }} onChange={this.handlefserviceSign} >
                                        {selectUtils('ActiveStatus')}
                                    </Select>
                                </Col>
                            </Row>

                            <br />
                            <Row>
                                <Col span={8} >金融服务商签章关键字： </Col>
                                <Col span={16}>
                                <Input style={{ width: 150 }} value={this.state.fserviceSignKey} onChange={this.handlefserviceSignKey} />
                                </Col>
                            </Row>

                            <br />
                            <Row>
                                <Col span={8} >付款人签章关键字： </Col>
                                <Col span={16}>
                                <Input style={{ width: 150 }} value={this.state.debtorSignKey} onChange={this.handledebtorSignKey} />
                                </Col>
                            </Row>

                            <br />
                            <Row>
                                <Col span={8} >资金方签章关键字： </Col>
                                <Col span={16}>
                                <Input style={{ width: 150 }} value={this.state.funderSignKey} onChange={this.handlefunderSignKey} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                 <Col span={8}>描述： </Col><Col span={16}>
                                    <Input.TextArea style={{width:150 }} onChange={this.handleDescription} value={this.state.remarks} rows="6" />
                                 </Col>
                            </Row>
                        </Col>

                    </Row>
                    </Modal>
            </div>
        );
    }
}

const WarpedAddOrEditSignTemplate = Form.create({ name: "AddOrEditSignTemplate" })(AddOrEditSignTemplate);

export default WarpedAddOrEditSignTemplate;