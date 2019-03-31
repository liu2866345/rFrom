import React, { Component } from 'react'
/**
 * 文本输入组件
 * @author simon
 * @datte 2019-01-01
 */
class Select extends Component {
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
  		let val = element.target.value
  		resultObj['eventType'] = 'click'
  		resultObj['keyName'] = name
  		resultObj['value'] = val
  		this.props.action ( resultObj )
  	}
  }

  render() {
  	let injectData = this.props.injectData || {}
  	if (!injectData.enumOption){
  		console.error('请配置'+injectData.label+'下拉框枚举文本。')
  		return null
  	}
  	let isInSelect = false
  	injectData.enumOption.map((item,key) =>{
		if(item.key == injectData.value){
			isInSelect = true
		}
	})
    return (
    	<div className={"select-row "+injectData.required}>
    		<label  className="select-row-label ">{ injectData.label }</label>
    		{
    			injectData.readOnly?(
    				<span className="select-row-radio read-only">请选择</span>
    			):(
    				<select name = { injectData.name } onChange = { this.changeHandler } className={isInSelect?'select-row-radio ':'select-row-radio init'}>
		    			<option  value = "" >请选择</option>
		    		{
		    			injectData.enumOption.map((item,key) =>{
		    				return (<option key={key}   value = {item.key}>{item.value}</option>)
		    			})
		    		}
		    		</select>
    			)
    		}
    	</div>
    )
  }
}

export default Select
