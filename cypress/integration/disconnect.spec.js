/// <reference types="cypress" />

context('Connect & Disconnect', () => {
    beforeEach(() => {
        cy.visit('demo/disconnect.html')
    });

    it('should add and remove scroll and resize event listeners', () => {

        // store all listeners
        let originalListeners;
        cy.window().then(win => {
            const scrollAndResizeListeners = win.addListeners.filter(x => x.event === 'scroll' || x.event === 'resize');
            originalListeners = JSON.parse(JSON.stringify(scrollAndResizeListeners));
        });

        // add element
        cy.get('#connect-btn').click({ force: true });
        cy.get('scrolling-nav').should('exist');

        // ensure new listeners added
        cy.window().then(win => {
            const scrollAndResizeListeners = win.addListeners.filter(x => x.event === 'scroll' || x.event === 'resize');
            expect(scrollAndResizeListeners.length).to.be.greaterThan(originalListeners.length);
        });

        // remove element
        cy.get('#disconnect-btn').click({ force: true });
        cy.get('scrolling-nav').should('not.exist');

        // // ensure current listeners === original
        cy.window().then(win => {
            const scrollAndResizeListeners = win.addListeners.filter(x => x.event === 'scroll' || x.event === 'resize');
            expect(scrollAndResizeListeners.length).to.be.equal(originalListeners.length);
        });

    });

});
