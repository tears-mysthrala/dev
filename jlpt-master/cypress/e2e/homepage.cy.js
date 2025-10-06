describe('JLPT Master Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the homepage', () => {
    cy.contains('JLPT Master').should('be.visible');
  });

  it('should have navigation links', () => {
    cy.contains('Vocabulary').should('be.visible');
    cy.contains('Kanji').should('be.visible');
    cy.contains('Grammar').should('be.visible');
    cy.contains('Flashcards').should('be.visible');
  });

  it('should have a search bar', () => {
    cy.get('input[placeholder*="search"]').should('be.visible');
  });

  it('should have theme toggle', () => {
    cy.get('button[aria-label*="theme"]').should('be.visible');
  });

  it('should be accessible', () => {
    // Check for skip link
    cy.get('a[href="#main-content"]').should('exist');

    // Check for proper heading hierarchy
    cy.get('h1').should('have.length.at.least', 1);
    cy.get('h2').should('have.length.at.least', 1);

    // Check for ARIA labels
    cy.get('[aria-label]').should('have.length.at.least', 5);
  });
});