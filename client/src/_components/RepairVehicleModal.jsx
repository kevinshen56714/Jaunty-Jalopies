import React from 'react'
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
    Alert,
    AlertIcon,
} from '@chakra-ui/react'
import Axios from 'axios'
import config from 'config'
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

export default function RepairVehicleModal({ onClose, setVehicleData, toast }) {
    const checkVehicleStatus = (data, setStatus, setSubmitting) => {
        const getIfExist = Axios.get(`${config.apiUrl}/vehicle/${data.vin}`)
        const getIfSold = Axios.get(`${config.apiUrl}/repair/checkvehicle/${data.vin}`)
        Promise.all([getIfExist, getIfSold])
            .then(([resIfExist, resIfSold]) => {
                setVehicleData(resIfSold.data)
                toast({
                    title: `Vehicle Found.`,
                    description: "We've listed vehicle details here.",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
                onClose()
            })
            .catch((error) => {
                const errorMessage = error.response.data.message
                if (errorMessage) {
                    setStatus(errorMessage)
                }
                setSubmitting(false)
            })
    }

    return (
        <Modal closeOnOverlayClick={false} isOpen={true} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Look Up Vehicle</ModalHeader>
                <ModalCloseButton />

                <Formik
                    initialValues={{ vin: '' }}
                    validationSchema={Yup.object().shape({
                        vin: Yup.string().max(17).required('VIN is required'),
                    })}
                    onSubmit={(data, { setStatus, setSubmitting }) => {
                        setStatus()
                        checkVehicleStatus(data, setStatus, setSubmitting)
                    }}
                >
                    {({ values, status, handleChange, isSubmitting }) => (
                        <Form>
                            <ModalBody pb={6}>
                                <FormControl mt={2}>
                                    <HStack>
                                        <FormLabel w="50%">
                                            VIN
                                            <span style={{ color: 'red' }}>{' *'}</span>
                                        </FormLabel>

                                        <Input
                                            name="vin"
                                            type="text"
                                            placeholder="00AIVKIDO01487633"
                                            onChange={handleChange}
                                        />
                                    </HStack>
                                    <ErrorMessage
                                        style={{
                                            marginLeft: 186,
                                            color: 'red',
                                            fontSize: 14,
                                        }}
                                        name="vin"
                                        component="div"
                                        className="invalid-feedback"
                                    />
                                </FormControl>
                                {status && (
                                    <Alert status="error" marginTop="15px">
                                        <AlertIcon />
                                        {status}
                                    </Alert>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    colorScheme="blue"
                                    mr={3}
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    Search
                                </Button>
                                <Button onClick={onClose}>Cancel</Button>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </ModalContent>
        </Modal>
    )
}
