import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Button,
    HStack,
    RadioGroup,
    Stack,
    Radio,
    Alert,
    AlertIcon,
} from '@chakra-ui/react'
import Axios from 'axios'
import config from 'config'
import { Formik, Form, ErrorMessage, Field } from 'formik'
import * as Yup from 'yup'

const customer = {
    Person: 'person',
    Business: 'business',
}

export default function CustomerModal({ onClose, setCustomerData, toast }) {
    const [customerType, setCustomerType] = useState(customer.Person)
    const [dln, setDln] = useState('')
    const [ein, setEin] = useState('')
    const [error, setError] = useState('')
    const [displayAddCustomerButton, setDisplayAddCustomerButton] = useState(false)
    const [displayAddCustomerSection, setDisplayAddCustomerSection] = useState(false)
    const addCustomerInitialValues = {
        customertype: customerType,
        firstname: '',
        lastname: '',
        address: '',
        city: '',
        zipcode: '',
        state: '',
        phonenumber: '',
        email: '',
        dln: '',
        ein: '',
        bname: '',
        btitle: '',
    }
    const addCustomerValidationSchema = Yup.object().shape({
        firstname: Yup.string().required('First name is required'),
        lastname: Yup.string().required('Last name is required'),
        address: Yup.string().required('Address is required'),
        city: Yup.string().required('City is required'),
        zipcode: Yup.number()
            .test(
                'maxDigits',
                'ZIP Code cannot have more than 9 digits',
                (number) => String(number).length <= 9
            )
            .typeError('ZIP code must be a number')
            .required('ZIP code is required'),
        state: Yup.string().max(2).required('State is required'),
        phonenumber: Yup.number()
            .test(
                'maxDigits',
                'Phone number must have exactly 10 digits',
                (number) => String(number).length === 10
            )
            .typeError('Phone number must be a number')
            .required('Phone number is required'),
        email: Yup.string().email(),
        dln: Yup.string().when('customertype', {
            is: customer.Person,
            then: Yup.string()
                .max(11, "Driver's licence number cannot have more than 11 characters")
                .required("Driver's licence number is required"),
        }),
        ein: Yup.string().when('customertype', {
            is: customer.Business,
            then: Yup.string()
                .min(10, 'EIN must have exactly 10 characters')
                .max(10, 'EIN must have exactly 10 characters')
                .required('EIN is required'),
        }),
        bname: Yup.string().when('customertype', {
            is: customer.Business,
            then: Yup.string().required('Business name is required'),
        }),
        btitle: Yup.string().when('customertype', {
            is: customer.Business,
            then: Yup.string().required('Business title is required'),
        }),
    })
    const addCustomerFields = [
        { name: 'firstname', title: 'First Name', isRequired: true },
        { name: 'lastname', title: 'Last Name', isRequired: true },
        { name: 'address', title: 'Address', isRequired: true },
        { name: 'city', title: 'City', isRequired: true },
        { name: 'zipcode', title: 'ZIP Code', isRequired: true },
        { name: 'state', title: 'State', isRequired: true },
        { name: 'phonenumber', title: 'Phone Number', isRequired: true },
        { name: 'email', title: 'Email', isRequired: false },
    ]

    const handleLookUpKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLookUpSubmit()
        }
    }

    const handleLookUpChange = (e) => {
        var input = e.target.value
        customerType == customer.Person ? setDln(input) : setEin(input)
    }

    const handleLookUpSubmit = () => {
        if (customerType == customer.Person) {
            if (!dln) {
                setError("Driver's licence number is required")
            } else if (dln.length > 11) {
                setError("Driver's licence number cannot have more than 11 characters")
            } else {
                lookUpPerson(false, dln)
            }
        } else {
            if (!ein) {
                setError('Employment identification number (EIN) is required')
            } else if (ein.length != 10) {
                setError('Employment identification number (EIN) must have exactly 10 digits')
            } else {
                lookUpBusiness(false, ein)
            }
        }
    }

    const lookUpPerson = (fromAdd, dln) => {
        Axios.post(`${config.apiUrl}/customer/lookupPerson`, {
            dln: dln,
        })
            .then((response) => {
                const customerData = response.data
                setCustomerData(customerData)
                toast({
                    title: `Person Customer - ${customerData.firstname} ${customerData.lastname} ${
                        fromAdd ? 'Created' : 'Found'
                    }.`,
                    description: "We've listed customer details here.",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
                onClose()
            })
            .catch((error) => {
                const errorMessage = error.response.data.message
                if (errorMessage) {
                    setError(errorMessage)
                    setDisplayAddCustomerButton(true)
                }
            })
    }

    const lookUpBusiness = (fromAdd, ein) => {
        Axios.post(`${config.apiUrl}/customer/lookupBusiness`, {
            ein: ein,
        })
            .then((response) => {
                const customerData = response.data
                setCustomerData(customerData)
                toast({
                    title: `Business Customer - ${customerData.firstname} ${
                        customerData.lastname
                    } ${fromAdd ? 'Created' : 'Found'}`,
                    description: "We've listed customer details here.",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
                onClose()
            })
            .catch((error) => {
                const errorMessage = error.response.data.message
                if (errorMessage) {
                    setError(errorMessage)
                    setDisplayAddCustomerButton(true)
                }
            })
    }

    const addCustomer = (data, setStatus, setSubmitting) => {
        if (data.customertype == customer.Person) {
            Axios.post(`${config.apiUrl}/customer/addPerson`, data)
                .then((response) => {
                    lookUpPerson(true, data.dln)
                })
                .catch((error) => {
                    const errorMessage = error.response.data.message
                    setStatus(errorMessage)
                    setSubmitting(false)
                })
        } else {
            Axios.post(`${config.apiUrl}/customer/addBusiness`, data)
                .then((response) => {
                    lookUpBusiness(true, data.ein)
                })
                .catch((error) => {
                    const errorMessage = error.response.data.message
                    setStatus(errorMessage)
                    setSubmitting(false)
                })
        }
    }

    return (
        <Modal closeOnOverlayClick={false} isOpen={true} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                {!displayAddCustomerSection ? (
                    <>
                        <ModalHeader>Look Up Customer</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <FormControl mt={2}>
                                <HStack>
                                    <FormLabel w="32%">Customer Type</FormLabel>
                                    <RadioGroup
                                        value={customerType}
                                        onChange={(e) => {
                                            setCustomerType(e)
                                            setError('')
                                            setDisplayAddCustomerButton(false)
                                        }}
                                    >
                                        <Stack direction="row">
                                            <Radio value={customer.Person}>person</Radio>
                                            <Radio value={customer.Business}>business</Radio>
                                        </Stack>
                                    </RadioGroup>
                                </HStack>
                            </FormControl>
                            <FormControl mt={2} isRequired>
                                <HStack>
                                    <FormLabel w="50%">
                                        {customerType == customer.Person
                                            ? "Driver's Licence Number"
                                            : 'Employment Identification Number (EIN)'}
                                    </FormLabel>
                                    <Input
                                        placeholder={
                                            customerType == customer.Person
                                                ? 'A0301796521'
                                                : '07-6913915'
                                        }
                                        onKeyDown={(e) => handleLookUpKeyDown(e)}
                                        onChange={(e) => handleLookUpChange(e)}
                                        value={customerType == customer.Person ? dln : ein}
                                    />
                                </HStack>
                            </FormControl>
                            {error && (
                                <Alert status="error">
                                    <AlertIcon />
                                    {error}
                                </Alert>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={handleLookUpSubmit}>
                                Search
                            </Button>
                            {displayAddCustomerButton && (
                                <Button
                                    colorScheme="red"
                                    mr={3}
                                    onClick={() => {
                                        setDisplayAddCustomerSection(true)
                                        setError('')
                                    }}
                                >
                                    Go to add customer
                                </Button>
                            )}
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </>
                ) : (
                    <>
                        <ModalHeader>Add Customer</ModalHeader>
                        <ModalCloseButton />
                        <Formik
                            initialValues={addCustomerInitialValues}
                            validationSchema={addCustomerValidationSchema}
                            onSubmit={(data, { setStatus, setSubmitting }) => {
                                setStatus()
                                addCustomer(data, setStatus, setSubmitting)
                            }}
                        >
                            {({ values, status, handleChange, isSubmitting }) => (
                                <Form>
                                    <ModalBody>
                                        <HStack>
                                            <FormLabel w="32%">Customer Type</FormLabel>
                                            <Stack direction="row">
                                                <RadioGroup
                                                    value={customerType}
                                                    onChange={setCustomerType}
                                                >
                                                    <Field
                                                        name="customertype"
                                                        type="radio"
                                                        value={customer.Person}
                                                        as={Radio}
                                                    >
                                                        person
                                                    </Field>
                                                    <Field
                                                        style={{ marginLeft: 10 }}
                                                        name="customertype"
                                                        type="radio"
                                                        value={customer.Business}
                                                        as={Radio}
                                                    >
                                                        business
                                                    </Field>
                                                </RadioGroup>
                                            </Stack>
                                        </HStack>
                                        {addCustomerFields.map(({ name, title, isRequired }, i) => {
                                            return (
                                                <FormControl mt={2} key={i}>
                                                    <HStack>
                                                        <FormLabel w="50%">
                                                            {title}
                                                            {isRequired && (
                                                                <span style={{ color: 'red' }}>
                                                                    {' *'}
                                                                </span>
                                                            )}
                                                        </FormLabel>
                                                        <Input
                                                            name={name}
                                                            type="text"
                                                            placeholder={title}
                                                            onChange={handleChange}
                                                        />
                                                    </HStack>
                                                    <ErrorMessage
                                                        style={{
                                                            marginLeft: 186,
                                                            color: 'red',
                                                            fontSize: 14,
                                                        }}
                                                        name={name}
                                                        component="div"
                                                        className="invalid-feedback"
                                                    />
                                                </FormControl>
                                            )
                                        })}
                                        {values.customertype == customer.Person ? (
                                            <FormControl mt={2}>
                                                <HStack>
                                                    <FormLabel w="50%">
                                                        {"Driver's Licence Number"}
                                                        <span style={{ color: 'red' }}>{' *'}</span>
                                                    </FormLabel>
                                                    <Input
                                                        name="dln"
                                                        type="text"
                                                        placeholder="Driver's Licence Number"
                                                        onChange={handleChange}
                                                    />
                                                </HStack>
                                                <ErrorMessage
                                                    style={{
                                                        marginLeft: 186,
                                                        color: 'red',
                                                        fontSize: 14,
                                                    }}
                                                    name="dln"
                                                    component="div"
                                                    className="invalid-feedback"
                                                />
                                            </FormControl>
                                        ) : (
                                            <>
                                                <FormControl mt={2}>
                                                    <HStack>
                                                        <FormLabel w="50%">
                                                            Employment Identification Number (EIN)
                                                            <span style={{ color: 'red' }}>
                                                                {' *'}
                                                            </span>
                                                        </FormLabel>
                                                        <Input
                                                            name="ein"
                                                            type="text"
                                                            placeholder="Employment Identification Number (EIN)"
                                                            onChange={handleChange}
                                                        />
                                                    </HStack>
                                                    <ErrorMessage
                                                        style={{
                                                            marginLeft: 186,
                                                            color: 'red',
                                                            fontSize: 14,
                                                        }}
                                                        name="ein"
                                                        component="div"
                                                        className="invalid-feedback"
                                                    />
                                                </FormControl>
                                                <FormControl mt={2}>
                                                    <HStack>
                                                        <FormLabel w="50%">
                                                            Business Name
                                                            <span style={{ color: 'red' }}>
                                                                {' *'}
                                                            </span>
                                                        </FormLabel>
                                                        <Input
                                                            name="bname"
                                                            type="text"
                                                            placeholder="Business Name"
                                                            onChange={handleChange}
                                                        />
                                                    </HStack>
                                                    <ErrorMessage
                                                        style={{
                                                            marginLeft: 186,
                                                            color: 'red',
                                                            fontSize: 14,
                                                        }}
                                                        name="bname"
                                                        component="div"
                                                        className="invalid-feedback"
                                                    />
                                                </FormControl>
                                                <FormControl mt={2}>
                                                    <HStack>
                                                        <FormLabel w="50%">
                                                            Business Title
                                                            <span style={{ color: 'red' }}>
                                                                {' *'}
                                                            </span>
                                                        </FormLabel>
                                                        <Input
                                                            name="btitle"
                                                            type="text"
                                                            placeholder="Business Title"
                                                            onChange={handleChange}
                                                        />
                                                    </HStack>
                                                    <ErrorMessage
                                                        style={{
                                                            marginLeft: 186,
                                                            color: 'red',
                                                            fontSize: 14,
                                                        }}
                                                        name="btitle"
                                                        component="div"
                                                        className="invalid-feedback"
                                                    />
                                                </FormControl>
                                            </>
                                        )}
                                        {status && (
                                            <Alert status="error">
                                                <AlertIcon />
                                                {status}
                                            </Alert>
                                        )}{' '}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            colorScheme="red"
                                            mr={3}
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            Add new customer
                                        </Button>
                                        <Button onClick={onClose}>Cancel</Button>
                                    </ModalFooter>
                                </Form>
                            )}
                        </Formik>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
