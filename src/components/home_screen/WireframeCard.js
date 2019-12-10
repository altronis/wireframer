import React from 'react';

class WireframeCard extends React.Component {

    render() {
        const { wireframe } = this.props;
        
        return (
            <div className="card z-depth-1 wireframe-link">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">{wireframe.name}</span>
                </div>
            </div>
        );
    }
}
export default WireframeCard;