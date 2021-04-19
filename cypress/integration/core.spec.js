/// <reference types="cypress" />

const files = [
    {
        path: 'cypress/html/index.html',
        name: "Attributes: none"
    },
    {
        path: 'cypress/html/scrollable-container-selector.html',
        name: 'Attributes: scrollable-container-selector'
    },
    {
        path: 'cypress/html/heading-selector.html',
        name: 'Attributes: heading-selector'
    }
];

files.forEach((file) => {
    context(`Core Functionality | ${file.name}`, () => {
        beforeEach(() => {
            cy.visit(file.path)
        })

        it('<scrolling-nav /> should exist', () => {
            cy.get('scrolling-nav').should('exist');
        });

        it('There is always an active class applied', () => {
            cy.get('scrolling-nav > ul > li')
                .should('have.class', 'scrolling-nav-active');
        });

        it('Has the right HTML structure', () => {
            cy.get('scrolling-nav')
                .first()
                .children('ul')
                .should('have.length', 1);

            cy.get('scrolling-nav > ul')
                .first()
                .children('li')
                .should('have.length.above', 0);

            cy.get('scrolling-nav > ul > li')
                .first()
                .children('a')
                .should('have.length.above', 0);
        });

        it('Clicking a nav item should scroll to that section heading', () => {
            cy.get('scrolling-nav > ul > li')
                .last()
                .click({ force: true });

            cy.get('#scroll-to-test')
                .should('be.visible');
        });

        it('Clicking a nav item should make it active', () => {
            cy.get('scrolling-nav > ul > li')
                .last()
                .click({ force: true })
                .should('have.class', 'scrolling-nav-active');
        });

        // it('Clicking a nav item should update the URL fragment', () => {
        //     cy.get('scrolling-nav > ul > li')
        //         .first()
        //         .click()
        //         .should('have.class', 'scrolling-nav-active');

        //     const linkEl = cy.get('scrolling-nav > ul > li').first().children();
            
        //     cy.url().should('include', '');
            
        //     // cy.log('linkEl', linkEl);
        //     // cy.get('scrolling-nav > ul > li > a:first')
        //     cy.get('scrolling-nav > ul > li').first().then(e => {
        //         cy.window().location().hash().should('contain', 'test-h2-1');
        //     });
        // });

        it('Follows accessibility recommendations', () => {
            cy.get('scrolling-nav')
                .should('have.attr', 'role', 'navigation');
        });
    })
})