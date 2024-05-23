/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
import { Component, createElement, useEffect, useState, useRef } from "react";
import { Tag } from "./Tag";
import { v4 as uuidv4 } from "uuid";
import * as mx from "mendix";

export function AliasTagContainer(props) {
    const [charLimit] = useState(props.charLimit ?? 1000);
    const { onClickMoreAction, ReadOnly } = props;
    const [mounted, setMounted] = useState(false);
    const [tagsArray, setTagsArray] = useState([]);
    const [masterTagsList, setMasterTagsList] = useState(props.masterTagsList.value ?? "");
    const [tagComponents, setTagComponents] = useState([]);
    const [tagLimit] = useState(props.tagLimit ?? 10); // configurable in widget now
    const [delimiter] = "|";
    const [newTag, setNewTag] = useState(props.NewTag ?? ""); // new entity attribute for managing newTag value
    const [tagCount, setTagCount] = useState(0);
    const [tagCountDisplay, setTagCountDisplay] = useState("");
    const [autoSave] = useState(props.autoSave ?? false);
    const [errorMessage, setErrorMessage] = useState("");

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
        if (!ReadOnly) {
            const fullTagsArray = props.masterTagsList.value.split(delimiter).filter(i => i);
            fullTagsArray.splice(index, 1, newValue);
            const updatedMasterTagsList = fullTagsArray.join(delimiter);
            props.masterTagsList.setValue(updatedMasterTagsList);
            //creating conditional execution of onChange action based on widget autoSave config
            const onChangeAction = autoSave ? props.onChangeActionAutoSaveTrue : props.onChangeActionAutoSaveFalse;
            if (onChangeAction) {
                onChangeAction.execute();
            }
            return true;
        }
        return false;
    };

    const deleteTag = (index, value) => {
        if (!ReadOnly) {
            const fullTagsArrayBefore = props.masterTagsList.value.split(delimiter).filter(i => i);
            //console.log("full tags array before delete:", fullTagsArrayBefore);
            const fullTagsArray = [...fullTagsArrayBefore];
            fullTagsArray.splice(index, 1);
            //console.log("full tags array after delete:", fullTagsArray);

            const updatedMasterTagsList = fullTagsArray.join(delimiter);
            props.masterTagsList.setValue(updatedMasterTagsList);
            //creating conditional execution of onChange action based on widget autoSave config
            const onChangeAction = autoSave ? props.onChangeActionAutoSaveTrue : props.onChangeActionAutoSaveFalse;
            if (onChangeAction) {
                onChangeAction.execute();
            }
            updateAllTags(updatedMasterTagsList);
        }
    };

    const updateAllTags = value => {
        if (value !== undefined) {
            const tagCount = value.split(delimiter).filter(i => i).length;
            var tagCountDisplay = tagCount - tagLimit;
            if (tagCount - tagLimit > 99) {
                tagCountDisplay = "99+";
            }
            const tagsArraySliced = value
                .split(delimiter)
                .filter(i => i)
                .slice(0, tagLimit);
            //console.log("tags array:", tagsArraySliced);
            const newTagComponents = tagsArraySliced.map((tag, index) => (
                <Tag
                    key={uuidv4()}
                    tag={tag}
                    index={index}
                    saveTag={saveTag.bind(this)}
                    deleteTag={deleteTag.bind(this)}
                    ReadOnly={ReadOnly}
                />
            ));
            setMasterTagsList(value);
            setTagsArray(tagsArraySliced);
            //console.log("tag components:", newTagComponents);
            setTagComponents(newTagComponents);
            setTagCount(tagCount);
            setTagCountDisplay(tagCountDisplay);
        }
    };

    const addTag = () => {
        if (!ReadOnly) {
            //set the value of newTag attribute
            props.newTag.setValue(newTag);
            //creating conditional execution of onTagAdd action based on widget autoSave config
            const onTagAddAction = autoSave ? props.onTagAddActionAutoSaveTrue : props.onTagAddActionAutoSaveFalse;
            if (onTagAddAction) {
                onTagAddAction.execute();
            }
            setNewTag(""); // clear the input field after adding the tag
        }
    };

    const handleNewTagChange = event => {
        if (!ReadOnly) {
            const inputValue = event.target.value;
            const pipeIndex = inputValue.indexOf("|");
            if (pipeIndex !== -1) {
                alert("The pipe character '|' is a reserved character and cannot be used.");
                return;
            }
            const tagsWithoutDelimiters = masterTagsList.split(delimiter).filter(tag => tag.trim() !== "");
            const tagsLengthWithoutDelimiters = tagsWithoutDelimiters.reduce((total, tag) => total + tag.length, 0);
            if (tagsLengthWithoutDelimiters + inputValue.length > charLimit) {
                alert(`Character limit exceeded. Maximum ${charLimit} characters.`);
                return;
            }
            if (inputValue.length > 100) {
                // check if input exceeds 100 char
                alert("Maximum character limit for tag value is 100.");
                return;
            }
            //console.log("No error");
            setNewTag(inputValue);
            setErrorMessage(""); // clear any previous error message
        }
    };

    const inputRef = useRef(null);

    const handleBlur = () => {
        //delay on clearing input value to allow user to click the + icon for add
        setTimeout(() => {
            if (!inputRef.current.contains(document.activeElement)) {
                //clear input value if click is not on the input
                setNewTag(""); // clear  input field when it loses focus
            }
        }, 200); //clear-delay value
    };

    return (
        <div className="ev-aliastags-container" style={{ paddingBottom: "4px" }}>
            {!ReadOnly && (
                <div className="new-tag-input-container">
                    <button className="ev-aliastags-admin-button ev-aliastags-admin-button-add">
                        <input
                            type="text"
                            placeholder="add an alias"
                            value={newTag}
                            onChange={handleNewTagChange}
                            onKeyDown={e => {
                                if (e.key === "Enter") {
                                    addTag();
                                }
                            }}
                            onBlur={handleBlur}
                            ref={inputRef}
                            style={{ marginBottom: "0", verticalAlign: "middle" }}
                        />
                        <span onClick={addTag.bind(this)}>
                            <i className="mdi mdi-plus"></i>
                        </span>
                    </button>
                </div>
            )}
            {tagComponents.map(tag => tag)}
            {tagCount - tagLimit > 0 ? (
                <button
                    className="ev-aliastags-admin-button ev-aliastags-admin-button-view-all"
                    onClick={() => onClickMoreAction.execute()} //call tag overflow
                >
                    <i className="mdi mdi-open-in-new"></i>
                    {tagCountDisplay} more
                </button>
            ) : null}
        </div>
    );
}
