import React from 'react';

class WireframeElement extends React.Component {

    render() {
        const element = this.props.element;
        const zoomLevel = this.props.zoomLevel;

        const elementStyle = {
            position: "absolute",
            top: element.dimensions.top_pos * zoomLevel,
            left: element.dimensions.left_pos * zoomLevel,
            height: element.dimensions.height ? element.dimensions.height * zoomLevel : "",
            width: element.dimensions.width ? element.dimensions.width * zoomLevel : "",

            borderWidth: element.border ? element.border.thickness * zoomLevel : 0,
            borderStyle: "solid",
            borderColor: element.border ? element.border.color : "transparent",
            borderRadius: element.border ? element.border.radius * zoomLevel : 0,

            backgroundColor: element.background_color ? element.background_color : "transparent",

            fontSize: element.text ? element.text.font_size * zoomLevel : "",
            color: element.text ? element.text.color : ""
        }
        
        return (
            <div style={elementStyle} className={element.type + "-element valign-wrapper"}>
                <p>{element.text ? element.text.contents : ""}</p>
            </div>
        );
    }
}
export default WireframeElement;