/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React from 'react'
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import styled from 'styled-components'
import { authenticationService } from '@/_services'
import { Container, Heading, Input, Button, FormControl, FormLabel } from '@chakra-ui/react'
import Axios from '../_helpers/axios'

export const LoginWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5% 0;
`

export const FormWrapper = styled.div`
    margin: 10px 0;
`

export const LabelWrapper = styled.label`
    padding-right: 1ch;
`

class LoginPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = { data: null }
        // redirect to home if already logged in
        if (authenticationService.currentUserValue) {
            this.props.history.push('/')
        }
    }

    authenticate(username, password, setStatus, setSubmitting) {
        Axios.post(`/user/authenticate`, {
            username: username,
            password: password,
        })
            .then((response) => {
                const userData = response.data
                authenticationService.login(userData)
                this.props.history.push('/')
            })
            .catch((error) => {
                const errorMessage = error.response.data.message
                if (errorMessage) {
                    setStatus(errorMessage)
                }
                setSubmitting(false)
            })
    }

    render() {
        return (
            <div>
                <LoginWrapper>
                    <Container>
                        <Heading as="h4"> Login </Heading>{' '}
                        <Formik
                            initialValues={{
                                username: '',
                                password: '',
                            }}
                            validationSchema={Yup.object().shape({
                                username: Yup.string().required('Username is required'),
                                password: Yup.string().required('Password is required'),
                            })}
                            onSubmit={({ username, password }, { setStatus, setSubmitting }) => {
                                setStatus()
                                this.authenticate(username, password, setStatus, setSubmitting)
                            }}
                            render={({ errors, status, touched, handleChange, isSubmitting }) => (
                                <Form>
                                    <FormControl>
                                        <FormWrapper className="form-group">
                                            <FormLabel htmlFor="username"> Username </FormLabel>{' '}
                                            <Input
                                                autoFocus={true}
                                                name="username"
                                                type="text"
                                                className={
                                                    'form-control' +
                                                    (errors.username && touched.username
                                                        ? ' is-invalid'
                                                        : '')
                                                }
                                                onChange={handleChange}
                                            />{' '}
                                            <ErrorMessage
                                                name="username"
                                                component="div"
                                                className="invalid-feedback"
                                            />
                                        </FormWrapper>{' '}
                                        <FormWrapper className="form-group">
                                            <FormLabel htmlFor="password"> Password </FormLabel>{' '}
                                            <Input
                                                name="password"
                                                type="password"
                                                className={
                                                    'form-control' +
                                                    (errors.password && touched.password
                                                        ? ' is-invalid'
                                                        : '')
                                                }
                                                onChange={handleChange}
                                            />{' '}
                                            <ErrorMessage
                                                name="password"
                                                component="div"
                                                className="invalid-feedback"
                                            />
                                        </FormWrapper>{' '}
                                        <FormWrapper className="form-group">
                                            <Button
                                                colorScheme="teal"
                                                size="sm"
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                Login{' '}
                                            </Button>{' '}
                                            {isSubmitting && (
                                                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                            )}{' '}
                                        </FormWrapper>{' '}
                                        {status && (
                                            <div className={'alert alert-danger'}> {status} </div>
                                        )}{' '}
                                    </FormControl>
                                </Form>
                            )}
                        />{' '}
                    </Container>{' '}
                </LoginWrapper>{' '}
            </div>
        )
    }
}

export { LoginPage }
