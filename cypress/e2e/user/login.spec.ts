import {UserFactory} from '../../factories/user'

const testAndAssertFailed = fixture => {
	cy.intercept(Cypress.env('API_URL') + '/login*').as('login')
	
	cy.visit('/login')
	cy.get('input[id=username]').type(fixture.username)
	cy.get('input[id=password]').type(fixture.password)
	cy.get('.button').contains('Login').click()

	cy.wait('@login')
	cy.url().should('include', '/')
	cy.get('div.message.danger').contains('Wrong username or password.')
}

const username = 'test'

context('Login', () => {
	beforeEach(() => {
		UserFactory.create(1, {username})
	})

	it('Should log in with the right credentials', () => {
		const fixture = {
			username: 'test',
			password: '1234',
		}

		cy.visit('/login')
		cy.get('input[id=username]').type(fixture.username)
		cy.get('input[id=password]').type(fixture.password)
		cy.get('.button').contains('Login').click()
		cy.url().should('include', '/')
		cy.clock(1625656161057) // 13:00
		cy.get('h2').should('contain', `Hi ${fixture.username}!`)
	})

	it('Should fail with a bad password', () => {
		const fixture = {
			username: 'test',
			password: '123456',
		}

		testAndAssertFailed(fixture)
	})

	it('Should fail with a bad username', () => {
		const fixture = {
			username: 'loremipsum',
			password: '1234',
		}

		testAndAssertFailed(fixture)
	})
	
	it('Should redirect to /login when no user is logged in', () => {
		cy.visit('/')
		cy.url().should('include', '/login')
	})
})
