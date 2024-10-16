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
/// <reference types="cypress" />

import {
    login,
    clickByText,
    hasToBeSkipped,
    preservecookies,
    createMultipleBusinessServices,
    deleteApplicationTableRows,
    deleteAllBusinessServices,
} from "../../../../../utils/utils";
import { button, createNewButton } from "../../../../types/constants";
import { ApplicationInventory } from "../../../../models/developer/applicationinventory/applicationinventory";

import { BusinessServices } from "../../../../models/developer/controls/businessservices";

var businessservicesList: Array<BusinessServices> = [];

describe("Source Analysis", { tags: "@tier1" }, () => {
    before("Login", function () {
        // Prevent hook from running, if the tag is excluded from run
        if (hasToBeSkipped("@tier1")) return;

        // Perform login
        login();
        businessservicesList = createMultipleBusinessServices(1);
    });

    beforeEach("Persist session", function () {
        // Save the session and token cookie for maintaining one login session
        preservecookies();

        // Interceptors
        cy.intercept("POST", "/hub/application*").as("postApplication");
        cy.intercept("GET", "/hub/application*").as("getApplication");
    });

    after("Perform test data clean up", function () {
        // Prevent hook from running, if the tag is excluded from run
        deleteAllBusinessServices();
        deleteApplicationTableRows();
    });

    it("Source Analysis", function () {
        // Navigate to application inventory page and click "Create New" button
        ApplicationInventory.analysis();
        clickByText(button, createNewButton);
    });
});
