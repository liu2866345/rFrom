import React, { Component } from 'react';
import Date from './Date';
//import '../rowItem.scss';
//证件有效期组件
class DatePicker extends Component {

	changeDate = (e) => {
		let injectData = this.props.injectData;
		if(injectData.readOnly)return null
		let val = injectData.value
		if(injectData.longTimeValue){
			val = false
		}else{
			val = true
		}
		this.props.action&&this.props.action({keyName: injectData.name, value: val , eventType:'click',modalKey:'longTimeValue'})
	}

	render () {
		let injectData = this.props.injectData;
		let val = injectData.value
		let longClass = injectData.isShowLongTime?"login-time-radio show ":"login-time-radio "
		longClass = longClass + (injectData.readOnly?' read-only':'')
		longClass = longClass + (injectData.longTimeValue?' cur ': '')
		return (
			<div className={'login-time-row '+injectData.required}>
				<div className="login-time-label">
					{ injectData.label }
				</div>
				<div className="login-time-content">
					<Date {...this.props.injectData} action = { this.props.action }></Date>
				</div>
				{
					injectData.isShowLongTime?(
						<div onClick={ this.changeDate } className={longClass}>
							<label className="item"></label>
							<span>长期</span>
						</div>
					):(null)
				}
			</div>
		)
	}
}

export default DatePicker;
