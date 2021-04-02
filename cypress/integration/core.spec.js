/// <reference types="cypress" />

const files = [{
        path: 'cypress/html/index.html',
        name: "Attributes: none"
    },
    {
        path: 'cypress/html/attributes/scrollable-container-selector.html',
        name: 'Attributes: scrollable-container-selector'
    },
    {
        path: 'cypress/html/attributes/heading-selector.html',
        name: 'Attributes: heading-selector'
    },
    {
        path: 'cypress/html/attributes/stick.html',
        name: 'Attributes: stick'
    }
];

files.forEach((file) => {
    context(`Core Functionality | ${file.name}`, () => {
        beforeEach(() => {
            cy.visit(file.path)
        })

        it('<sticky-nav /> should exist', () => {
            cy.get('sticky-nav').should('exist');
        });

        it('There is always an active class applied', () => {
            cy.get('sticky-nav > ul > li')
                .should('have.class', 'sticky-nav-active');
        });

        it('Has the right HTML structure', () => {
            cy.get('sticky-nav')
                .first()
                .children('ul')
                .should('have.length', 1);

            cy.get('sticky-nav > ul')
                .first()
                .children('li')
                .should('have.length.above', 0);

            cy.get('sticky-nav > ul > li')
                .first()
                .children('a')
                .should('have.length.above', 0);
        });

        it('Clicking a nav item should scroll to that section heading', () => {
            cy.get('sticky-nav > ul > li')
                .last()
                .click();

            cy.get('#scroll-to-test')
                .should('be.visible');
        });

        it('Clicking a nav item should make it active', () => {
            cy.get('sticky-nav > ul > li')
                .last()
                .click()
                .should('have.class', 'sticky-nav-active');
        });

        it('Clicking a nav item should update the URL fragment', () => {
            cy.get('sticky-nav > ul > li')
                .first()
                .click()
                .should('have.class', 'sticky-nav-active');

            cy.window().location().hash().should('contain', '#sticky-nav-el-0');
        });

        it('Follows accessibility recommendations', () => {
            cy.get('sticky-nav')
                .should('have.attr', 'role', 'navigation');
        });
    })
})