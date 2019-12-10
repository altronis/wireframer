import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireframeCard from './WireframeCard';

class WireframeLinks extends React.Component {
    compare(first, second) {
        let firstTime = first.timeStamp;
        let secondTime = second.timeStamp;

        if (firstTime < secondTime)
            return 1;

        if (firstTime > secondTime)
            return -1;
        
        return 0;
    }

    render() {
        // Copy this.props.wireframes
        let wireframes;

        if (this.props.wireframes != null) {
            wireframes = [...this.props.wireframes];

            // Sort wireframes by decreasing timeStamp 
            wireframes.sort(this.compare);
        }

        return (
            <div className="section">
                {wireframes && wireframes.filter(wireframe => wireframe.owner === this.props.auth.email).map(wireframe => (
                    <Link to={'/wireframe/' + wireframe.id} key={wireframe.id}>
                        <WireframeCard wireframe={wireframe} />
                    </Link>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        wireframes: state.firestore.ordered.wireframes,
        auth: state.firebase.auth,
    };
};

export default compose(connect(mapStateToProps))(WireframeLinks);