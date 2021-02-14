/// <reference types="Cypress" />

beforeEach(() => {
  cy.visit('http://localhost:4200')

})

describe('Recipe List', ()=> {
  it('verfy url', () => {
    cy.location('pathname').should('equal', '/recipe')
  })

  it('show notified panel after 10 seconds', () => {
    cy.wait(10000)
    cy.get('[data-cy=notification]').should('be.visible')
  })

  it('notification information can not be shown within 10 seconds', () => {
    cy.wait(2000)
    cy.get('[data-cy=notification]').should('not.exist')
  })

  it('click search button', () => {
    cy.get('[data-cy=ingredient]').clear().type('onion{enter}')
    cy.get('[data-cy=ingredient]').type('tomato{enter}')

    cy.get('[data-cy=course]').type('beef');
    cy.get('[data-cy=search]').click();
    cy.waitUntil( () => {
      return cy.get('[data-cy=recipes]').should('be.visible')
    })
    cy.wait(4000)
    cy.get('[data-cy=recipes]>mat-card').then((element) => {
      const length = element.length;
      for(let i =0; i< length; i++){
        expect(element.eq(i)).to.contain('Beef')
      }
    })

    cy.wait(6000)
    cy.get('[data-cy=search]').click();
    cy.get('[data-cy=notification]').should('not.exist')

    cy.wait(10000)
    cy.get('[data-cy=update]').click();
    cy.get('[data-cy=notification]').should('not.exist')
  })
})
