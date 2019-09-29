import React from 'react';
import { Form,Input } from 'antd';
import '../../../style/table.less';
import {sysErrorInfo} from '../../../Common.jsx';
import {supInfo,funderInfo} from "@/api";
import { SelectField } from "@/components/fields";
const FormItem = Form.Item;

class SupFunderCodeCondition extends React.Component {
    state = {

    };

    componentWillMount() {
        var pOrgType = this.props.parent.state.pOrgType;
        if(pOrgType==='CODE'){
            this.setState({
                codeVisible: '',
                conVisible: 'none',
            });
            this.initFunderCode();
            this.initSupCode();
        } else if(pOrgType==='CON'){
            this.setState({
                codeVisible: 'none',
                conVisible: '',
            });
            
        } else {
            this.setState({
                codeVisible: '',
                conVisible: '',
            });
            this.initFunderCode();
            this.initSupCode();
        }
    }

    componentDidMount(){
        this.props.onRef(this);
    }

    componentWillReceiveProps(nextProps) {
    }

    initFunderCode() {
        funderInfo.condition({
            orgType:"FUNDER"
        }).then((funderCodeList)=> {
            this.setState({
                funderCodeList
            });
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }

    initSupCode() {
        supInfo.condition({}).then( (supCodeList) =>{
            this.setState({
                supCodeList
            });
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }

    handleSupCode = (value) => {
        this.setState({
            supCode: value,
        });
    }


    handleFunderCode = (value) => {
        this.setState({
            funderCode: value,
        });

    }
    handleMainConCode = (e) => {
        this.setState({
            mainConCode: e.target.value,
        });

    }
    handleFunderConCode = (e) => {
        this.setState({
            funderConCode: e.target.value,
        });

    }
    reset = ()=>{
        this.setState({
            supCode: undefined,
            funderCode: undefined,
            funderConCode:undefined,
            mainConCode:undefined,
        });
        const {props:{form}} =this
        form.resetFields()
    }

    render() {
        const {
			props: {
				form: { getFieldDecorator }
            },
            state:{
                supCodeList,
                funderCodeList
            }
            
        } = this;
        return (
            <span>
                <span style={{display : this.state.codeVisible }} >
                <SelectField
					fieldDecoratorKey="supCode"
					getFieldDecorator={getFieldDecorator}
					inputWidth="160px"
					gotListOnChange={this.handleSupCode}
					placeholder="请选择"
					label="供应商："
					gotList={supCodeList}
					gotListL="supShortName"
					gotListV="supCode"
				/>
                <SelectField
					fieldDecoratorKey="funderCode"
					getFieldDecorator={getFieldDecorator}
					inputWidth="160px"
					gotListOnChange={this.handleFunderCode}
					placeholder="请选择"
					label="资金方："
					gotList={funderCodeList}
					gotListL="orgName"
					gotListV="orgCode"
				/>
                </span>
                <span style={{display : this.state.conVisible }} >
                
                <FormItem label={'业务合同编号：'}>
                    <Input style={{ width: 160 }} value={this.state.mainConCode} onChange={this.handleMainConCode} />
                </FormItem>
                <FormItem label={'资金合同编号：'}>
                    <Input style={{ width: 160 }} value={this.state.funderConCode} onChange={this.handleFunderConCode} />
                </FormItem>
                </span>
            </span>

        );
    }
}

const WarppedSupFunderCodeCondition = Form.create({ name: "SupFunderCodeCondition" })(SupFunderCodeCondition);


export default WarppedSupFunderCodeCondition ;