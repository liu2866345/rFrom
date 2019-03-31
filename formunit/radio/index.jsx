import React, { Component } from 'react'
/**
 * 文本输入组件
 * @author simon
 * @datte 2019-01-01
 */
class Input extends Component {
  constructor(props, context) {
    super(props, context)
  }
  
  changeHandler = ( element ) => {
  	let injectData = this.props.injectData || {}
  	if(injectData.readOnly){
  		return null
  	}
  	if (this.props.action) {
  		let resultObj = {}
  		let name = element.target.getAttribute('name')
  		let val = element.target.getAttribute('value')
  		resultObj['eventType'] = 'click'
  		resultObj['keyName'] = name
  		resultObj['value'] = val
  		this.props.action ( resultObj )
  	}
  }

  render() {
  	let injectData = this.props.injectData || {}
  	if (!injectData.enumOption){
  		console.error('请配置单选枚举文本。')
  		return null
  	}
    return (
    	<div className={"radio-row "+injectData.required}>
    		<label  className="radio-row-label">{ injectData.label }</label>
    		<div className={injectData.readOnly?"radio-row-radio read-only":"radio-row-radio"}>
    		{
    			injectData.enumOption.map((item,key) =>{
    				return (<span key={key} name = { injectData.name } onClick    = { this.changeHandler } className={ injectData.value == item.key ? 'item cur' : 'item'} value = {item.key}>{item.value}</span>)
    			})
    		}
    		</div>
    	</div>
    )
  }
}

export default Input
