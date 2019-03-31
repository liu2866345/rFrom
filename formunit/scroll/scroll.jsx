import React, { Component } from 'react'
import './index.css'
/**
 * 单个滚动组件
 * @author simon
 * @datte 2019-01-01
 * 传入value格式为--[1990,09,20],组件渲染根据value的值进行渲染，当产生级联滑动时通过修改value然后setState，在确定获取选择的值时从value中获取
 * 传入modalData -- 可能为[[],[],[]]可能为cascade：true--[{key:'',value:'',subList:[]}]
 */
class Scroll extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
    	value:'',   //滑动前的默认值和滑动后的选择的值
    	slideObj : {}
    }
  }
  
  componentDidMount(){
  	//将每行的高度值存入state以便在display为none时使用
  	//将设置top的方法注册到父组件
  	this.props.registerInitFunc && this.props.registerInitFunc(this.setDefaultValue)
  	//禁止默认滚动事件
//	this.refs.scrollComponent.addEventListener('touchmove',(e)=>{
//		e.preventDefault()
//	},{passive:false})
  }
  
  preventEvent = (e)=>{
  	e.preventDefault()
  }
  
  /**
   * 返回value值，优先取本组件本身state的值，如果state没有值那么表示没打开组件，那么取初始化传入的props的值
   */
  getValue = () => {
  	return this.state.value || this.props.value
  }
  
  /**
   * 在打开组件时根据初始value设置滚动位置
   * slideArr为模型数据 [[第一个列数据]，[第n个列数据]]
   * value--为初始值[1990,09,20]
   */
  setDefaultValue = () => {
  	let value = this.getValue()
  	//获取滑动块静态数据数组
  	let slideArr = this.transferEnumeData()
  	slideArr&&slideArr.map((item , key) => {
  		let slideElement = this.refs['slideElement'+key]
  		if(!slideElement)return null
        //打开控件同时初始化row height
  		let eachRowHeight = this.getEachRowHeight(slideElement)
  		item.map((sItem , sKey) => {
  			if(sItem.key == value[key]){
  				slideElement.style["-webkit-transform"] = 'translate3d(0,' + (-(sKey-2)*eachRowHeight) + 'px,0)';
  				slideElement['r-start-dom-top'] = -(sKey-2)*eachRowHeight
  			}
  			return null
  		})
  		return null
  	})
  	//初始化slideobj
  	this.state.slideObj = {}
  }
  
  touchStart = (e) => {
  	let target = e.currentTarget
  	target['r-start-y'] = e.targetTouches[0].screenY
  	target.style.webkitTransitionDuration = target.style.transitionDuration = '0ms'
    target['r-start-time'] = (new Date()).getTime()
    var top = target['r-start-dom-top'];
    if (top) {
      target['r-start-dom-top'] = Number.isFinite(top)?top:parseFloat(top.replace(/px/g, ""));
    } else {
      target['r-start-dom-top'] = 0;
    }
  	clearInterval(target['r-interval'])
  	let currentSlideIndex = this.getSlideIndex(target)
  	this.setAnimate(currentSlideIndex , true)
  }
  
  touchMove = (e) => {
  	let target = e.currentTarget
  	target['r-end-y'] = e.targetTouches[0].screenY
  	//滑动的距离为px
  	let slideDistance = (target['r-end-y'] - target['r-start-y'])* 650 / window.innerHeight
  	let top = target['r-start-dom-top'] + slideDistance
  	//tempTop为move的上一次的位置
  	target['r-move-dom-top'] = top
  	
  	target['r-end-time'] = (new Date()).getTime()
  	target.style["-webkit-transform"] = 'translate3d(0,' + top + 'px,0)';
  	// 如果手指滑动到屏幕外面，开启惯性缓动
  	if (e.targetTouches[0].screenY < 1) {
      //启动定时缓动
	  this.startAnimate(e)
    };
  }
  
  touchEnd = (e) => {
  	let target = e.currentTarget
  	clearInterval(e.currentTarget['r-interval'])
  	//将每次移动后最终滑块停留的top值更新到start-top值
	e.currentTarget['r-start-dom-top'] = e.currentTarget['r-move-dom-top']
  	//滑动结束将操作完的top值保存到state的top
	this.startAnimate(e)
  }
  
    /**
   * 计算惯性滑动距离
   */
  startAnimate = (ev) => {
  	let target = ev.currentTarget
  	let eachRowHeight = this.getEachRowHeight(target)
  	let d = 0
	//averageVelocity--平均速度
	//如果点击速度过快，touchmove没有调用那么不进行滚动后续操作
	if(!target['r-end-y'] || !target['r-end-time']){
		return null
	}
    var averageVelocity = (target['r-end-y'] - target['r-start-y']) / (target['r-end-time'] - target['r-start-time']);
    if (Math.abs(averageVelocity) <= 0.2) {
      averageVelocity = (averageVelocity < 0 ? -0.08 : 0.08);
    } else {
      if (Math.abs(averageVelocity) <= 0.5) {
        averageVelocity = (averageVelocity < 0 ? -0.16 : 0.16);
      } else {
        averageVelocity = averageVelocity / 2;
      }
    }
    clearInterval(target['r-interval'])
    let pos = target['r-move-dom-top']
    target['r-interval'] = setInterval(()=>{
    	let moveLocation = averageVelocity* Math.exp(-0.03 * d)
    	let fontSize = (window.getComputedStyle(document.body).fontSize.replace(/px/g,''))*1+2
    	let currentSlideIndex = this.getSlideIndex(target)
    	let stopInterval = false 
    	pos = pos + moveLocation*fontSize
    	
    	if (Math.abs(moveLocation) <= 0.1) {
    		pos = Math.round(pos/2)*2
    		stopInterval = true
    	}
    	if (pos >= eachRowHeight*2 + 8) {
    		pos = eachRowHeight*2 + 8
    		stopInterval = true
    	}
    	if(stopInterval){
    		clearInterval(target['r-interval'])
    		this.setScroll(target,pos)
    	}else{
    		target.style["-webkit-transform"] = 'translate3d(0,' + pos + 'px,0)';
    	}
    	d++
    	console.log('缓动开始前top= '+target['r-move-dom-top']+' 【计算后的缓动位置 pos = ',pos, '】   缓动距离 = '+moveLocation)
    },30)
  }
  
  /**
   * 手指脱离屏幕调用改方法
   * 根据top值进行滑动，控制滑动范围不超界
   * e --滑动对象,top--滑动的top值,end--为end表示touchend触发
   */
  setScroll = (target,top)=>{
  	let height = parseFloat((window.getComputedStyle(target).height).replace(/px/g,''))
//	let scrollConHeight = parseFloat((window.getComputedStyle(target.parentElement).height).replace(/px/g,''))
  	//将top值转换为能被每行整除的值
  	let staticData = this.transferEnumeData()
  	let currentSlideIndex = this.getSlideIndex(target)
  	staticData = staticData[currentSlideIndex]
  	let eachRowHeight = this.getEachRowHeight(target)
  	top = Math.abs(top - parseInt(top/eachRowHeight)*eachRowHeight) >= eachRowHeight/2 ? ((parseInt(top/eachRowHeight)-1)*eachRowHeight) : (parseInt(top/eachRowHeight)*eachRowHeight)
  	//越界控制
	if(top >= eachRowHeight*2 + 8){
	  top = eachRowHeight*2
	}else if(top <= (eachRowHeight*3 - height- 8)){
	  top = eachRowHeight*3 - height
	}
	//滑动结束的值
	let resultIndex = Math.abs(top-2*eachRowHeight)/eachRowHeight
	let resultValue = staticData[resultIndex]
//	if(this.state.slideObj[currentSlideIndex]){
//		this.state.slideObj[currentSlideIndex]['choiceValue'] = resultValue
//	}else{
//		this.state.slideObj[currentSlideIndex] = {choiceValue:resultValue}
//	}
	//当前列滑动结束，设置级联的列的值
	this.setCascade(currentSlideIndex , resultIndex , resultValue , eachRowHeight)
	//在设置完级联滑动项和value后设置停止滑动动画
	target.style.webkitTransitionDuration = target.style.transitionDuration = '200ms';
	this.setAnimate(currentSlideIndex,false)
	target.style["-webkit-transform"] = 'translate3d(0,' + top + 'px,0)';
	target['r-start-dom-top'] = top
	target['r-move-dom-top'] = top
  }
  
  /**
   * 每列滑动结束后，设置其关联的模块滑动，重置当前列后面列的value值
   * currentSlideIndex --当前滑动块的索引 , resultIndex -- 滑动块对齐的索引, resultValue -- 滑动块对齐的value{key:'',value:''}
   */
  setCascade = (currentSlideIndex , resultIndex, resultValue , eachRowHeight) =>{
  	let { cascade , column  , modalData } = this.props
  	let value = this.getValue()
  	let resultArrData = []
  	if(cascade){
  		let copyData = JSON.parse(JSON.stringify(modalData))
  		let tempArr = copyData
  		for(var i=0;i<column;i++){
  			let eachArr = []
  			if(i < currentSlideIndex){
	  			tempArr.map((item , key) => {
	  				eachArr.push({key:item.key , value:item.value})
	  				if(item.key == value[i]){
	  					//如果当前value等于小于滑动项的value，那么直接返回当前sublist
	  					tempArr = item.subList
	  				}
	  			})
  			}else if(i == currentSlideIndex){
  				tempArr.map((item , key) => {
  					eachArr.push({key:item.key , value:item.value})
  					if(item.key == resultValue.key){
  						tempArr = item.subList
  						value[i] = item.key
  					}
  				})
  			}else{
  				tempArr.map((item , key) => {
  					eachArr.push({key:item.key , value:item.value})
  					if(key === 0){
  						tempArr = item.subList
  						value[i] = item.key
  					}
  				})
  			}
  			resultArrData.push(eachArr)
  		}
  		// 设置级联项的top值
	  	resultArrData.map((item , key) => {
	  		if(key > currentSlideIndex){
		  		item.map((sItem , sKey) => {
		  			if(value[key] == sItem.key){
		  				this.refs['slideElement'+key].style["-webkit-transform"] = 'translate3d(0,' + ((2-sKey)*eachRowHeight) + 'px,0)';
		  				this.refs['slideElement'+key]['r-start-dom-top'] = (2-sKey)*eachRowHeight
		  			}
			  		
		  		})
	  		}
	  	})
  	}else{
  		value[currentSlideIndex] = resultValue.key
  	}
  	this.state.value = value
  	return value
  }
  /**
   * 设置动画属性
   */
  setAnimate = (currentSlideIndex , flag) => {
  	let slideObj = this.state.slideObj
  	if(slideObj[currentSlideIndex]){
		slideObj[currentSlideIndex]['startAnimating'] = flag
	}else{
		slideObj[currentSlideIndex] = {startAnimating:flag}
	}
	this.setState({slideObj:slideObj})
  }
  /**
   * 获取每行的高度
   * 传入滑动的target
   */
  getEachRowHeight = (target)=>{
  	if(this.state.rowHeight)return this.state.rowHeight
  	let height = parseFloat((window.getComputedStyle(target).height).replace(/px/g,''))
  	//将top值转换为能被每行整除的值
  	let staticData = this.transferEnumeData()
  	let currentSlideIndex = this.getSlideIndex(target)
  	staticData = staticData[currentSlideIndex]
  	this.state.rowHeight = parseInt(height/staticData.length)
  	return this.state.rowHeight
  }
  /**
   * 获取当前target滑动的索引
   */
  getSlideIndex = (target)=>{
  	return (target.getAttribute('name').replace(/slideElement/g,''))*1
  }
  cancel = ()=>{
  	this.props.cancel&&this.props.cancel()
  }
  confirm = ()=>{
  	let slideObj = this.state.slideObj
  	let { action,column , modalData} = this.props
  	let value = this.getValue()
  	let flag = false
  	Object.keys(slideObj).map((item,key)=>{
  		if(slideObj[item]&&slideObj[item]['startAnimating']){
  			flag = true
  		}
  		return null
  	})
  	//flag--true表示有slide还在滑动中,false--滑动停止
  	if(flag){
  		clearTimeout(this.state.timeout)
  		this.state.timeout = setTimeout(()=>{
  			this.confirm()
  		},20)
  	}else{
  		action&&action(value)
  	}
  	console.log('控件选择的回传值   ',value)
  }
  /**
   * 根据slideIndex和key获取value
   */
  getValueBySlideIndex = (slideIndex , keyVal) => {
  	let val = ''
  	let slideArr  = this.transferEnumeData()
  	slideArr[slideIndex]&&slideArr[slideIndex].map((item , key) => {
  		if(item.key == keyVal){
  			val = item.value
  		}
  	})
  	return val
  }
  /**
   * 根据cascade和column转换滑动模板数据，
   * 如果cascade为true那么表示数据是级联的，否则为非级联的
   * 然后根据colunm数量和value返回模板数据数组，返回的数组格式为[第一个活动块数据，第二个滑动块数据，第三个滑动块数据]
   */
  transferEnumeData = () => {
  	let { cascade , column  , modalData } = this.props
  	let value = this.getValue()
  	let resultData = []
  	if(cascade){
  		let eachSlideData = JSON.parse(JSON.stringify(modalData))
  		value&&value.map((item,key)=>{
  			let nextArr = []
  			let tempArr = []
  			eachSlideData.map((sItem , sKey) => {
  				if(sItem.key == item){
  					nextArr = sItem.subList
  				}
  				tempArr.push({key:sItem.key,value:sItem.value})
  			})
  			resultData[key] = tempArr
  			eachSlideData = nextArr
  		})
  	}else{
  		resultData = modalData.slice(0,column)
  	}
  	return resultData
  }
  render() {
  	let value = this.getValue()
  	let slideArr = this.transferEnumeData(value)
  	let isAnimating = false //控制是否在滑动中，默认为false
  	let slideObj = this.state.slideObj
  	Object.keys(slideObj).map((item,key)=>{
  		if(slideObj[item]&&slideObj[item]['startAnimating']){
  			isAnimating = true
  		}
  		return null
  	})
  	
    return (
    	<div className="scroll-component" ref="scrollComponent" onTouchMove = {this.preventEvent}>
    		<div className="scroll-opque"></div>
    		<div className="scroll-container" >
    			<div className="scroll-btn">
    				<span className="scroll-btn-left" onClick= { this.cancel }>取消</span>
    				<span className={"scroll-btn-right"+(isAnimating?' disable':'')} onClick= { this.confirm }>确定</span>
    			</div>
	    		<div className="scroll-content">
	    			{
	    				slideArr.map((slide , i)=>{
	    					return (
	    						<div className="scroll-column"  key={i} >
					    			<div name={'slideElement'+i} ref = {'slideElement'+i} className="scroll-column-item" onTouchStart = {this.touchStart} onTouchMove = {this.touchMove} onTouchEnd = {this.touchEnd} >
						    			{
											slide.map((item,key) => {
											  return (<div key={key} value={item.key} className="scroll-item">{item.value}</div>)
											})
						    			}
						    		</div>
					    		</div>
				    		)
				    	})
	    			}
	    			<div className="scroll-rule"></div>
	    		</div>
	    	</div>
    	</div>
    )
  }
}

export default Scroll
