// eslint-disable-next-line no-unused-vars
import { Component, createElement, useEffect, useRef, useState } from "react";

export function Tag(props) {
    const input = useRef(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const setSpanValue = value => {
        input.current.innerHTML = value;
    };

    useEffect(() => {
        setSpanValue(props.tag);
    }, [props.tag]);

    const deleteTag = () => {
        setShowConfirmDialog(true);
    };

    const confirmDeleteTag = () => {
        props.deleteTag(props.index, props.tag);
        setShowConfirmDialog(false);
    };

    const cancelDeleteTag = () => {
        setShowConfirmDialog(false);
    };

    return (
        <div className="ev-workflow-tag-padding">
            <div className="ev-workflow-tag-container">
                <span ref={input} tabIndex="0" className="input ev-workflow-input" role="textbox"></span>
                <button className="ev-workflow-button ev-workflow-icon ev-workflow-delete" onClick={deleteTag}>
                    <i className="mdi mdi-close"></i>
                </button>
            </div>
            {showConfirmDialog && (
                <div className="confirmation-modal" style={{ top: "-275%" }}>
                    <p>Confirm delete?</p>
                    <button onClick={cancelDeleteTag}>No</button>
                    <button onClick={confirmDeleteTag}>Yes</button>
                </div>
            )}
        </div>
    );
}
