import React, { Component } from 'react';
import Date from './Date';
//import '../rowItem.scss';
//证件有效期组件
class DatePicker extends Component {

	render () {
		let injectData = this.props.injectData;
		return (
			<div className={'date-row '+injectData.required}>
				<div className="date-label">
					{ injectData.label }
				</div>
				<div className="date-content">
					<Date {...this.props.injectData} action = { this.props.action }></Date>
				</div>
			</div>
		)
	}
}

export default DatePicker;
