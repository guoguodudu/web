import React, { Component } from 'react';
import {TIME_OUT_CLICK} from '@/constants';

class Click extends Component {
	constructor(props){
		super(props)
		const {children} = props;
		console.log(children)
		// console.log(JSON.stringify(children))
		this.disableMultipleClick = this.disableMultipleClick.bind(this)
		this.timer = undefined
	}

	disableMultipleClick (e){
		const {timer} = this
		if (timer){
			e.stopPropagation()
			e.preventDefault()	
		}else{
			this.timer = setTimeout(()=>{
				this.timer = undefined
			},TIME_OUT_CLICK)
		}
		// console.log('你点击了我');
		// console.log(children);
		// console.log(e);
		// console.log(e.target);
		// console.log(e.currentTarget);
		return false 
	}
	render() {
		const {props:{children,...oProps}} = this
		return <span {...oProps} onClick={this.disableMultipleClick}>{children}</span>;
	}
}
export default Click;
