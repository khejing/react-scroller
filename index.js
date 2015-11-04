import React from 'react';

const Scroller = React.createClass({
    getInitialState(){
        return {
            hasMore: false,
            hasNoMore: false
        };
    },
    componentDidMount() {
        if (this.props.scrollToBottom) {
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
                if(!this.state.hasNoMore){
                    this.setState({hasMore: true});
                }
                this.props.onScrollTop();
                if(this.state.hasMore){
                    this.setState({hasMore: false});
                }
            }
        }
        if (this.props.onScroll) {
            this.props.onScroll(e.target.scrollTop);
        }
    },

    hasNoMore(){
        this.setState({hasNoMore: true});
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
            marginTop = this.props.screenAttributes.type === 'lg' ? 0 : 49;
        }

        if (typeof marginBottom !== 'number') {
            marginBottom = this.props.screenAttributes.type === 'lg' ? 0 : 49;
        }

        // 为聊天记录页面做特殊处理
        // TODO: replace role prop with redux-router
        if (this.props.role === 'chatRecords') {
            marginTop = 49;
            marginBottom = 49;
            if (this.props.screenAttributes.type === 'lg') {
                marginBottom = 136;
            }
        }

        let style = {
            height: parseInt(this.props.screenAttributes.height - marginTop - marginBottom) + 'px',
            marginTop: `${marginTop}px`
        };

        if (this.props.style) {
            for (let key in this.props.style) {
                style[key] = this.props.style[key];
            }
        }


        return (
            <div ref="scroller" className={"comm-scroller " + (this.props.className || "")} onScroll={this.onScroll} style={style}>
                {this.state.hasMore && <p className="gray-text">正在加载...</p>}
                {React.cloneElement(this.props.children, {onNoMore: this.hasNoMore})}
            </div>
        );
    }
});

export default Scroller;