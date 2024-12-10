import { expect } from "chai";
import { initializeTestDb, insertTestUser, deleteTestData, checkInfoLeftAfterDeleting, getToken, insertTestReview, insertUserAndDataForDelete } from "./helpers/test.js";
const base_url = 'http://localhost:3001/'
let token;

describe('SIGNUP endpoint', () => {
    before(async() => {
                await initializeTestDb()
            })

    it('should register a user with valid email and password and send a confirmation email', async() => {
        const response = await fetch(base_url + 'user/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname: "Test", familyname: "Test", email: 'example@mymail.com', password: 'strongPassword228' })
        })
        const data = await response.json()
        token = data.token
        expect(response.status).to.be.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id', 'firstname', 'familyname', 'email', 'token')
    })

    it('should not post a user with an empty password', async() => {
        const email = 'exaaxe@mymail.com'
        const password = ''
        await insertTestUser(email, password)
        const response = await fetch(base_url + 'user/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname: "Test", familyname: "Test", email: email, password: password })
        })
        const data = await response.json()

        expect(response.status).to.be.equal(400, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

    it('should not post a user with a password shorter than 8 characters', async() => {
        const email = 'exaaxe@mymail.com'
        const password = 'Pass2'
        await insertTestUser(email, password)
        const response = await fetch(base_url + 'user/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname: "Test", familyname: "Test", email: email, password: password })
        })
        const data = await response.json()

        expect(response.status).to.be.equal(400, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

    it('should not post a user with a password, which does not have at least one capital latter', async() => {
        const email = 'exaaxe@mymail.com'
        const password = 'passpasspass5'
        await insertTestUser(email, password)
        const response = await fetch(base_url + 'user/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname: "Test", familyname: "Test", email: email, password: password })
        })
        const data = await response.json()

        expect(response.status).to.be.equal(400, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

    it('should not post a user with a password, which does not have at least one number', async() => {
        const email = 'exaaxe@mymail.com'
        const password = 'passpasspassP'
        await insertTestUser(email, password)
        const response = await fetch(base_url + 'user/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname: "Test", familyname: "Test", email: email, password: password })
        })
        const data = await response.json()

        expect(response.status).to.be.equal(400, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

    it('should not post a user with an empty email', async() => {
        const email = ''
        const password = 'password8c'
        await insertTestUser(email, password)
        const response = await fetch(base_url + 'user/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname: "Test", familyname: "Test", email: email, password: password })
        })
        const data = await response.json()

        expect(response.status).to.be.equal(400, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

    it('should not post a user with an email, which does not contain email domain', async() => {
        const email = 'max@mail'
        const password = 'password8C'
        await insertTestUser(email, password)
        const response = await fetch(base_url + 'user/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname: "Test", familyname: "Test", email: email, password: password })
        })
        const data = await response.json()

        expect(response.status).to.be.equal(400, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

    it('should not post a user with an email, which is too short', async() => {
        const email = 'ma@ma.com'
        const password = 'password8C'
        await insertTestUser(email, password)
        const response = await fetch(base_url + 'user/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname: "Test", familyname: "Test", email: email, password: password })
        })
        const data = await response.json()

        expect(response.status).to.be.equal(400, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

    it('should not post a user if a firstname is empty', async() => {
        const email = 'mymail@mail.com'
        const password = 'password8C'
        await insertTestUser(email, password)
        const response = await fetch(base_url + 'user/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname: "", familyname: "Test", email: email, password: password })
        })
        const data = await response.json()

        expect(response.status).to.be.equal(400, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

    it('should not post a user if a familyname is empty', async() => {
        const email = 'mymail@mail.com'
        const password = 'password8C'
        await insertTestUser(email, password)
        const response = await fetch(base_url + 'user/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname: "Test", familyname: "", email: email, password: password })
        })
        const data = await response.json()

        expect(response.status).to.be.equal(400, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })
})

describe('EMAIL validation', () => {
    before(async() => {
        await insertTestUser('Somename', 'Somename', 'exxamplemail@example.com', 'PasswordWhichIsStrong222')
        await fetch(base_url + 'user/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname: "Test", familyname: "Test", email: 'examplllle@mymail.com', password: 'strongPassword228' })
        })    
    })
    
    it('should validate users email, if the code is correct', async() => {
        const response = await fetch(base_url + 'user/verifyemail', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: token })
        })
        const data = await response.json()

        expect(response.status).to.be.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('successMessage')
    })

    it('should NOT validate users email, if the code is null', async() => {
        const response = await fetch(base_url + 'user/verifyemail', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: null })
        })
        const data = await response.json()

        expect(response.status).to.be.equal(400, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

    it('should NOT proceed with validation of users email, if the email is already confirmed', async() => {
        const response = await fetch(base_url + 'user/verifyemail', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: token })
        })
        const data = await response.json()

        expect(response.status).to.be.equal(400, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

    it('should NOT proceed with validation of users email, if the account field does not contain hashed code', async() => {
        const code = token.slice(0, 6);
        const newToken = code + 11
        let data
        let response
        setTimeout(async() => {
            response = await fetch(base_url + 'user/verifyemail', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: newToken })
            })
            data = await response.json()
            expect(response.status).to.be.equal(404, data.error)
            expect(data).to.be.an('object')
            expect(data).to.include.all.keys('error')
        }, 5000) 
    })

    it('should NOT proceed with validation of users email, if the code is invalid', async() => {
        const code = token.slice(0, 6);
        const newToken = code + 3
        setTimeout(async() => {
        const response = await fetch(base_url + 'user/verifyemail', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: newToken })
        })
        const data = await response.json()

        expect(response.status).to.be.equal(400, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    }, 5000) 
    })
})

//tests for signin endpoint
describe('SIGNIN endpoint', () => {

    it('should login with valid credentials', async() => {
        const email = 'example@mymail.com'
        const password = 'strongPassword228'
        setTimeout(async() => {
        const response = await fetch(base_url + 'user/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })
        const data = await response.json()

        expect(response.status).to.be.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id', 'firstname', 'familyname', 'email', 'token')
        }, 5000) 
    })

    it('should NOT login user, if email is empty', async() => {
        const response = await fetch(base_url + 'user/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: '', password: 'hereissomepassword' })
        })
        const data = await response.json()

        expect(response.status).to.be.equal(400, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

    it('should NOT login user, if password is empty', async() => {
        const response = await fetch(base_url + 'user/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: 'some@email.com', password: '' })
        })
        const data = await response.json()

        expect(response.status).to.be.equal(400, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

    it('should NOT login user, if email is invalid', async() => {
        const response = await fetch(base_url + 'user/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: 'eeeexample@mymail.com', password: 'strongPassword228' }) //password is correct in this case
        })
        const data = await response.json()

        expect(response.status).to.be.equal(401, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

    it('should NOT login user, if password is invalid', async() => {
        const response = await fetch(base_url + 'user/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: "example@mymail.com", password: 'strongPassword22' }) 
        })
        const data = await response.json()

        expect(response.status).to.be.equal(401, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

    it('should NOT login user, if email is not confirmed', async() => {
        const response = await fetch(base_url + 'user/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: 'examplllle@mymail.com', password: 'strongPassword228' }) 
        })
        const data = await response.json()

        expect(response.status).to.be.equal(403, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })
})

describe('DELETE account endpoint', () => {
    before(async() => {
        await insertUserAndDataForDelete()
    })

    it('should delete account, if the provided credentials are vaild', async() => {
        const userToken = getToken("admin@example.com")
        const response = await fetch(base_url + 'user/delete', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `${userToken}`
            },
            body: JSON.stringify({ email: "admin@example.com"})
        })
        const data = await response.json()

        expect(response.status).to.be.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('state')
    })

    it('should NOT delete account, if the provided email is empty', async() => {
        const userToken = getToken("admin@example.com")
        const response = await fetch(base_url + 'user/delete', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `${userToken}`
            },
            body: JSON.stringify({ email: ""})
        })
        const data = await response.json()
        
        expect(response.status).to.be.equal(400, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

    it('should NOT delete any account, if there were no records found by provided email', async() => {
        const userToken = getToken("admin@example.com")
        const response = await fetch(base_url + 'user/delete', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `${userToken}`
            },
            body: JSON.stringify({ email: "some@mail.random"})
        })
        const data = await response.json()
        
        expect(response.status).to.be.equal(400, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

    it('no information about the deleted user should stay in the database', async() => {
        //the checker function is provided in the test_db.sql
        const result = await checkInfoLeftAfterDeleting("admin@example.com")

        expect(result).to.be.an('boolean')
        expect(result).to.be.equal(false)
    })
})

describe('REVIEW endpoint', () => {
    before(async() => {
        await insertTestReview()
    })

    describe('GET all reviews', () => {

    it('should get all reviews', async() => {
        const response = await fetch(base_url + 'reviews/getallreviews', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const data = await response.json()

        expect(response.status).to.be.equal(200)
        expect(data[0]).to.be.an('object')
        expect(data[0]).to.include.all.keys('review_id', 'user_email', 'likes', 'dislikes', 'movie_id', 'rating', 'created_at')
    })

    it('should return an empty array if no reviews exist', async () => {
        await deleteTestData(); // Remove all test data
        const response = await fetch(base_url + 'reviews/getallreviews', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        expect(response.status).to.be.equal(200);
        expect(data).to.be.an('array').that.is.empty;
    });
    })

    describe('POST review', () => {
        it('should create a review', async () => {
            const newReview = {
                userEmail: 'jane@example.com',
                reviewContent: 'Amazing movie!',
                movieId: 14,
                rating: 5,
            };
            const response = await fetch(base_url + `reviews/${1}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newReview),
            });
            const data = await response.json();

            expect(response.status).to.be.equal(201);
            expect(data).to.include.all.keys('id', 'user_email', 'movie_id', 'rating', 'review_content', 'created_at');
        });
        
        it('should fail to create a review with missing fields', async () => {
            const incompleteReview = {
                userEmail: 'testuser@example.com',
                rating: 5,
            };
            const response = await fetch(base_url + `reviews/${1}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(incompleteReview),
            });
            const data = await response.json();

            expect(response.status).to.be.equal(400);
            expect(data.error).to.equal('All fields are required.');
        });
    });
    describe('PUT review', () => {
        it('should update a review', async () => {
            const reviewIdToUpdate = 3; 
            const updatedReview = {
                reviewContent: 'Updated review content.',
                rating: 4,
                userEmail: 'jane@example.com',
            };
            const response = await fetch(base_url + `reviews/${reviewIdToUpdate}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedReview),
            });
            const data = await response.json();

            expect(response.status).to.be.equal(200);
            expect(data).to.include.all.keys('id', 'user_email', 'movie_id', 'rating', 'review_content', 'created_at');
        });

        it('should fail to update a review, if the authors email is different from the email in the request', async () => {
            const invalidReviewId = 3; 
            const updatedReview = {
                reviewContent: 'Updated review content.',
                rating: 4,
                userEmail: 'janee@example.com',
            };
            const response = await fetch(base_url + `reviews/${invalidReviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedReview),
            });
            const data = await response.json();

            expect(response.status).to.be.equal(403);
            expect(data.error).to.equal('Unauthorized to update this review');
        });
    });

    describe('DELETE review', () => {

        it('should delete a review', async () => {
            const reviewIdToDelete = 3;
            const response = await fetch(base_url + `reviews/${reviewIdToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail: 'jane@example.com' }),
            });
            const data = await response.json();

            expect(response.status).to.be.equal(200);
            expect(data.message).to.equal('Review deleted successfully');
        });
    });
})