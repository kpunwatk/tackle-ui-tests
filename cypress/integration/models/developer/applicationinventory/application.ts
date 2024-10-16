/*
Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import {
    applicationInventory,
    tdTag,
    trTag,
    button,
    createNewButton,
    deleteAction,
} from "../../../types/constants";
import { navMenu } from "../../../views/menu.view";
import {
    applicationNameInput,
    applicationDescriptionInput,
    applicationBusinessServiceSelect,
    applicationTagsSelect,
    applicationCommentInput,
    editButton,
    actionButton,
    selectBox,
    sourceRepository,
    branch,
    rootPath,
    group,
    artifact,
    version,
    packaging,
} from "../../../views/applicationinventory.view";
import * as commonView from "../../../views/common.view";
import {
    clickByText,
    inputText,
    click,
    submitForm,
    cancelForm,
    selectFormItems,
    checkSuccessAlert,
    performRowActionByIcon,
    selectUserPerspective,
} from "../../../../utils/utils";
export class Application {
    name: string;
    business: string;
    description?: string;
    tags?: Array<string>;
    comment?: string;
    analysis?: boolean;
    repoType?: string;
    sourceRepo?: string;
    branch?: string;
    rootPath?: string;
    group?: string;
    artifact?: string;
    version?: string;
    packaging?: string;

    constructor(
        name: string,
        business: string,
        description?: string,
        comment?: string,
        tags?: Array<string>,
        analysis?: boolean,
        repoType?: string,
        sourceRepo?: string,
        branch?: string,
        rootPath?: string,
        group?: string,
        artifact?: string,
        version?: string,
        packaging?: string
    ) {
        this.name = name;
        this.business = business;
        if (description) this.description = description;
        if (comment) this.comment = comment;
        if (tags) this.tags = tags;
        if (analysis) this.analysis = analysis;
        if (repoType) this.repoType = repoType;
        if (sourceRepo) this.sourceRepo = sourceRepo;
        if (branch) this.branch = branch;
        if (rootPath) this.rootPath = rootPath;
        if (group) this.group = group;
        if (artifact) this.artifact = artifact;
        if (version) this.version = version;
        if (packaging) this.packaging = packaging;
    }

    //Navigate to the Application inventory
    open(): void {
        selectUserPerspective("Developer");
        clickByText(navMenu, applicationInventory);
    }

    protected fillName(name: string): void {
        inputText(applicationNameInput, name);
    }

    protected fillDescription(description: string): void {
        inputText(applicationDescriptionInput, description);
    }

    protected fillComment(comment: string): void {
        inputText(applicationCommentInput, comment);
    }
    protected selectBusinessService(service: string): void {
        selectFormItems(applicationBusinessServiceSelect, service);
    }

    protected selectTags(tags: Array<string>): void {
        tags.forEach(function (tag) {
            selectFormItems(applicationTagsSelect, tag);
        });
    }

    create(cancel = false): void {
        cy.contains("button", createNewButton, { timeout: 20000 }).should("be.enabled").click();
        if (cancel) {
            cancelForm();
        } else {
            this.fillName(this.name);
            this.selectBusinessService(this.business);
            if (this.description) {
                this.fillDescription(this.description);
            }
            if (this.comment) {
                this.fillComment(this.comment);
            }
            if (this.tags) {
                this.selectTags(this.tags);
            }

            //Fields relevant to source code analysis
            if (this.sourceRepo) {
                cy.contains("span", "Source code").click();
                inputText(sourceRepository, this.sourceRepo);
                if (this.branch) inputText(branch, this.branch);
                if (this.rootPath) inputText(rootPath, this.rootPath);
            }

            //Fields relevant to binary mode analysis
            if (this.group) {
                cy.contains("span", "Binary").click();
                inputText(group, this.group);
                if (this.artifact) inputText(artifact, this.artifact);
                if (this.version) inputText(version, this.version);
                if (this.packaging) inputText(packaging, this.packaging);
            }
            submitForm();
            checkSuccessAlert(
                commonView.successAlertMessage,
                `Success! ${this.name} was added as a(n) application.`
            );
        }
    }

    edit(
        updatedValues: {
            name?: string;
            description?: string;
            business?: string;
            tags?: Array<string>;
            comment?: string;
        },
        cancel = false
    ): void {
        cy.wait(2000);
        performRowActionByIcon(this.name, editButton);

        if (cancel) {
            cancelForm();
        } else {
            if (updatedValues.name && updatedValues.name != this.name) {
                this.fillName(updatedValues.name);
                this.name = updatedValues.name;
            }
            if (updatedValues.description && updatedValues.description != this.description) {
                this.fillDescription(updatedValues.description);
                this.description = updatedValues.description;
            }
            if (updatedValues.business && updatedValues.business != this.business) {
                this.selectBusinessService(updatedValues.business);
                this.business = updatedValues.business;
            }
            if (updatedValues.tags && updatedValues.tags != this.tags) {
                this.selectTags(updatedValues.tags);
                this.tags = updatedValues.tags;
            }
            if (updatedValues.comment && updatedValues.comment != this.comment) {
                this.fillComment(updatedValues.comment);
                this.comment = updatedValues.comment;
            }
            if (updatedValues) {
                submitForm();
            }
        }
    }

    delete(cancel = false): void {
        cy.wait(2000);
        cy.get(tdTag)
            .contains(this.name)
            .parent(tdTag)
            .parent(trTag)
            .within(() => {
                click(actionButton);
                cy.wait(500);
                clickByText(button, deleteAction);
            });

        if (cancel) {
            cancelForm();
        } else {
            click(commonView.confirmButton);
            cy.wait(2000);
        }
    }

    selectApplication(): void {
        cy.wait(4000);
        cy.get(tdTag)
            .contains(this.name)
            .parent(tdTag)
            .parent(trTag)
            .within(() => {
                click(selectBox);
                cy.wait(2000);
            });
    }
}
