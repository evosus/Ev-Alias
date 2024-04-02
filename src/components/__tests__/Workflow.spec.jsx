/* eslint-disable no-undef */
/* eslint-disable arrow-body-style */
import { createElement } from "react";
import { shallow } from "enzyme";

// eslint-disable-next-line sort-imports
import { Workflow } from "../Workflow";

describe("Workflow", () => {
    const createWorkflow = props => shallow(<Workflow {...props} />);

    it("should render the structure correctly", () => {
        const workflowProps = {
            tagText: "TestTagText"
        };
        const workflow = createWorkflow(workflowProps);

        expect(
            workflow.equals(
                <div className="ev-workflow-container">
                    <button
                        className="ev-workflow-admin-button ev-workflow-admin-button-add"
                        onClick={addTag.bind(this)}
                    >
                        <i className="mdi mdi-plus"></i>Add
                    </button>
                    {tagComponents.map(tag => {
                        return tag;
                    })}
                    {tagCount - limit > 0 ? (
                        <button
                            className="ev-workflow-admin-button ev-workflow-admin-button-view-all"
                            onClick={() => onClickMoreAction.execute()}
                        >
                            <i className="mdi mdi-open-in-new"></i>
                            {tagCountDisplay} more
                        </button>
                    ) : null}
                </div>
            )
        ).toEqual(true);
    });
});
