import { expect } from "chai";
import { initializeTestDb, insertTestUser, getToken } from "./helpers/test.js";
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

// describe('GET tasks', () => {
//     before(() => {
//         initializeTestDb()
//     })

// it('should login with valid credentials', async() => {
    //     const email = 'example@mymail.com'
    //     const password = 'strongPassword'
    //     insertTestUser(email, password)
    //     const response = await fetch(base_url + 'user/login', {
    //         method: 'post',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ email: email, password: password })
    //     })
    //     const data = await response.json()

    //     expect(response.status).to.be.equal(200)
    //     expect(data).to.be.an('object')
    //     expect(data).to.include.all.keys('id', 'email', 'token')
    // })

//     const token = getToken("example1@mymail.com")
//     it('should get all tasks', async() => {
//         const response = await fetch(base_url + 'get', {
//             method: 'post',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: token
//             },
//             body: JSON.stringify({ email: "example1@mymail.com" })
//         })
//         const data = await response.json()

//         expect(response.status).to.equal(200)
//         expect(data).to.be.an('array').that.is.not.empty
//         expect(data[0]).to.include.all.keys('id', 'description', 'isdone')
//     })
// })

// describe('DELETE a task', () => {
//     const token = getToken("example1@mymail.com")
//     it('should delete a task', async() => {
//         const response = await fetch(base_url + 'deletetask/1', {
//             method: 'delete',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: token
//             },
//             body: JSON.stringify({email: "example1@mymail.com"})
//         })
//         const data = await response.json()

//         expect(response.status).to.be.equal(200)
//         expect(data).to.be.an('object')
//         expect(data).to.include.all.keys('id')
//     })

//     it('should not delete a task with SQL injection', async() => {
//         const token = getToken("delete@mymail.com")
//         const response = await fetch(base_url + 'deletetask/id=0 or id > 0', {
//             method: 'delete',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: token
//             },
//         })
//         const data = await response.json()
//         expect(response.status).to.equal(500)
//         expect(data).to.be.an('object')
//         expect(data).to.include.all.keys('error')
//     })
// })

// describe('POST task', () => { 
//     insertTestUser("post@mymail.com", "veryStrongPassword")
//     const token = getToken("post@mymail.com")
//     const token2 = getToken('example1@mymail.com')
//     it('should add new task', async() => {
//         const response = await fetch(base_url + 'addnewtask', {
//             method: 'post',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: token
//             },
//             body: JSON.stringify({ description: "task from test", email: "example1@mymail.com" })
//         })
//         const data = await response.json()

//         expect(response.status).to.equal(200)
//         expect(data).to.be.an('object').to.include.all.keys('id')
//     })

//     it('should not post a task without description', async() => {
//         const token = getToken("post@mymail.com")
//         const response = await fetch(base_url + 'addnewtask', {
//             method: 'post',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: token
//             },
//             body: JSON.stringify({ description: null })
//         })
//         const data = await response.json()

//         expect(response.status).to.equal(400, data.error)
//         expect(data).to.be.an('object')
//         expect(data).to.include.all.keys('error')
//     })

//     it('should not post a task with zero length description', async() => {
//         const token = getToken("post@mymail.com")
//         const response = await fetch(base_url + 'addnewtask', {
//             method: 'post',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: token
//             },
//             body: JSON.stringify({ description: '' })
//         })
//         const data = await response.json()

//         expect(response.status).to.equal(400, data.error)
//         expect(data).to.be.an('object')
//         expect(data).to.include.all.keys('error')
//     })
// })

// describe('PUT task', () => {
//     const token = getToken("example2@mymail.com")
//     it('should change isdone status', async() => {
//         const response = await fetch(base_url + 'setdone', {
//             method: 'put',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: token
//             },
//             body: JSON.stringify({ newStatus: true, id: 5})
//         });
        
//         const data = await response.json();
    
//         expect(response.status).to.equal(200);
//         expect(data).to.be.an('object');
//         expect(data).to.include.all.keys('id', 'description', 'user_email', 'isdone');
//     });

//     it('should not change isdone status if parameters in request are invalid', async() => {
//         const response = await fetch(base_url + 'setdone', {
//             method: 'put',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: token
//             },
//             body: JSON.stringify({ newStatus: undefined})
//         });
        
//         const data = await response.json();
    
//         expect(response.status).to.equal(400);
//         expect(data).to.be.an('object');
//         expect(data).to.include.all.keys('error');
//     });
// })

