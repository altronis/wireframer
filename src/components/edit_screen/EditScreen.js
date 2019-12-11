import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import {ToastContainer, toast} from 'react-toastify';
import { Modal } from 'react-materialize';
import WireframeElement from './WireframeElement'
import { ChromePicker } from 'react-color';
import 'react-toastify/dist/ReactToastify.css';

const DialogBox = ({name, handleSaveClose, handleClose}) => {
    return ( 
        <div>
            <div>Do you want to save changes to {name} ?</div>
            <div id="dialog-buttons">
                <span className="dialog_button" onClick={handleSaveClose}>SAVE</span>
                <span id="yes_button" className="dialog_button" onClick={handleClose}>DON'T SAVE</span>
                <span id="no_button" className="dialog_button modal-close" onClick={() => toast.dismiss("dialog")}>CANCEL</span>
            </div>
        </div>
    );
}

class EditScreen extends Component {
    state = {
        name: this.props.wireframe.name,
        owner: this.props.wireframe.owner,
        wireframe: this.props.wireframe,
        zoomLevel: 1.0,
        needToSave: false,
        redirect: false,
        selectedElement: -1,
        selectedElementIndex: -1,
        displayColorPicker: false
    }

    getSelectedElementIndex = (key) => {
        let elements = this.state.wireframe.elements;
        for (var i = 0; i < elements.length; i ++) {
            if (elements[i].key === key)
                return i;
        }
        return -1;
    }

    notify = (message, color) => {
        toast(message, {
            position: toast.POSITION.BOTTOM_LEFT,
            className: color + '-background',
            bodyClassName: 'message',
            progressClassName: 'progress-bar'
        });
    }

    dialog = () => {
        if (!toast.isActive("dialog") && this.state.needToSave) {
            toast(<DialogBox name={this.state.wireframe.name} handleSaveClose={this.handleSaveClose} handleClose={this.handleClose} />, {
                autoClose: false,
                toastId: "dialog",
                position: "top-center",
                bodyClassName: "dialog-message",
                closeOnClick: false
            });
        }
        else if (!this.state.needToSave) {
            this.setState({redirect: true});
        }
    }

    handleChange = () => {
        const newName = document.getElementById("name").value;
        const newHeight = document.getElementById("height").value;
        const newWidth = document.getElementById("width").value;

        // Check for errors
        if (parseInt(newHeight) != newHeight || parseInt(newWidth) != newWidth || 
            parseInt(newHeight) < 1 || parseInt(newHeight) > 5000 ||
            parseInt(newWidth) < 1 || parseInt(newWidth) > 5000) {
                this.notify("Invalid wireframe dimensions", "red");
        }
        else {     
            let newWireframe = {...this.state.wireframe};
            newWireframe.name = newName;
            newWireframe.height = parseInt(newHeight);
            newWireframe.width = parseInt(newWidth);
            this.notify("Update successful", "blue");
            this.setState({wireframe: newWireframe, needToSave: true});
        }
    }

    handleChangeProperties = (event) => {
        const property = event.target.id;
        const newVal = event.target.value;
        let newWireframe = {...this.state.wireframe};
        let elementToChange = newWireframe.elements[this.state.selectedElementIndex];

        if (property === "text") 
            elementToChange.text.contents = newVal;
        if (property === "font-size")
            elementToChange.text.font_size = newVal;

        newWireframe.elements[this.state.selectedElementIndex] = elementToChange
        this.setState({wireframe: newWireframe, needToSave: true});
    }

    handleClickColorPicker = () => {
        console.log("clicked");
        this.setState({displayColorPicker: !this.state.displayColorPicker});
    }

    handleCloseColorPicker = () => {
        this.setState({displayColorPicker: false});
    }

    handleChangeColor = (event, target) => {
        let newWireframe = {...this.state.wireframe};
        let elementToChange = newWireframe.elements[this.state.selectedElementIndex];

        if (target === "text-color") 
            elementToChange.text.color = event.hex;

        newWireframe.elements[this.state.selectedElementIndex] = elementToChange
        this.setState({wirefraeme: newWireframe, needToSave: true});
    }

    handleZoom = (factor) => {
        this.setState({zoomLevel: this.state.zoomLevel * factor});
    }

    handleSave = () => {
        const newWireframe = this.state.wireframe;
        const thisDoc = getFirestore().collection("wireframes").doc(this.state.wireframe.id);

        thisDoc.update({
            elements: newWireframe.elements,
            height: newWireframe.height,
            name: newWireframe.name,
            width: newWireframe.width
        }).then(() => {
            this.setState({needToSave: false});
            this.notify("Saved", "blue");
        });
    }

    handleSaveClose = () => {
        const newWireframe = this.state.wireframe;
        const thisDoc = getFirestore().collection("wireframes").doc(this.state.wireframe.id);

        thisDoc.update({
            elements: newWireframe.elements,
            height: newWireframe.height,
            name: newWireframe.name,
            width: newWireframe.width
        }).then(() => {
            this.setState({needToSave: false});
            this.notify("Saved", "blue");
        }).then(() => {
            this.setState({redirect: true});
        });
    }

