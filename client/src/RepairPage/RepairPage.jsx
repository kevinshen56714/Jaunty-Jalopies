import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    HStack,
    VStack,
    Button,
    Text,
    useToast,
    Textarea,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    Divider,
} from '@chakra-ui/react'
import Axios from 'axios'
import config from 'config'
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import RepairVehicleModal from '../_components/RepairVehicleModal'
import CustomerModal from '../_components/CustomerModal'

const OuterContainer = styled.div`
    margin: 5% 0;
    max-width: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
`

const ContentWrapper = styled.div`
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: center;

    .border-div {
        border-radius: 5px;
        border: 1px solid #dadada;
        box-shadow: 5px 5px 10px -12px rgba(0, 0, 0, 0.25);
    }
`
const LeftWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 300px;
    gap: 10px;
`
const RightWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    gap: 10px;
`
const VehicleSection = styled.div`
    height: 230px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
const CustomerSection = styled.div`
    height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const LaborAndPartTablesWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: start;
    width: 100%;
`

const LaborTableWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 40%;
    align-items: center;
    justify-content: center;
`

const PartTableWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 60%;
    min-width: 450px;
    align-items: center;
    justify-content: center;
`

const RepairWrapper = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const vehicleDetailTitles = {
    vin: 'VIN',
    vehicletype: 'Vehicle Type',
    modelyear: 'Model Year',
    modelname: 'Model Name',
    mfrname: 'Manufacturer',
    colors: 'Color(s)',
}

const customerDetailTitles = {
    custid: 'Customer ID',
    businessname: 'Business Name',
    title: 'Title',
    firstname: 'First Name',
    lastname: 'Last Name',
    address: 'Address',
    city: 'City',
    state: 'State',
    zipcode: 'ZIP Code',
    phonenumber: 'Phone Number',
    email: 'Email',
}

const RepairPage = ({ user }) => {
    const [vehicleData, setVehicleData] = useState(null)
    const [customerData, setCustomerData] = useState(null)
    const [showVehicleModal, setShowVehicleModal] = useState(false)
    const [showCustomerModal, setShowCustomerModal] = useState(false)
    const [unfinishedRepair, setUnfinishedRepair] = useState(null)
    const toast = useToast()

    const successToast = (msg) => {
        toast({
            title: msg,
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
    }

    const checkUnfinishedRepair = () => {
        Axios.get(`${config.apiUrl}/repair/checkrepair/${vehicleData.vin}/${customerData.custid}`)
            .then((response) => {
                setUnfinishedRepair(response.data)
            })
            .catch((error) => {
                setUnfinishedRepair(null)
                console.log(error.response.data.message)
            })
    }

    const startNewRepair = (data, setSubmitting) => {
        Axios.post(`${config.apiUrl}/repair/startnew`, data)
            .then((response) => {
                successToast(response.data.message)
                checkUnfinishedRepair()
                setSubmitting(false)
            })
            .catch((error) => {
                console.log(error.response.data.message)
                setSubmitting(false)
            })
    }

    const updateLaborCharges = (data, setSubmitting) => {
        Axios.post(`${config.apiUrl}/repair/updatelaborcharges`, data)
            .then((response) => {
                successToast(response.data.message)
                checkUnfinishedRepair()
                setSubmitting(false)
            })
            .catch((error) => {
                console.log(error.response.data.message)
                setSubmitting(false)
            })
    }

    const addParts = (data, setSubmitting) => {
        Axios.post(`${config.apiUrl}/repair/addparts`, data)
            .then((response) => {
                successToast(response.data.message)
                checkUnfinishedRepair()
                setSubmitting(false)
            })
            .catch((error) => {
                console.log(error.response.data.message)
                setSubmitting(false)
            })
    }

    const completeRepair = (data, setSubmitting) => {
        Axios.post(`${config.apiUrl}/repair/complete`, data)
            .then((response) => {
                successToast(response.data.message)
                checkUnfinishedRepair()
                setSubmitting(false)
            })
            .catch((error) => {
                console.log(error.response.data.message)
                setSubmitting(false)
            })
    }

    const NewRepairForm = () => (
        <Formik
            initialValues={{
                vin: vehicleData.vin,
                custID: customerData.custid,
                odometerreading: '',
                swfirstname: user.firstname,
                swlastname: user.lastname,
                startdate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                    .toISOString()
                    .split('T')[0],
                rdescription: '',
            }}
            validationSchema={Yup.object().shape({
                vin: Yup.string().max(17).required(),
                custID: Yup.string().max(11).required(),
                odometerreading: Yup.number().min(0).required().typeError('Must be a valid number'),
                swfirstname: Yup.string().required(),
                swlastname: Yup.string().required(),
                startdate: Yup.string().required(),
                rdescription: Yup.string(),
            })}
            onSubmit={(data, { setSubmitting }) => {
                startNewRepair(data, setSubmitting)
            }}
        >
            {({ values, handleChange, isSubmitting }) => (
                <Form>
                    <FormControl mt={2}>
                        <HStack>
                            <FormLabel w="50%">
                                Odometer Reading
                                <span style={{ color: 'red' }}>{' *'}</span>
                            </FormLabel>

                            <Input
                                name="odometerreading"
                                type="text"
                                placeholder="Odometer Reading"
                                onChange={handleChange}
                            />
                        </HStack>
                        <ErrorMessage
                            style={{
                                marginLeft: 186,
                                color: 'red',
                                fontSize: 14,
                            }}
                            name="odometerreading"
                            component="div"
                            className="invalid-feedback"
                        />
                    </FormControl>
                    <FormControl mt={2}>
                        <HStack>
                            <FormLabel w="50%">Repair Description</FormLabel>

                            <Textarea
                                name="rdescription"
                                type="text"
                                placeholder="Repair Description"
                                onChange={handleChange}
                            />
                        </HStack>
                        <ErrorMessage
                            style={{
                                marginLeft: 186,
                                color: 'red',
                                fontSize: 14,
                            }}
                            name="rdescription"
                            component="div"
                            className="invalid-feedback"
                        />
                    </FormControl>
                    <VStack
                        borderRadius="10px"
                        border="1px"
                        width="400px"
                        marginTop="10px"
                        padding="10px"
                    >
                        <FormControl mt={2}>
                            <HStack>
                                <FormLabel w="60%">{"Service writer's first name"}</FormLabel>
                                <Text>{values.swfirstname} </Text>
                            </HStack>
                        </FormControl>
                        <FormControl mt={2}>
                            <HStack>
                                <FormLabel w="60%">{"Service writer's last name"}</FormLabel>
                                <Text>{values.swlastname} </Text>
                            </HStack>
                        </FormControl>
                        <FormControl mt={2}>
                            <HStack>
                                <FormLabel w="60%">{'Start Date'}</FormLabel>
                                <Text>{values.startdate} </Text>
                            </HStack>
                        </FormControl>
                        <Button
                            colorScheme="blue"
                            variant="outline"
                            size="md"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Start New Repair
                        </Button>
                    </VStack>
                </Form>
            )}
        </Formik>
    )

    const UpdateLaborChargeForm = () => (
        <Formik
            initialValues={{
                vin: vehicleData.vin,
                newLaborCharges: '',
                owner: user.own,
            }}
            validationSchema={Yup.object().shape({
                vin: Yup.string().max(17).required(),
                newLaborCharges: Yup.number()
                    .required('Required field')
                    .typeError('Must be a valid number')
                    .when('owner', {
                        is: 0,
                        then: Yup.number()
                            .positive('Must be positive')
                            .required('Required field')
                            .typeError('Must be a valid number'),
                    }),
            })}
            onSubmit={(data, { setSubmitting }) => {
                updateLaborCharges(data, setSubmitting)
            }}
        >
            {({ values, handleChange, isSubmitting }) => (
                <Form>
                    <Table size="sm" colorScheme="blue">
                        <TableCaption>
                            <Button
                                colorScheme="blue"
                                variant="outline"
                                size="sm"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                Update Labor Charges
                            </Button>
                        </TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Labor Charges</Th>
                                <Th isNumeric>Amount</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>Previous</Td>
                                <Td isNumeric>{Number(unfinishedRepair.laborcharges)}</Td>
                            </Tr>
                            <Tr>
                                <Td>New</Td>
                                <Td isNumeric w="50px" paddingRight="0px">
                                    <Input
                                        name="newLaborCharges"
                                        type="text"
                                        size="sm"
                                        placeholder="enter"
                                        onChange={handleChange}
                                        textAlign="right"
                                    />
                                    <ErrorMessage
                                        style={{
                                            color: 'red',
                                            fontSize: 14,
                                        }}
                                        name="newLaborCharges"
                                        component="div"
                                        className="invalid-feedback"
                                    />
                                </Td>
                            </Tr>
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Th>New Total</Th>
                                <Th isNumeric>
                                    {Number(values.newLaborCharges) +
                                        Number(unfinishedRepair.laborcharges)}
                                </Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                </Form>
            )}
        </Formik>
    )

    const AddPartForm = () => (
        <Formik
            initialValues={{
                vin: vehicleData.vin,
                startdate: unfinishedRepair.startdate.split('T')[0],
                partnumber: '',
                partprice: '',
                quantity: '',
                vendorname: '',
            }}
            validationSchema={Yup.object().shape({
                vin: Yup.string().max(17).required(),
                startdate: Yup.string().required(),
                partnumber: Yup.string().max(100).required('Required field'),
                partprice: Yup.number()
                    .positive('Must be positive')
                    .required('Required field')
                    .typeError('Must be a valid number'),
                quantity: Yup.number()
                    .integer()
                    .positive('Must be positive')
                    .required('Required field')
                    .typeError('Must be a valid number'),
                vendorname: Yup.string().max(100).required('Required field'),
            })}
            onSubmit={(data, { setSubmitting }) => {
                addParts(data, setSubmitting)
            }}
        >
            {({ values, handleChange, isSubmitting }) => (
                <Form>
                    <Table size="sm" colorScheme="blue">
                        <TableCaption>
                            <Button
                                colorScheme="blue"
                                variant="outline"
                                size="sm"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                Add Part
                            </Button>
                        </TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Part</Th>
                                <Th>Part Number</Th>
                                <Th isNumeric>Part Price</Th>
                                <Th isNumeric>Quantity</Th>
                                <Th>Vendor Name</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {unfinishedRepair.partnumbers &&
                                unfinishedRepair.partnumbers.split(',').map((value, index) => (
                                    <Tr key={index}>
                                        <Td>{index + 1}</Td>
                                        <Td>{value}</Td>
                                        <Td isNumeric>
                                            {unfinishedRepair.partprices.split(',')[index]}
                                        </Td>
                                        <Td isNumeric>
                                            {unfinishedRepair.quantities.split(',')[index]}
                                        </Td>
                                        <Td>{unfinishedRepair.vendornames.split(',')[index]}</Td>
                                    </Tr>
                                ))}
                            <Tr>
                                <Td>New</Td>
                                <Td w="50px">
                                    <Input
                                        name="partnumber"
                                        type="text"
                                        size="sm"
                                        placeholder="enter"
                                        onChange={handleChange}
                                        textAlign="left"
                                    />
                                    <ErrorMessage
                                        style={{
                                            color: 'red',
                                            fontSize: 14,
                                        }}
                                        name="partnumber"
                                        component="div"
                                        className="invalid-feedback"
                                    />
                                </Td>
                                <Td isNumeric w="50px" paddingRight="0px">
                                    <Input
                                        name="partprice"
                                        type="text"
                                        size="sm"
                                        placeholder="enter"
                                        onChange={handleChange}
                                        textAlign="right"
                                    />
                                    <ErrorMessage
                                        style={{
                                            color: 'red',
                                            fontSize: 14,
                                        }}
                                        name="partprice"
                                        component="div"
                                        className="invalid-feedback"
                                    />
                                </Td>
                                <Td isNumeric w="50px" paddingRight="0px">
                                    <Input
                                        name="quantity"
                                        type="text"
                                        size="sm"
                                        placeholder="enter"
                                        onChange={handleChange}
                                        textAlign="right"
                                    />
                                    <ErrorMessage
                                        style={{
                                            color: 'red',
                                            fontSize: 14,
                                        }}
                                        name="quantity"
                                        component="div"
                                        className="invalid-feedback"
                                    />
                                </Td>
                                <Td w="50px">
                                    <Input
                                        name="vendorname"
                                        type="text"
                                        size="sm"
                                        placeholder="enter"
                                        onChange={handleChange}
                                        textAlign="left"
                                    />
                                    <ErrorMessage
                                        style={{
                                            color: 'red',
                                            fontSize: 14,
                                        }}
                                        name="vendorname"
                                        component="div"
                                        className="invalid-feedback"
                                    />
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </Form>
            )}
        </Formik>
    )

    const CompleteRepairForm = () => (
        <Formik
            initialValues={{
                vin: vehicleData.vin,
                completedate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                    .toISOString()
                    .split('T')[0],
            }}
            validationSchema={Yup.object().shape({
                vin: Yup.string().max(17).required(),
                completedate: Yup.string().required(),
            })}
            onSubmit={(data, { setSubmitting }) => {
                completeRepair(data, setSubmitting)
            }}
        >
            {({ values, isSubmitting }) => (
                <Form width="100%">
                    <VStack>
                        <FormControl mt={2}>
                            <HStack>
                                <FormLabel>{'Complete Date'}</FormLabel>
                                <Text>{values.completedate} </Text>
                                <Button
                                    colorScheme="red"
                                    variant="outline"
                                    size="md"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    Complete
                                </Button>
                            </HStack>
                        </FormControl>
                    </VStack>
                </Form>
            )}
        </Formik>
    )

    useEffect(() => {
        if (vehicleData && customerData) {
            checkUnfinishedRepair()
        }
    }, [vehicleData, customerData])

    return (
        <OuterContainer>
            {showVehicleModal && (
                <RepairVehicleModal
                    onClose={() => setShowVehicleModal(false)}
                    setVehicleData={(data) => {
                        setVehicleData(data)
                    }}
                    toast={toast}
                />
            )}
            {showCustomerModal && (
                <CustomerModal
                    onClose={() => setShowCustomerModal(false)}
                    setCustomerData={(data) => {
                        setCustomerData(data)
                    }}
                    toast={toast}
                />
            )}
            <Box>
                <Heading as="h1">
                    <center> Repair Page </center>
                </Heading>
                <ContentWrapper>
                    <LeftWrapper>
                        <Heading size="sm">Vehicle Details</Heading>
                        <VehicleSection className="border-div">
                            {vehicleData && (
                                <div style={{ textAlign: 'left', marginBottom: '10px' }}>
                                    {Object.keys(vehicleData).map((key) => (
                                        <div key={key}>
                                            <p style={{ fontWeight: 'bold' }}>
                                                {`${vehicleDetailTitles[key]}: `}
                                                <span style={{ fontWeight: 'normal' }}>
                                                    {vehicleData[key]}
                                                </span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Button
                                onClick={setShowVehicleModal}
                                colorScheme="blue"
                                variant="outline"
                                size={vehicleData ? 'sm' : 'md'}
                            >
                                {vehicleData ? 'Change Vehicle' : 'Look Up Vehicle'}
                            </Button>
                        </VehicleSection>
                        <Heading size="sm">Customer Details</Heading>
                        <CustomerSection className="border-div">
                            {customerData && (
                                <div style={{ textAlign: 'left', marginBottom: '10px' }}>
                                    {Object.keys(customerData).map((key) => (
                                        <div key={key}>
                                            <p style={{ fontWeight: 'bold' }}>
                                                {`${customerDetailTitles[key]}: `}
                                                <span style={{ fontWeight: 'normal' }}>
                                                    {customerData[key]}
                                                </span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Button
                                onClick={setShowCustomerModal}
                                colorScheme="blue"
                                variant="outline"
                                size={customerData ? 'sm' : 'md'}
                            >
                                {customerData ? 'Change Customer' : 'Look Up Customer'}
                            </Button>
                        </CustomerSection>
                    </LeftWrapper>
                    <RightWrapper>
                        <Heading size="sm">Repair Details</Heading>
                        <RepairWrapper className="border-div">
                            {(!customerData || !vehicleData) && (
                                <Text fontSize="xl">
                                    Please look up vehicle and customer first.
                                </Text>
                            )}

                            {customerData && vehicleData && !unfinishedRepair && (
                                <>
                                    <Text fontSize="xl">
                                        There is no unfinished repair, please start a new repair:
                                    </Text>
                                    <NewRepairForm />
                                </>
                            )}

                            {customerData && vehicleData && unfinishedRepair && (
                                <>
                                    <Heading size="md" marginBottom="15px">
                                        Unfinished repair info:
                                    </Heading>
                                    <div style={{ textAlign: 'left', marginBottom: '10px' }}>
                                        <p style={{ fontWeight: 'bold' }}>
                                            {'Start Date: '}
                                            <span style={{ fontWeight: 'normal' }}>
                                                {unfinishedRepair.startdate.split('T')[0]}
                                            </span>
                                        </p>
                                        <p style={{ fontWeight: 'bold' }}>
                                            {'Odometer Reading: '}
                                            <span style={{ fontWeight: 'normal' }}>
                                                {unfinishedRepair.odometerreading}
                                            </span>
                                        </p>
                                        <p style={{ fontWeight: 'bold' }}>
                                            {'Associated Service Writer: '}
                                            <span style={{ fontWeight: 'normal' }}>
                                                {`${unfinishedRepair.swfirstname} ${unfinishedRepair.swlastname}`}
                                            </span>
                                        </p>
                                        <p style={{ fontWeight: 'bold' }}>
                                            {'Repair Description: '}
                                            <span style={{ fontWeight: 'normal' }}>
                                                {unfinishedRepair.rdescription
                                                    ? unfinishedRepair.rdescription
                                                    : 'N/A'}
                                            </span>
                                        </p>
                                    </div>
                                    <Divider margin="15px" />
                                    <LaborAndPartTablesWrapper>
                                        <LaborTableWrapper>
                                            <Heading size="sm" marginBottom="15px">
                                                Update labor charges:
                                            </Heading>
                                            <UpdateLaborChargeForm />
                                        </LaborTableWrapper>
                                        <PartTableWrapper>
                                            <Heading size="sm" marginBottom="15px">
                                                Add parts:
                                            </Heading>
                                            <AddPartForm />
                                        </PartTableWrapper>
                                    </LaborAndPartTablesWrapper>
                                    <Divider margin="15px" />

                                    <Heading size="md" marginBottom="10px">
                                        Complete repair:
                                    </Heading>
                                    <CompleteRepairForm />
                                </>
                            )}
                        </RepairWrapper>
                    </RightWrapper>
                </ContentWrapper>
            </Box>
        </OuterContainer>
    )
}

export { RepairPage }
