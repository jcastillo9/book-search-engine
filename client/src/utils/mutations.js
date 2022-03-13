import {gql} from '@apollo/client'

export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        token
        user {
            _id
            username
        }
    }
}`

export const ADD_USER = gql`
mutation addUser($email: String!, $password: String!, $username: String!) {
    addUser(email: $email, password: $password, username: $username) {
        token
        user {
            _id
            username
            email
        }
    }
}`

export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: String!) {
        removeBook(bookId: $bookId) {
            _id
            username
            email
            bookCount 
            savedBooks {
                bookId
                authors
                title
                description
                image
                link
            }
        }
    }`

export const SAVE_BOOK = gql`
mutation saveBook($input: savedBook!) {
    saveBook(input: $input) {
        _id
        username
        email
        bookCount 
        savedBooks {
            bookId
            authors
            title
            description
            image
            link
        }
    }
}`