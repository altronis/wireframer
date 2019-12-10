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
        };

        const topLeftHandleStyle = {
            display: this.props.selected ? "block" : "none",
            top: (element.dimensions.top_pos - 4) * zoomLevel,
            left: (element.dimensions.left_pos - 4) * zoomLevel
        };

        const bottomLeftHandleStyle = {
            display: this.props.selected ? "block" : "none",
            top: (element.dimensions.top_pos + element.dimensions.height - 4) * zoomLevel,
            left: (element.dimensions.left_pos - 4) * zoomLevel
        };

        const topRightHandleStyle = {
            display: this.props.selected ? "block" : "none",
            top: (element.dimensions.top_pos - 4) * zoomLevel,
            left: (element.dimensions.left_pos + element.dimensions.width - 4) * zoomLevel
        };

        const bottomRightHandleStyle = {
            display: this.props.selected ? "block" : "none",
            top: (element.dimensions.top_pos + element.dimensions.height - 4) * zoomLevel,
            left: (element.dimensions.left_pos + element.dimensions.width - 4) * zoomLevel
        };
        
        return (
            <div>
                <div style={elementStyle} className={"valign-wrapper hoverable element " + this.props.element.type + (this.props.selected ? " selected" : "")}
                    onClick={(e) => this.props.handleSelect(e, this.props.element.key)}>
                    <p>{element.text ? element.text.contents : ""}</p>
                </div>

                <div style={topLeftHandleStyle} className="resize-handle"></div>
                <div style={bottomLeftHandleStyle} className="resize-handle"></div>
                <div style={topRightHandleStyle} className="resize-handle"></div>
                <div style={bottomRightHandleStyle} className="resize-handle"></div>
            </div>
        );
    }
}
export default WireframeElement;