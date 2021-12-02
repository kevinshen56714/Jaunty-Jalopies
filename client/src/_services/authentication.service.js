import { BehaviorSubject } from 'rxjs'
import { history } from '@/_helpers'

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')))

export const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() {
        return currentUserSubject.value
    },
}

function login(userData) {
    localStorage.setItem('currentUser', JSON.stringify(userData))
    currentUserSubject.next(userData)
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser')
    localStorage.clear()
    currentUserSubject.next(null)
    history.push('/')
    location.reload();
}

