import React from 'react';
import { Link } from 'react-router-dom';

class WireframeCard extends React.Component {

    render() {
        const { wireframe } = this.props;
        
        return (
            <Link to={'/wireframe/' + wireframe.id} key={wireframe.id}>
                <div className="card z-depth-1 wireframe-link">
                    <div className="card-content grey-text text-darken-3">
                        <div className="row">
                            <div className="card-title col s10">{wireframe.name}</div>
                            <i className="material-icons delete-wireframe col s2" onClick={(event) => this.props.handleDeleteWireframe(event, wireframe.id)}>close</i>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }
}
export default WireframeCard;