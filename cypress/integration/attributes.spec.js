/// <reference types="cypress" />

context('Attributes - scrollable-container-selector', () => {
    beforeEach(() => {
        cy.visit('cypress/html/attributes/scrollable-container-selector.html')
    });

    it('Should find the headers in the sections identified in the "scrollable-container-selctor" attribute', () => {
        cy.get('sticky-nav > ul')
            .children()
            .should('have.length', 4)
    });

    it('Should updated the URL fragment after scrolling to bottom section', () => {
        cy.get('#scroll-to-test')
            .scrollIntoView();

        cy.window().location().hash().should('contain', '#scroll-to-test');
    });
});

context('Attributes - heading-selector', () => {
    beforeEach(() => {
        cy.visit('cypress/html/attributes/heading-selector.html')
    });

    it('Should only inject items into the navbar that match the selector identified by the "heading-selector" attribute', () => {
        cy.get('sticky-nav > ul')
            .children("li")
            .should('have.length', 4);
    });
});

context('Attributes - stick', () => {
    beforeEach(() => {
        cy.visit('cypress/html/attributes/stick.html')
    });

    it('Should not add "sticky-nav-fixed" class - even though scrolled down long page', () => {
        cy.scrollTo('bottom');

        cy.get('sticky-nav')
            .should('not.have.class', 'sticky-nav-fixed');
    });
});