    handleClose = () => {
        this.setState({redirect: true});
    }

    handleNew = (type) => {
        const numElements = this.state.wireframe.elements.length;
        const height = this.state.wireframe.height;
        const width = this.state.wireframe.width;
        let newElement;

        if (type === "container") {
            newElement = {
                key: numElements,
                type: "container",
                background_color: "#FFFFFF",
                dimensions: {
                    top_pos: 0,
                    left_pos: 0,
                    height: height >= 200 ? 100 : height / 2,
                    width: width >= 200 ? 100 : width / 2
                },
                border: {
                    thickness: 2,
                    radius: 2,
                    color: "#000000"
                }
            };
        } 
        else if (type === "label") {
            newElement = {
                key: numElements,
                type: "label",
                dimensions: {
                    top_pos: 0,
                    left_pos: 0,
                    height: height >= 50 ? 25 : height / 2,
                    width: width >= 200 ? 100 : width / 2
                },
                text: {
                    contents: "Prompt for input:",
                    font_size: 12,
                    color: "#000000"
                }
            };
        }
        else if (type === "button") {
            newElement = {
                key: numElements,
                type: "button",
                background_color: "#D3D3D3",
                dimensions: {
                    top_pos: 0,
                    left_pos: 0,
                    height: height >= 50 ? 25 : height / 2,
                    width: width >= 150 ? 75 : width / 2
                },
                border: {
                    thickness: 2,
                    radius: 2,
                    color: "#000000"
                }, 
                text: {
                    contents: "Submit",
                    font_size: 14,
                    color: "#000000"
                }
            };
        } 
        else if (type === "textfield") {
            newElement = {
                key: numElements,
                type: "textfield",
                background_color: "#FFFFFF",
                dimensions: {
                    top_pos: 0,
                    left_pos: 0,
                    height: height >= 50 ? 25 : height / 2,
                    width: width >= 200 ? 100 : width / 2
                },
                border: {
                    thickness: 2,
                    radius: 2,
                    color: "#000000"
                }, 
                text: {
                    contents: "Input",
                    font_size: 14,
                    color: "#80808F"
                }
            };
        }

        let newWireframe = {...this.state.wireframe};
        newWireframe.elements.push(newElement);

        this.setState({wireframe: newWireframe, needToSave: true});
    }

    handleSelect(event, key) {
        event.preventDefault();
        event.stopPropagation();

        console.log(key);
        this.setState({selectedElement: key, selectedElementIndex: this.getSelectedElementIndex(key)});
    }

    handleResize(deltaWidth, deltaHeight, newLeft, newTop, key) {
        let newWireframe = {...this.state.wireframe};
        let elementToChange = newWireframe.elements.filter(element => element.key === key)[0];
        elementToChange.dimensions.height += deltaHeight;
        elementToChange.dimensions.width += deltaWidth;
        elementToChange.dimensions.left_pos = newLeft;
        elementToChange.dimensions.top_pos = newTop;

        for (var i = 0; i < newWireframe.elements.length; i ++) {
            if (i === key)
                newWireframe.elements[i] = elementToChange;
        }

        console.log(elementToChange);

        this.setState({wireframe: newWireframe, needToSave: true});
    }

    componentDidMount() {
        // Set timestamp of wireframe to now
        const wireframe = this.props.wireframe;
        const thisDoc = getFirestore().collection("wireframes").doc(wireframe.id);
        const timeNow = Date.now();
        
        thisDoc.update({
            timeStamp: timeNow
        }).then(function() {
            console.log("Timestamp updated");
        });
    }

