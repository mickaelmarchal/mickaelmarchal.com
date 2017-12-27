/**
 * Empty config file
 */
exports.config = {

    global: {
        baseUrl: 'http://localhost:3000'
    },

    gmailSend: {
        user: 'username@gmail.com',
        pass: 'abcdefghijklmnop',
        to:   'username@gmail.com',
        subject: 'Message',
    },


    feed: {

        maxElements: 100,

        medium: {
            username: '',
            userId: '',
            accessToken: ''
        },
        pocket: {
            consumerKey: '',
            accessToken: ''
        },
        instagram: {
            clientId: '',
            clientSecret: '',
            accessToken: '',
        },
        github: {
            username: ''
        },
        stackoverflow: {
            userId: ''
        },
        twitter: {
            consumerKey: '',
            consumerSecret: '',
            accessTokenKey: '',
            accessTokenSecret : '',
            screenName: ''
        }
    }
};