import { expect } from "chai";
import { initializeTestDb, insertTestUser, getToken } from "./helpers/test.js";
const base_url = 'http://localhost:3001/'

describe('SIGNUP endpoint', () => {
    before(async() => {
                await initializeTestDb()
            })

    it('should register a user with valid email and password', async() => {
        const response = await fetch(base_url + 'user/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname: "Test", familyname: "Test", email: 'example@mymail.com', password: 'strongPassword228' })
        })
        const data = await response.json()
        expect(response.status).to.be.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id', 'firstname', 'familyname', 'email')
    })

    it('should not post a user with an empty password', async() => {
        const email = 'exaaxe@mymail.com'
        const password = ''
        insertTestUser(email, password)
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
        insertTestUser(email, password)
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
        insertTestUser(email, password)
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
        insertTestUser(email, password)
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
        insertTestUser(email, password)
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
        insertTestUser(email, password)
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
        insertTestUser(email, password)
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
        insertTestUser(email, password)
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
        insertTestUser(email, password)
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
//tests for signin endpoint
describe('SIGNIN endpoint', () => {
    it('should register a user with valid email and password', async() => {
        const response = await fetch(base_url + 'user/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname: "Test", familyname: "Test", email: 'example@mymail.com', password: 'strongPassword228' })
        })
        const data = await response.json()
        expect(response.status).to.be.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id', 'firstname', 'familyname', 'email')
    })

    it('should not post a user with an empty password', async() => {
        const email = 'exaaxe@mymail.com'
        const password = ''
        insertTestUser(email, password)
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
        insertTestUser(email, password)
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
        insertTestUser(email, password)
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
        insertTestUser(email, password)
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
        insertTestUser(email, password)
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
        insertTestUser(email, password)
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
        insertTestUser(email, password)
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
        insertTestUser(email, password)
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
        insertTestUser(email, password)
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

