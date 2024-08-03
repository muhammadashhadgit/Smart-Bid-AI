describe("Deactivate Functionality", () => {
  it("Account deactivated successfully", () => {
    cy.visit(Cypress.env("base_url") + "/login");
    cy.wait(2000);
    cy.on("uncaught:exception", (err, runnable) => {
      console.log("Error", err);
      return false;
    });
    cy.get("input[data-cy=email-login]").type("nafeymoiz007@gmail.com");
    cy.get("input[data-cy=password-login]").type("abcd1234");
    cy.get("input[data-cy=customer-radio]").check();
    cy.get("button[data-cy=login-button]").click();
    cy.wait(2000);
    cy.url().should("eq", "http://localhost:8000/");
    cy.get("#profile-icon").click();
    cy.get("#profile-id").click();
    cy.url().should("eq", "http://localhost:8000/CustomerProfile");
    cy.get("#delete-button").click();
    cy.get("#confirm-button").click();
    cy.url().should("eq", "http://localhost:8000/login");
    cy.get("input[data-cy=email-login]").type("nafeymoiz007@gmail.com");
    cy.get("input[data-cy=password-login]").type("abcd1234");
    cy.get("input[data-cy=customer-radio]").check();
    cy.get("button[data-cy=login-button]").click();
    cy.contains("Incorrect Email or Password. Please try again.").should(
      "exist"
    );
  });
});
