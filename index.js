import React from 'react';
import classNames from 'classnames';
import ScreenAttributes, {getScreenAttributes} from 'screen-attributes-mixin';

const Scroller = React.createClass({
    mixins: [ScreenAttributes],
    getInitialState(){
        let {screenWidth, screenHeight, screenType} = getScreenAttributes();
        return {
            screenWidth,
            screenHeight,
            screenType
        };
    },
    componentDidMount(){
        this.scrollBottom();
    },
    componentDidUpdate(props, state){
        //TODO: add to see if it's not scroll bottom, or don't call scrollBottom()
        if(props.marginBottom < this.props.marginBottom || state.screenHeight > this.state.screenHeight){
            console.log("before marginbottom"+props.marginBottom+", after marginbottom"+this.props.marginBottom);
            console.log("before screenHeight"+state.screenHeight+", after screenheight"+this.state.screenHeight);
            this.scrollBottom();
        }
    },
    preventOnScrollEvent: false,
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
            this.props.onScroll(e.target.scrollTop);
        }
    },
    scrollBottom() {
        this.preventOnScrollEvent = true;
        var ctn = this.refs.scroller.getDOMNode();
        ctn.scrollTop = ctn.scrollHeight - ctn.offsetHeight;
    },
    setScrollTop(scrollTop) {
        this.preventOnScrollEvent = true;
        var ctn = this.refs.scroller.getDOMNode();
        ctn.scrollTop = scrollTop;
    },
    render() {
        let marginTop = this.props.marginTop;
        let marginBottom = this.props.marginBottom;

        if (typeof marginTop !== 'number') {
            marginTop = this.state.screenType === 'lg' ? 0 : 49;
        }

        if (typeof marginBottom !== 'number') {
            marginBottom = this.state.screenType === 'lg' ? 0 : 49;
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