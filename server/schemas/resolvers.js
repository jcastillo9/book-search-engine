const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        // find a user
        //context in the query allows the logged in user to be retrieved without specifically searching for them
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id });
                return userData
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },

    Mutation: {
        // authorize a user after they're authenticated
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            // console log the user's info and saved books
            console.log(user)

            if (!user) {
                throw new AuthenticationError('No user found! Please try again!');
            }

            const correctPw = await user.isCorrectPassword(password);
            console.log(correctPw)

            if (!correctPw) {
                throw new AuthenticationError('No user found! Please try again!');
            }

            const token = signToken(user);
            // console log the user's token if authorized. Will get 'invalid token' msg if error
            console.log(token)
            return { token, user };
        },
        // create a new user
        addUser: async (parent, args) => {
            try {
                const user = await User.create(args);
                const token = signToken(user);

                return { token, user }
            } catch (err) {
                console.log(err)
            }
        },

        // allow a signed in user to remove a book from their profile
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const userBooks = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
                // console log the user's array of saved books after one is removed
                console.log(userBooks)
                return userBooks;
            }

            throw new AuthenticationError("You need to be signed in!");
        },

        // allow a signed in user to save a book to their profile
        saveBook: async (parent, { input }, context) => {
            console.log(input)
            console.log(context.user)
            if (context.user) {
                const userBooks = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    {
                        new: true,
                        // runValidators: true
                    }
                );
                //console all the user's saved books after one is added
                console.log(userBooks)
                return userBooks;
            }
            throw new AuthenticationError("You need to be signed in!");
        },
    },
}


module.exports = resolvers;