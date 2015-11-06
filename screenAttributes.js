function getScreenAttributes(){
    let h = window.innerHeight;
    let w = window.innerWidth;
    let type;
    if (w > 1024) {
        w = 1024;
        if (h > 768) {
            h = 768;
        }
    }
    if(w >= 768){
        type = "lg";
    }else{
        type = "sml";
    }

    return {
        screenWidth: w,
        screenHeight: h,
        screenType: type
    };
}

const screenAttributes = {
    componentDidMount(){
        window.addEventListener('resize', this.onScreenAttributesChange);
    },
    componentWillUnmount(){
        window.removeEventListener('resize', this.onScreenAttributesChange);
    },
    onScreenAttributesChange(){
        this.setState(getScreenAttributes());
    }
};

export {getScreenAttributes, screenAttributes};