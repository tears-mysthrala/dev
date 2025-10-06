describe('Navigation', () => {
  it('should navigate to vocabulary page', () => {
    cy.visit('/');
    cy.contains('Vocabulary').click();
    cy.url().should('include', '/vocab');
    cy.contains('Vocabulary Learning').should('be.visible');
  });

  it('should navigate to kanji page', () => {
    cy.visit('/');
    cy.contains('Kanji').click();
    cy.url().should('include', '/kanji');
    cy.contains('Kanji Learning').should('be.visible');
  });

  it('should navigate to grammar page', () => {
    cy.visit('/');
    cy.contains('Grammar').click();
    cy.url().should('include', '/grammar');
    cy.contains('Grammar Learning').should('be.visible');
  });

  it('should navigate to flashcards page', () => {
    cy.visit('/');
    cy.contains('Flashcards').click();
    cy.url().should('include', '/flashcards');
    cy.contains('Flashcard Practice').should('be.visible');
  });

  it('should navigate back to home', () => {
    cy.visit('/vocab');
    cy.contains('JLPT Master').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});