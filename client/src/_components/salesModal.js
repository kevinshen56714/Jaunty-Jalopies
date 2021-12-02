/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useState, setState } from 'react'
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
} from '@chakra-ui/react'
import Axios from '../_helpers/axios'
import { Formik, Field, Form, useFormik } from 'formik'

const validate = (values) => {
    const errors = {}

    if (!values.spfirstname) {
        errors.spfirstname = 'Required'
    }

    if (!values.splastname) {
        errors.splastname = 'Required'
    }

    if (!values.soldprice) {
        errors.email = 'Required'
    } else if (values.soldprice <= 0.95 * values.invoiceprice) {
        errors.soldprice = 'Must be less than or equal to 95% of the invoice price'
    }
    if (!values.purchasedate) {
        errors.purchasedate = 'Required'
    }
    if (!values.vin) {
        errors.vin = 'Required'
    }
    if (!values.custID) {
        errors.custID = 'Required'
    }

    return errors
}

export default function SalesModal({ onClose, customerData, invoicePrice, searchedVin }) {
    const [addedSale, setAddedSale] = useState(false)

    const addSale = (data, setStatus, setSubmitting) => {
        Axios.post(`/sale/addsale`, data)
            .then((response) => {
                lookUpPerson(true, data.custID)
            })
            .catch((error) => {
                const errorMessage = error.response.data.message
                setStatus(errorMessage)
                setSubmitting(false)
            })
    }

    const formik = useFormik({
        initialValues: {
            spfirstname: customerData.spfirstname,
            splastname: customerData.splastname,
            soldprice: '',
            purchasedate: '',
            vin: searchedVin,
            custID: customerData.custID,
        },
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2))
        },
    })
    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <Modal closeOnOverlayClick={true} isOpen={true} onClose={onClose} size="xl">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Enter Sales Transaction</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <FormControl id="soldprice" isRequired>
                                <FormLabel>Sold Price</FormLabel>
                                <Input placeholder="Sold Price" />
                            </FormControl>

                            <FormControl mt={4} isRequired>
                                <FormLabel>Purchase Date</FormLabel>
                                <Input type="date" placeholder="Purchase Date" />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                type="submit"
                                colorScheme="blue"
                                mr={3}
                                onClick={() => {
                                    addedSale(true)
                                }}
                            >
                                Confirm Sale
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </form>
        </>
    )
}
