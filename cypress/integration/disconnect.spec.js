/// <reference types="cypress" />

context('Connect & Disconnect', () => {
    beforeEach(() => {
        cy.visit('demo/disconnect.html')
    });

    it('should add and remove scroll and resize event listeners', () => {

        cy.get('#connect-btn').click();

        cy.get('scrolling-nav').should('exist');

        cy.window().then(win => {
            const addedListeners = win.addListeners.filter(({ event }) => event === 'scroll' || event === 'resize');
            expect(addedListeners.length).to.be.greaterThan(1);
        });

        cy.get('#disconnect-btn').click();

        cy.get('scrolling-nav').should('not.exist');

        cy.window().then(win => {
            const removedListeners = win.removeListeners.filter(({ event }) => event === 'scroll' || event === 'resize');
            expect(removedListeners.length).to.be.greaterThan(1);
        });

    });

});
