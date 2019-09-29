import React, { Component } from 'react';
import Routes from './routes';
import { Redirect } from "react-router-dom";
import DocumentTitle from 'react-document-title';
import SiderCustom from './components/SiderCustom';
import HeaderCustom from './components/HeaderCustom';
import { Layout } from 'antd';
import { ThemePicker } from './components/widget';
import { connectAlita } from 'redux-alita';

const { Content, Footer } = Layout;

class App extends Component {
    state = {
        collapsed: false,
        title: ''
    };
    componentWillMount() {
        const { setAlitaState } = this.props;
		const user = JSON.parse(localStorage.getItem('user'));
		
        // user && receiveData(user, 'auth');
		user && setAlitaState({ stateName: 'auth', data: user });
		if (!user){
			this.setState({notAuth : true})
			console.log('%c Oh my heavens!Oh my heavens!Oh my heavens!Oh my heavens! ', 'background: #222; color: #F00');
			console.log(this)			
		}else{
			this.setState({notAuth : false})
		}
        // receiveData({a: 213}, 'auth');
        // fetchData({funcName: 'admin', stateName: 'auth'});
        this.getClientWidth();
        window.onresize = () => {
            // console.log('屏幕变化了');
            this.getClientWidth();
		}

    }

    getClientWidth = () => { // 获取当前浏览器宽度并设置responsive管理响应式
        const { setAlitaState } = this.props;
        const clientWidth = window.innerWidth;
        // console.log(clientWidth);
        setAlitaState({ stateName: 'responsive', data: { isMobile: clientWidth <= 992 } });
        // receiveData({isMobile: clientWidth <= 992}, 'responsive');
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    render() {
        const { title,notAuth } = this.state;
        const { auth = { data: {} }, responsive = { data: {} } } = this.props;
        // console.log(auth);
		let pathName = this.props.location.pathname;
		console.log('pathName---',pathName);
		let pathFlag = pathName.includes('dashboard');
		console.log('this---',this);
		console.log('pathFlag---',pathFlag);
		if (notAuth)return (<Redirect to={'/login'} />)
        return (
            <DocumentTitle title={title}>
                <Layout>
                    {!responsive.data.isMobile && <SiderCustom collapsed={this.state.collapsed} />}
                    <ThemePicker />

					{pathFlag ?
						<Layout style={{flexDirection: 'column',backgroundColor: '#313653'}}>
							<HeaderCustom toggle={this.toggle} collapsed={this.state.collapsed} user={auth.data || {}} />
							<Content style={{ margin: '0 16px', overflow: 'initial', flex: '1 1 0' }}>
								<Routes auth={auth} />
							</Content>
							<Footer style={{ textAlign: 'center',color: '#FFFFFF', backgroundColor: '#313653' }}>
                                富金服科技股份有限公司
							</Footer>
						</Layout>
						:
						<Layout style={{flexDirection: 'column'}}>
							<HeaderCustom toggle={this.toggle} collapsed={this.state.collapsed} user={auth.data || {}} />
							<Content style={{ margin: '0 16px', overflow: 'initial', flex: '1 1 0' }}>
								<Routes auth={auth} />
							</Content>
							<Footer style={{ textAlign: 'center'}}>
                                富金服科技股份有限公司
							</Footer>
						</Layout>
					}


                </Layout>
            </DocumentTitle>
        );
    }
}

export default connectAlita(['auth', 'responsive'])(App);
