import { Component, createElement } from "react";

import { AliasTagContainer } from "./components/AliasTagsContainer";
import "./ui/AliasTags.css";

export class AliasTags extends Component {
    render() {
        return <AliasTagContainer {...this.props}/>;
    }
}
