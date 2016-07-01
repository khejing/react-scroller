require("./style.css");
import React from 'react';
import classNames from 'classnames';
import throttle from 'lodash/function/throttle.js';
import ScreenAttributes, {getScreenAttributes} from 'screen-attributes-mixin';
import {isDesktop} from 'ua.js';

const Scroller = React.createClass({
    mixins: [ScreenAttributes],
    getInitialState(){
        let {screenHeight} = getScreenAttributes();
        return {
            screenHeight
        };
    },
    componentDidMount(){
        this.scrollBottom();
        if(this.props.onScroll){
            this.throttledOnScroll = throttle(this.props.onScroll, 500);
        }
    },
    componentWillUpdate(nextProps, nextState){
        let ctn = this.refs.scroller.getDOMNode();
        if (ctn.scrollTop + ctn.offsetHeight >= ctn.scrollHeight) {
            if(this.props.marginBottom < nextProps.marginBottom || this.state.screenHeight !== nextState.screenHeight){
                this.needScrollToBottom = true;
            }
        }
    },
    componentDidUpdate(prevProps, prevState){
        if(this.needScrollToBottom){
            this.needScrollToBottom = false;
            this.scrollBottom();
        }
    },
    needScrollToBottom: false,
    preventOnScrollEvent: false,
    throttledOnScroll: null,
    getScrollHeight(){
        return this.refs.scroller.getDOMNode().scrollHeight;
    },
    onScroll(e) {
        if(this.preventOnScrollEvent){
            this.preventOnScrollEvent = false;
            return;
        }
        if (e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight) {
            if (this.props.onScrollBottom) {
                this.props.onScrollBottom();
            }
        } else if (e.target.scrollHeight > e.target.offsetHeight && e.target.scrollTop <= 0) {
            if (this.props.onScrollTop) {
                this.props.onScrollTop();
            }
        }
        if (this.props.onScroll) {
            this.throttledOnScroll(e.target.scrollTop);
        }
    },
    scrollBottom() {
        this.preventOnScrollEvent = true;
        let ctn = this.refs.scroller.getDOMNode();
        ctn.scrollTop = ctn.scrollHeight - ctn.offsetHeight;
    },
    setScrollTop(scrollTop) {
        this.preventOnScrollEvent = true;
        this.refs.scroller.getDOMNode().scrollTop = scrollTop;
    },
    render() {
        let marginTop = this.props.marginTop;
        let marginBottom = this.props.marginBottom;

        if (typeof marginTop !== 'number') {
            marginTop = isDesktop() ? 0 : 49;
        }

        if (typeof marginBottom !== 'number') {
            marginBottom = isDesktop() ? 0 : 49;
        }

        let style = {
            height: this.state.screenHeight - marginTop - marginBottom,
            marginTop
        };

        Object.assign(style, this.props.style);

        return (
            <div ref="scroller" className={classNames("comm-scroller", this.props.className)} onScroll={this.onScroll} style={style}>
                {this.props.children}
            </div>
        );
    }
});

export default Scroller;
