/* eslint-disable no-alert */
// eslint-disable-next-line no-unused-vars
import { Component, createElement, useEffect, useRef, useState } from "react";

export function Tag(props) {
    const input = useRef(null);

    useEffect(() => {
        input.current.innerHTML = props.tag;
    }, [props.tag]);

    const deleteTag = () => {
        if (!props.ReadOnly) {
            const confirmed = window.confirm("Confirm delete?");
            if (confirmed) {
                props.deleteTag(props.index, props.tag);
            }
        }
    };

    return (
        <div className="ev-aliastags-tag-padding">
            <div className="ev-aliastags-tag-container">
                <span ref={input} tabIndex="0" className="input ev-aliastags-input" role="textbox"></span>
                <button className="ev-aliastags-button ev-aliastags-icon ev-aliastags-delete" onClick={deleteTag}>
                    <i className="mdi mdi-close"></i>
                </button>
            </div>
        </div>
    );
}
