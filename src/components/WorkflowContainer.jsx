/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
import { Component, createElement, useEffect, useState, useRef } from "react";
import { Tag } from "./Tag";
import { v4 as uuidv4 } from "uuid";
import * as mx from "mendix";

export function WorkflowContainer(props) {
    const { onClickMoreAction } = props;
    const { onTagAddAction } = props;
    const [mounted, setMounted] = useState(false);
    const [tagsArray, setTagsArray] = useState([]);
    const [masterTagsList, setMasterTagsList] = useState(props.masterTagsList.value ?? "");
    const [tagComponents, setTagComponents] = useState([]);
    const [limit] = useState(props.limit ?? 5); // configurable in widget now
    const [delimiter] = useState(props.delimiter ?? ",");
    const [newTag, setNewTag] = useState(props.NewTag ?? ""); // new entity attribute for managing newTag value
    const [tagCount, setTagCount] = useState(0);
    const [tagCountDisplay, setTagCountDisplay] = useState("");

    useEffect(() => {
        if (mounted) {
            updateAllTags(props.masterTagsList.value);
        }
        return () => {};
    }, [props.masterTagsList, mounted]);

    useEffect(() => {
        setMounted(true);
        return () => {};
    }, []);

    const saveTag = (index, oldValue, newValue) => {
        const fullTagsArray = props.masterTagsList.value.split(delimiter).filter(i => i);
        fullTagsArray.splice(index, 1, newValue);
        const updatedMasterTagsList = fullTagsArray.join(delimiter);
        props.masterTagsList.setValue(updatedMasterTagsList);
        if (props.onChangeAction) {
            props.onChangeAction.execute(); // call onChange microflow
        }
        return true;
    };

    const deleteTag = (index, value) => {
        const fullTagsArray = props.masterTagsList.value.split(delimiter).filter(i => i);
        fullTagsArray.splice(index, 1);
        const updatedMasterTagsList = fullTagsArray.join(delimiter);
        props.masterTagsList.setValue(updatedMasterTagsList);
        if (props.onChangeAction) {
            props.onChangeAction.execute(); // call onChange microflow
        }
        updateAllTags(updatedMasterTagsList);
    };

    const updateAllTags = value => {
        if (value !== undefined) {
            const tagCount = value.split(delimiter).filter(i => i).length;
            var tagCountDisplay = tagCount - limit;
            if (tagCount - limit > 99) {
                tagCountDisplay = "99+";
            }
            const tagsArraySliced = value
                .split(delimiter)
                .filter(i => i)
                .slice(0, limit);
            const newTagComponents = tagsArraySliced.map((tag, index) => (
                <Tag
                    key={uuidv4()}
                    tag={tag}
                    index={index}
                    saveTag={saveTag.bind(this)}
                    deleteTag={deleteTag.bind(this)}
                />
            ));
            setMasterTagsList(value);
            setTagsArray(tagsArraySliced);
            setTagComponents(newTagComponents);
            setTagCount(tagCount);
            setTagCountDisplay(tagCountDisplay);
        }
    };

    const addTag = () => {
        // set the value of newTag attribute
        props.newTag.setValue(newTag);

        if (props.onTagAddAction) {
            props.onTagAddAction.execute(); // call onAdd microflow
        }
        setNewTag(""); // clear the input field after adding the tag
    };

    const handleNewTagChange = event => {
        const inputValue = event.target.value;
        setNewTag(inputValue);
        console.log("New Tag Value:", inputValue);
    };

    const inputRef = useRef(null);

    const handleBlur = () => {
        // delay on clearing input value to allow user to click the + icon for add
        setTimeout(() => {
            if (!inputRef.current.contains(document.activeElement)) {
                // clear input value if click is not on the input
                setNewTag(""); // clear  input field when it loses focus
            }
        }, 200); // clear-delay value
    };

    return (
        <div className="ev-workflow-container">
            <button className="ev-workflow-admin-button ev-workflow-admin-button-add">
                <input
                    type="text"
                    placeholder="add a tag"
                    value={newTag}
                    onChange={handleNewTagChange}
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            addTag();
                        }
                    }}
                    onBlur={handleBlur}
                    ref={inputRef}
                />
                <span onClick={addTag.bind(this)}>
                    <i className="mdi mdi-plus"></i>
                </span>
            </button>
            {tagComponents.map(tag => tag)}
            {tagCount - limit > 0 ? (
                <button
                    className="ev-workflow-admin-button ev-workflow-admin-button-view-all"
                    onClick={() => onClickMoreAction.execute()} // call tag overflow microflow
                >
                    <i className="mdi mdi-open-in-new"></i>
                    {tagCountDisplay} more
                </button>
            ) : null}
        </div>
    );
}
