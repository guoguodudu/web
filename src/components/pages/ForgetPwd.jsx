/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Form, Icon, Input, Button, Row ,Col,
	message} from 'antd';
import axios from 'axios';
import {sysErrorInfo,errorInfo, ContentSuccInfo} from '../../Common.jsx';
import { connectAlita } from 'redux-alita';

const FormItem = Form.Item;

class ForgetPwd extends React.Component {
    componentWillMount() {
	}
	componentDidMount(){
	}
    componentWillReceiveProps(nextProps) {
    }
    handleSubmit = (e) => {
		const thi = this
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
				axios.defaults.withCredentials = true;
				const hide = message.loading('请稍等', 0);
				
                axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/shiroapi/forgetPwd',{
                    "userName": values.userName,
                    "kaptchaCode": values.kaptchaCode,
                }).then(
                    function (response) {
                        console.log('200--',response)
                        if(response.data.STATUS === 200){
							ContentSuccInfo(response.data.CONTENT);
                            const { history } = thi.props 
							history.push('/login')
							
                            // window.location.href=localStorage.getItem('ip_port_frontend')+'/';
                        }else{
                            errorInfo(response.data.CONTENT);
                        }

                }).catch(function (error) {
                    sysErrorInfo(error);
                }).finally(()=>{
					hide()
				});
            }
        });
    };

    chageCode = (e) => {
        console.log(e.target)
        e.target.src=localStorage.getItem('IP_PORT_BACKEND')+"/kaptcha/kaptcha.jpg";
        console.log('localStorage', localStorage)
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <div className="login-form" >
                    <div className="login-logo">
                        <span>富金服科技股份有限公司</span>
                    </div>
                    <center style={{ fontSize: 16 }}><b>消金系统</b></center>
                    <br />
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
                            )}
                        </FormItem>
                        <FormItem >
                            <Row>
                                <Col span={14}>
                                {getFieldDecorator('kaptchaCode', {
                                    rules: [{ required: true, message: '请输入验证码!' }],
                                })(
                                    <Input style={{height: "32px"}} prefix={<Icon type="minus-square-o" style={{ fontSize: 13 }} />} placeholder="验证码" />
                                )}
                                </Col>
                                <Col span={1} />
                                <Col span={9}>
                                <img type="image" style={{ height: "32px"}} src={localStorage.getItem('IP_PORT_BACKEND')+"/kaptcha/kaptcha.jpg"} alt="验证码" onClick={this.chageCode} title="图片看不清？点击重新得到验证码" />
                                </Col>
                            </Row>
                        </FormItem>

                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                修改密码
                            </Button>
                            或 <a href={localStorage.getItem('IP_PORT_FRONTEND')+"/#/login"}>登录!</a>

                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default connectAlita(['auth'])(Form.create()(ForgetPwd));