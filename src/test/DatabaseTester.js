import React from 'react'
import { connect } from 'react-redux';
import wireframeJson from './TestWireframeData.json'
import { getFirestore } from 'redux-firestore';

class DatabaseTester extends React.Component {

    // NOTE, BY KEEPING THE DATABASE PUBLIC YOU CAN
    // DO THIS ANY TIME YOU LIKE WITHOUT HAVING
    // TO LOG IN
    handleClear = () => {
        const fireStore = getFirestore();
        fireStore.collection('wireframes').get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                console.log("deleting " + doc.id);
                fireStore.collection('wireframes').doc(doc.id).delete();
            })
        });
    }

    handleReset = () => {
        const fireStore = getFirestore();

        for (let i = wireframeJson.wireframes.length - 1; i >= 0; i--) {
            let wireframe = wireframeJson.wireframes[i];
            let id = i.toString();

            fireStore.collection('wireframes').doc(id).set({
                name: wireframe.name,
                owner: wireframe.owner, 
                width: wireframe.width,
                height: wireframe.height,
                elements: wireframe.elements,
                timeStamp: Date.now(),  // Last accessed
                order: parseInt(id)
            }).then(() => {
                console.log("DATABASE RESET");
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    render() {
        return (
            <div>
                <button onClick={this.handleClear}>Clear Database</button>
                <button onClick={this.handleReset}>Reset Database</button>
            </div>)
    }
}

const mapStateToProps = function (state) {
    return {
        auth: state.firebase.auth,
        firebase: state.firebase
    };
}

export default connect(mapStateToProps)(DatabaseTester);