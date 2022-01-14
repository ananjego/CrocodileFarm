/// <reference types="Cypress" />
import {randomUsername, randomEmail, randomName} from '../../support/utils';

describe('Crocodile Farm', function () {

    beforeEach(() => {
        cy.fixture('example').then(function(data) {
          this.data = data;
        })
      });

      //test

    let access_token = '';
    let crocodile_id = '';

    it('Create User', function () {
        cy.request('POST', '/user/register/', {
            "username": randomUsername,
            "first_name": this.data.firstName,
            "last_name": this.data.lastName,
            "email": randomEmail,
            "password": this.data.password
        }).then(function (response) {
            expect(response.status).to.eq(201);
        });
    });

    it('Login', function () {
        cy.request('POST', '/auth/token/login/', {
            "username": randomUsername,
            "password": this.data.password
        }).then(function (response) {
            expect(response.status).to.eq(200);
            cy.log(JSON.stringify(response));
            cy.log(response.body.access);
            access_token = response.body.access;
        });
    });

    it('Create a new crocodile', function () {
        cy.request({
            method: 'POST',
            url: '/my/crocodiles/',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            form: true,
            body: {
                "name": randomName,
                "sex": this.data.sex,
                "date_of_birth": this.data.dateOfBirth
            }
        }).then(function (response) {
                expect(response.status).to.eq(201);
                cy.log(JSON.stringify(response));
            });
    });

    it('Fetch all crocodiles', function () {
        cy.request({
            method: 'GET',
            url: '/my/crocodiles/',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
        }).then(function (response) {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.length(1);
                cy.log(JSON.stringify(response));
                cy.log(JSON.stringify(response.body));
                cy.log(response.body[0].id);
                crocodile_id = response.body[0].id;
            });
    });

    it('Fetch the crocodile', function () {
        cy.request({
            method: 'GET',
            url: '/my/crocodiles/'+crocodile_id+'/',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
        }).then(function (response) {
                expect(response.status).to.eq(200);
                cy.log(JSON.stringify(response));
            });
    });

    it('Update the crocodile', function () {
        cy.request({
            method: 'PATCH',
            url: '/my/crocodiles/'+crocodile_id+'/',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            form: true,
            body: {
                "name": this.data.updatedName
            }
        }).then(function (response) {
                expect(response.status).to.eq(200);
                expect(response.body.name).to.contain(this.data.updatedName);
                cy.log(JSON.stringify(response));                
            });
    });

    it('Fetch the updated crocodile', function () {
        cy.request({
            method: 'GET',
            url: '/my/crocodiles/'+crocodile_id+'/',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
        }).then(function (response) {
                expect(response.status).to.eq(200);
                expect(response.body.name).to.contain(this.data.updatedName);
                cy.log(JSON.stringify(response));
            });
    });


});

