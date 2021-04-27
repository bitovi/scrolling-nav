/// <reference types="cypress" />

context('Attributes - scrollable-container-selector', () => {
    beforeEach(() => {
        cy.visit('cypress/html/scrollable-container-selector.html')
    });

    it('Should find the headers in the sections identified in the "scrollable-container-selctor" attribute', () => {
        cy.get('scrolling-nav > ul')
            .children()
            .should('have.length', 4)
    });

    it('Should updated the URL fragment after scrolling to bottom section', async () => {
        cy.get('#scroll-to-test')
            .scrollIntoView()
            .then(el => {
                cy.window().location().hash().should('contain', el.attr('data-pretty-url'));
            });
    });
});

context('Attributes - heading-selector', () => {
    beforeEach(() => {
        cy.visit('cypress/html/heading-selector.html')
    });

    it('Should only inject items into the navbar that match the selector identified by the "heading-selector" attribute', () => {
        cy.get('scrolling-nav > ul')
            .children('li')
            .should('have.length', 4);
    });
});
