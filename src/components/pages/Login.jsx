/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Form, Icon, Input, Button, Row ,Col} from 'antd';
import axios from 'axios';
import {sysErrorInfo,errorInfo,checkButtList} from '../../Common.jsx';
import { connectAlita } from 'redux-alita';
import {IP_PORT_BACKEND} from "@/api/path"
import ipConfig from '../../ip_config';
const FormItem = Form.Item;

class Login extends React.Component {
    componentWillMount() {
        // const { receiveData } = this.props;
        // receiveData(null, 'auth');

        ipConfig.ips.forEach( (item) => {
            localStorage.setItem(item['key'], item['value']);
		});
    }
    componentWillReceiveProps(nextProps) {

    //     console.log('componentWillReceiveProps start');
    //     const { auth: nextAuth = {} } = nextProps;
    //     const { router } = this.props;
    //     if (nextAuth.data && nextAuth.data.uid) {   // 判断是否登陆
    //         localStorage.setItem('user', JSON.stringify(nextAuth.data));
    //         router.push('/');
    //     }
    }
    handleSubmit = (e) => {
		const thi = this
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                //const { fetchData } = this.props;
                // if (values.userName === 'admin' && values.password === 'admin') fetchData({funcName: 'admin', stateName: 'auth'});
                // if (values.userName === 'guest' && values.password === 'guest') fetchData({funcName: 'guest', stateName: 'auth'});

                axios.defaults.withCredentials = true;
                console.log(localStorage.getItem('IP_PORT_BACKEND'));
                axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/shiroapi/login_check',{
                    "userName": values.userName,
                    "password": values.password,
                    "kaptchaCode": values.kaptchaCode,
                }).then(
                    function (response) {
                        console.log('200--',response)
                        if(response.data.STATUS === 200){
                            console.log("登录成功");
                            //fetchData({funcName: 'admin', stateName: 'auth'});
                            localStorage.setItem('permission', JSON.stringify(response.data.PermList));
                            localStorage.setItem('user',JSON.stringify(response.data.User));
							localStorage.setItem('userName',response.data.User.userName);
							localStorage.setItem('buttList',JSON.stringify(checkButtList()))
							const { history } = thi.props 
							history.push('/app/dashboard/index')
                            // window.location.href=localStorage.getItem('ip_port_frontend')+'/';
                        }else{
                            errorInfo(response.data.CONTENT);
                        }

                }).catch(function (error) {
                    sysErrorInfo(error);
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
                    <center style={{ fontSize: 16 }}><b>富金服科技股份</b></center>
                    <br />
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
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
                                <img type="image" style={{ height: "32px"}} src={IP_PORT_BACKEND+"/kaptcha/kaptcha.jpg"} alt="验证码" onClick={this.chageCode} title="图片看不清？点击重新得到验证码" />
                                </Col>
                            </Row>
                        </FormItem>

                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                登录
                            </Button>
                            或 <a href={window.location.origin+"/#/forgetPwd"}>忘记密码!</a>

                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default connectAlita(['auth'])(Form.create()(Login));