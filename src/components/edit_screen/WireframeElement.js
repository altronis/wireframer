import React from 'react';
import { Rnd } from 'react-rnd';

class WireframeElement extends React.Component {

    render() {
        const element = this.props.element;
        const zoomLevel = this.props.zoomLevel;
        const selected = this.props.selected;

        const defaultPosition = {
            y: element.dimensions.top_pos * zoomLevel,
            x: element.dimensions.left_pos * zoomLevel
        };

        const defaultSize = {
            height: element.dimensions.height * zoomLevel,
            width: element.dimensions.width * zoomLevel
        }

        const elementStyle = {
            position: "absolute",

            borderWidth: element.border ? element.border.thickness * zoomLevel : 0,
            borderStyle: "solid",
            borderColor: element.border ? element.border.color : "transparent",
            borderRadius: element.border ? element.border.radius * zoomLevel : 0,

            backgroundColor: element.background_color ? element.background_color : "transparent",

            fontSize: element.text ? element.text.font_size * zoomLevel : "",
            color: element.text ? element.text.color : ""
        };

        const resizeHandleStyle = {
            display: selected ? "block" : "none",
        };
        
        return (
                <Rnd style={elementStyle} 
                    position={defaultPosition}
                    size={defaultSize}
                    className={"valign-wrapper hoverable element " + this.props.element.type + (this.props.selected ? " selected" : "")}
                    onClick={(e) => this.props.handleSelect(e, this.props.element.key)}
                    resizeHandleStyles = {{
                        topRight: resizeHandleStyle,
                        topLeft: resizeHandleStyle,
                        bottomRight: resizeHandleStyle,
                        bottomLeft: resizeHandleStyle
                    }}
                    resizeHandleClasses = {{
                        topRight: "resize-handle",
                        topLeft: "resize-handle",
                        bottomRight: "resize-handle",
                        bottomLeft: "resize-handle"
                    }}
                    enableResizing = {{
                        bottom: false,
                        bottomLeft: selected,
                        bottomRight: selected,
                        left: false,
                        right: false,
                        top: false,
                        topLeft: selected,
                        topRight: selected
                    }}
                    disableDragging = {!selected}
                    onResizeStop={
                        (e, direction, ref, delta, position) => this.props.handleResize(delta.width, delta.height, position.x, position.y, element.key)
                    }
                    onDragStop={
                        (e, d) => this.props.handleResize(0, 0, d.x, d.y, element.key)
                    }
                    bounds="parent"
                    >
                    <p>{element.text ? element.text.contents : ""}</p>
                    
                    {/* <div style={topLeftHandleStyle} className="resize-handle"></div>
                    <div style={bottomLeftHandleStyle} className="resize-handle"></div>
                    <div style={topRightHandleStyle} className="resize-handle"></div>
                    <div style={bottomRightHandleStyle} className="resize-handle"></div> */}
                </Rnd>
        );
    }
}
export default WireframeElement;