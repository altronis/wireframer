import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import {ToastContainer, toast} from 'react-toastify';
import { Modal } from 'react-materialize';
import WireframeElement from './WireframeElement'
import 'react-toastify/dist/ReactToastify.css';

class EditScreen extends Component {
    state = {
        name: this.props.wireframe.name,
        owner: this.props.wireframe.owner,
        wireframe: this.props.wireframe,
        zoomLevel: 1.0,
        needToSave: false,
        redirect: false
    }

    notify = (message, color) => {
        toast(message, {
            position: toast.POSITION.BOTTOM_LEFT,
            className: color + '-background',
            bodyClassName: 'message',
            progressClassName: 'progress-bar'
        });
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

        try {
            let elements = this.state.wireframe.elements;

            const trigger = <i className="icon-button material-icons">close</i>

            return (
                <div id="editor" className="container grey lighten-1">
                    <ToastContainer />

                    <div className="row">
                        <div id="leftbar" className="container white col l2 s3">
                            <div className="blue z-depth-1" id="actions">
                                <i className="icon-button material-icons" onClick={this.handleZoom.bind(this, 2)}>zoom_in</i>
                                <i className="icon-button material-icons" onClick={this.handleZoom.bind(this, 0.5)}>zoom_out</i>
                                <i className="icon-button material-icons" onClick={this.handleSave}>save</i>
                                {this.state.needToSave ? 
                                    <Modal header="Close without saving?" trigger={trigger}
                                        actions={
                                            <div className="buttons">
                                                <span id="yes_button" className="dialog_button" onClick={this.handleClose}>YES</span>
                                                <span id="no_button" className="dialog_button modal-close">NO</span>
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
                                 <div class="add-element" onClick={this.handleNew.bind(this, "container")}>
                                    <div id="example-container"></div>
                                    <p class="element-type">Container</p>
                                 </div>
                                 <div class="add-element" onClick={this.handleNew.bind(this, "label")}>
                                    <div >Prompt for input:</div>
                                    <p class="element-type">Label</p>
                                 </div>
                                 <div class="add-element" onClick={this.handleNew.bind(this, "button")}>
                                    <div id="example-button">Submit</div>
                                    <p class="element-type">Button</p>
                                 </div>
                                 <div class="add-element" onClick={this.handleNew.bind(this, "textfield")}>
                                    <div id="example-textfield">Input</div>
                                    <p class="element-type">Textfield</p>
                                 </div>
                            </div>
                        </div>

                        <div id="edit-window" className="container col l8 s6">
                            <div id="wireframe-window" style={windowStyle}>
                                {
                                    elements && elements.map(element => (
                                        <WireframeElement element={element} zoomLevel={this.state.zoomLevel}/>
                                    ))
                                }
                            </div>
                        </div>
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