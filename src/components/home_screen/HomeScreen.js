import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import WireframeLinks from './WireframeLinks'
import { getFirestore } from 'redux-firestore';

let needToUpdate;

class HomeScreen extends Component {
    state = {
        // ID of the new wireframe
        newWireframeID: null,
    }

    handleNewWireframe = () => {
        const fireStore = getFirestore();
        let id = "0";  // ID of the new wireframe
        let owner = this.props.auth.email;

        // Find the ID for a new wireframe
        fireStore.collection("wireframes").orderBy("order", "desc").limit(1).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                id = (doc.data().order + 1).toString();
            });
        })
        // Add a new wireframe
        .then(function() {fireStore.collection('wireframes').doc(id).set({
            name: "Unknown",
            owner: owner, 
            width: 800,
            height: 600,
            elements: [],
            order: parseInt(id),
            timeStamp: Date.now()  // Last accessed
        }) })
        // Update the newWireframeID state variable so that the component gets re-rendered
        .then(() => {
                needToUpdate = true;  // We need to wait for the store to get updated
                this.setState({newWireframeID: id});
        });
    }

    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        // Only redirect to list screen if store is updated
        if (this.state.newWireframeID && !needToUpdate) {
            return <Redirect to={"/wireframe/" + this.state.newWireframeID} />;
        }

        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m4">
                        <WireframeLinks />
                    </div>

                    <div className="col s8">
                        <div className="banner">
                            wireframer
                        </div>
                        <div className="card z-depth-1 new-wireframe" onClick={this.handleNewWireframe}>
                            <div className="card-content grey-text text-darken-3">
                                <span className="card-title">Create a New Wireframe</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    needToUpdate = false;  // No longer need to update store
    return {
        wireframes: state.firestore.ordered.wireframes,
        auth: state.firebase.auth
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
      { collection: 'wireframes' },
    ]),
)(HomeScreen);