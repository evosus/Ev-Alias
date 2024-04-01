import { Component, createElement } from "react";
import { AliasTagsContainer } from "./components/AliasTagsContainer";

export class preview extends Component {
    render() {
        return <AliasTagsContainer masterTagsList={this.props.masterTagsList} delimiter={this.props.delimiter}/>;
    }
}

export function getPreviewCss() {
    return require("./ui/AliasTags.css");
}