    render() {
        const auth = this.props.auth;

        // CSS height and width for wireframe window
        const windowStyle = {
            height: this.state.wireframe.height * this.state.zoomLevel,
            width: this.state.wireframe.width * this.state.zoomLevel,
        }

        if (!auth.uid || this.state.redirect) {
            return <Redirect to="/" />;
        }

        const logo = document.getElementById("logo");
        logo.addEventListener("click", () => this.dialog());

        const initials = document.getElementById("initials");
        initials.addEventListener("click", () => this.dialog());

        try {
            let elements = this.state.wireframe.elements;

            const trigger = <i className="icon-button material-icons">close</i>
            const selectedElementIndex = this.state.selectedElementIndex;
            const selectedElement = selectedElementIndex === -1 ? null : this.state.wireframe.elements[this.state.selectedElementIndex];

            return (
                <div id="editor" className="container grey lighten-1">
                    <ToastContainer />

                    <div className="row">
                        <div id="leftbar" className="container white col l2 s3">
                            <div className="blue z-depth-1" id="actions">
                                <i className="icon-button material-icons" onClick={() => this.handleZoom(2)}>zoom_in</i>
                                <i className="icon-button material-icons" onClick={() => this.handleZoom(0.5)}>zoom_out</i>
                                <i className="icon-button material-icons" onClick={this.handleSave}>save</i>
                                {this.state.needToSave ? 
                                    <Modal header={"Do you want to save changes to " + this.state.wireframe.name + "?"} trigger={trigger}
                                        actions={
                                            <div className="buttons">
                                                <span className="dialog_button" onClick={this.handleSaveClose}>SAVE</span>
                                                <span id="yes_button" className="dialog_button" onClick={this.handleClose}>DON'T SAVE</span>
                                                <span id="no_button" className="dialog_button modal-close">CANCEL</span>
                                            </div>
                                        }
                                    >
                                    All unsaved data will be lost.
                                    </Modal> :
                                    <i className="icon-button material-icons" onClick={this.handleClose}>close</i>
                                }
                            </div>

                            <div id="wireframe-info">
                                <div className="input row">
                                    <div className="input-field col s12">
                                        <label className="active" htmlFor="name">Name</label>
                                        <input className="active" type="text" name="name" id="name" defaultValue={this.state.name} />
                                    </div>
                                </div>

                                <div className="input row">
                                    <div className="input-field inline col s6">
                                        <label className="active" htmlFor="width">Width</label>
                                        <input className="active" type="number" name="width" id="width" defaultValue={this.state.wireframe.width} />
                                    </div>

                                    <div className="input-field inline col s6">
                                        <label className="active" htmlFor="height">Height</label>
                                        <input className="active" type="number" name="height" id="height" defaultValue={this.state.wireframe.height} />
                                    </div>
                                </div>
                                <a id="update-button" className="waves-effect blue waves-light btn"
                                        onClick={this.handleChange}>Update info</a>
                            </div>

                            <div id="add-elements">
                                 <div className="add-element" onClick={() => this.handleNew("container")}>
                                    <div id="example-container"></div>
                                    <p className="element-type">Container</p>
                                 </div>
                                 <div className="add-element" onClick={() => this.handleNew("label")}>
                                    <div >Prompt for input:</div>
                                    <p className="element-type">Label</p>
                                 </div>
                                 <div className="add-element" onClick={() => this.handleNew("button")}>
                                    <div id="example-button">Submit</div>
                                    <p className="element-type">Button</p>
                                 </div>
                                 <div className="add-element" onClick={() => this.handleNew("textfield")}>
                                    <div id="example-textfield">Input</div>
                                    <p className="element-type">Textfield</p>
                                 </div>
                            </div>
                        </div>

                        <div id="edit-window" className="container col l8 s6">
                            <div id="wireframe-window" onClick={(e) => this.handleSelect(e, -1)} style={windowStyle}>
                                {
                                    elements && elements.map(element => (
                                        <WireframeElement key={element.key} element={element} 
                                                          zoomLevel={this.state.zoomLevel} 
                                                          handleSelect={this.handleSelect.bind(this)}
                                                          handleResize={this.handleResize.bind(this)}
                                                          selected={element.key === this.state.selectedElement} />
                                    ))
                                }
                            </div>
                        </div>
                        
                        {selectedElement ? 
                        <div id="properties" className="container white col l2 s3">
                                <div id="properties-header">Properties</div>
                                {selectedElement.text ? 
                                <div id="text-properties">
                                    <div className="input row">
                                        <div className="input-field property col s12">
                                            <label className="active" htmlFor="text">Text</label>
                                            <input className="active" type="text" name="text" id="text" 
                                                value={selectedElement.text.contents}
                                                onChange={(event) => this.handleChangeProperties(event)} />
                                        </div>
                                    </div>
                                    <div className="input row">
                                        <div className="input-field property col s12">
                                            <label className="active" htmlFor="font-size">Font size</label>
                                            <input className="active" type="text" name="font-size" id="font-size" 
                                                value={selectedElement.text.font_size} 
                                                onChange={(event) => this.handleChangeProperties(event)} />
                                        </div>
                                    </div>
                                    <div className="input row">
                                        <div className="input-field property col s12">
                                            <label className="active">Text color</label>
                                            <div>
                                                <div className="color-picker-swatch" onClick={ this.handleClickColorPicker }>
                                                    <div className="color-picker-color" style={{background: selectedElement.text.color}} />
                                                </div>
                                                        { this.state.displayColorPicker ? <div className="color-picker-popover">
                                                        <div className="color-picker-cover" onClick={ this.handleClose }/>
                                                        <ChromePicker color={ selectedElement.text.color } 
                                                                      disableAlpha={true}
                                                                      onChange={ (event) => this.handleChangeColor(event, "text-color") } />
                                                </div> : null }
                                            </div>
                                        </div>
                                    </div>
                                </div>: null}
                        </div>
                        : null}
                    </div>
                </div>
            );
        } catch (e) {
            console.log(e);
            console.log("Redirecting...");
            return <Redirect to="/" />;
        }
    }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { wireframes } = state.firestore.data;
  const wireframe = wireframes ? wireframes[id] : null;

  if (wireframe)
    wireframe.id = id;

  return {
    wireframes,
    wireframe,
    auth: state.firebase.auth,
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'wireframes' },
  ]),
)(EditScreen);