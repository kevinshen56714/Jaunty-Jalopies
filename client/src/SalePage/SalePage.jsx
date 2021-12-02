import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Heading, Center, Stack, SimpleGrid } from '@chakra-ui/react'
import CustomerModal from '../_components/CustomerModal'
import {
    VStack,
    HStack,
    FormControl,
    Button,
    FormLabel,
    Text,
    Input,
    useToast,
} from '@chakra-ui/react'
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Axios from 'axios'
import config from 'config'
import { history } from '@/_helpers'

const FlexWrapper = styled.div`
    display: flex;
    margin: 25px;
`
const ButtonLeftWrapper = styled.div`
    justify-content: flex-end;
    display: flex;
    margin-right: 48px;
    max-width: 80%;
`

const StyledButton = styled.button`
    align-items: center;
    appearance: none;
    background-color: #fcfcfd;
    border-radius: 4px;
    border-width: 0;
    box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px,
        #d6d6e7 0 -3px 0 inset;
    box-sizing: border-box;
    color: #36395a;
    cursor: pointer;
    display: inline-flex;
    font-family: 'JetBrains Mono', monospace;
    height: 48px;
    justify-content: center;
    line-height: 1;
    list-style: none;
    overflow: hidden;
    padding-left: 16px;
    padding-right: 16px;
    position: relative;
    text-align: left;
    text-decoration: none;
    transition: box-shadow 0.15s, transform 0.15s;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    white-space: nowrap;
    will-change: box-shadow, transform;
    font-size: 18px;
    :focus {
        box-shadow: #d6d6e7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px,
            rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #d6d6e7 0 -3px 0 inset;
    }

    :hover {
        box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px,
            #d6d6e7 0 -3px 0 inset;
        transform: translateY(-2px);
    }

    :active {
        box-shadow: #d6d6e7 0 3px 7px inset;
        transform: translateY(2px);
    }
`

const OuterContainer = styled.div`
    margin: 5% 0;
    max-width: 100%;
    max-height: 100%;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
`

const vehicleDetailsList = {
    vin: 'VIN',
    vehicletype: 'Vehicle Type',
    mfrname: 'Manufacturer',
    modelyear: 'Model Year',
    modelname: ' Model Name',
    listprice: 'List Price',
    invoiceprice: 'Invoice Price',
    colors: 'Colors',
    numdoors: 'Number of Doors',
    rooftype: 'Roof Type',
    backseatcount: 'Back Seat Count',
    cargocapacity: 'Cargo Capacity (in tons)',
    cargocovertype: 'Cargo Cover Type',
    numrearaxles: 'Number of Rear Axles',
    driversidebackdoor: "Has Driver's Side Back Door",
    numcupholder: 'Number of Cupholders',
    drivetrain: 'Drivetrain Type',
    description: 'Description',
}

const SalePage = (props) => {
    const [customerData, setCustomerData] = useState(null)
    const [showCustomerModal, setShowCustomerModal] = useState(false)
    const toast = useToast()
    const vehicleData = props.location.vehicleData
    const user = props.location.user

    const addSale = (data, setSubmitting) => {
        Axios.post(`${config.apiUrl}/sale/addSale`, data)
            .then((response) => {
                setSubmitting(false)
                toast({
                    title: 'Vehicle Sold!',
                    description: 'Redirecting you to home page.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
                history.push('/')
            })
            .catch((error) => {
                console.log(error.response.data.message)
                setSubmitting(false)
            })
    }

    const SaleForm = () => (
        <Formik
            initialValues={{
                vin: vehicleData.vin,
                custID: customerData.custid,
                purchasedate: '',
                soldprice: '',
                spfirstname: user.firstname,
                splastname: user.lastname,
                isowner: user.own,
            }}
            validationSchema={Yup.object().shape({
                vin: Yup.string().max(17).required(),
                custID: Yup.string().required(),
                purchasedate: Yup.string().required('Required'),
                soldprice: Yup.number()
                    .required()
                    .typeError('Must be a valid number')
                    .when('isowner', {
                        is: 0,
                        then: Yup.number()
                            .required('Required')
                            .typeError('Must be a valid number')
                            .min(
                                vehicleData.invoiceprice * 0.95,
                                'Sold price has to be higher than 95% of the invoice price'
                            ),
                    }),
                spfirstname: Yup.string().required(),
                splastname: Yup.string().required(),
            })}
            onSubmit={(data, { setSubmitting }) => {
                addSale(data, setSubmitting)
            }}
        >
            {({ values, handleChange, isSubmitting }) => (
                <Form width="100%">
                    <VStack borderRadius="10px" border="1px" width="400px" padding="10px">
                        <FormControl mt={2}>
                            <HStack>
                                <FormLabel w="50%">
                                    Sold Price
                                    <span style={{ color: 'red' }}>{' *'}</span>
                                </FormLabel>

                                <Input
                                    name="soldprice"
                                    type="text"
                                    placeholder="Sold price"
                                    onChange={handleChange}
                                />
                            </HStack>
                            <ErrorMessage
                                style={{
                                    marginLeft: 140,
                                    color: 'red',
                                    fontSize: 14,
                                }}
                                name="soldprice"
                                component="div"
                                className="invalid-feedback"
                            />
                        </FormControl>
                        <FormControl mt={2}>
                            <HStack>
                                <FormLabel w="50%">
                                    Sold Date
                                    <span style={{ color: 'red' }}>{' *'}</span>
                                </FormLabel>

                                <Input
                                    name="purchasedate"
                                    type="date"
                                    placeholder="Sold date"
                                    onChange={handleChange}
                                />
                            </HStack>
                            <ErrorMessage
                                style={{
                                    marginLeft: 140,
                                    color: 'red',
                                    fontSize: 14,
                                }}
                                name="purchasedate"
                                component="div"
                                className="invalid-feedback"
                            />
                        </FormControl>
                        <FormControl mt={2}>
                            <HStack>
                                <FormLabel w="60%">{"Sale person's first name"}</FormLabel>
                                <Text>{values.spfirstname} </Text>
                            </HStack>
                        </FormControl>
                        <FormControl mt={2}>
                            <HStack>
                                <FormLabel w="60%">{"Sale person's last name"}</FormLabel>
                                <Text>{values.splastname} </Text>
                            </HStack>
                        </FormControl>
                        <Button
                            colorScheme="blue"
                            variant="outline"
                            size="md"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Add Sale
                        </Button>
                    </VStack>
                </Form>
            )}
        </Formik>
    )
    return (
        <OuterContainer>
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
                    <center> Sales Order Form </center>
                </Heading>
                <Stack>
                    <ButtonLeftWrapper>
                        <StyledButton
                            onClick={() => {
                                setShowCustomerModal(true)
                            }}
                        >
                            Look up Customer
                        </StyledButton>
                    </ButtonLeftWrapper>
                </Stack>
                <Center>
                    <FlexWrapper>
                        <SimpleGrid columns={2} spacing={100}>
                            <Box>
                                <Heading as="h3" size="md">
                                    Vehicle Details
                                </Heading>
                                {vehicleData &&
                                    Object.keys(vehicleDetailsList).map((key) => {
                                        return (
                                            vehicleData[key] != null && (
                                                <div key={key}>
                                                    <p style={{ fontWeight: 'bold' }}>
                                                        {`${vehicleDetailsList[key]}: `}
                                                        <span style={{ fontWeight: 'normal' }}>
                                                            {vehicleData[key]}
                                                        </span>
                                                    </p>
                                                </div>
                                            )
                                        )
                                    })}
                            </Box>
                            <Box>
                                <Heading as="h3" size="md">
                                    Customer Details
                                </Heading>{' '}
                                {customerData &&
                                    Object.keys(customerData).map((key) => {
                                        return (
                                            <div key={key}>
                                                <p style={{ fontWeight: 'bold' }}>
                                                    {`${key}: `}
                                                    <span style={{ fontWeight: 'normal' }}>
                                                        {customerData[key]}
                                                    </span>
                                                </p>
                                            </div>
                                        )
                                    })}
                                {!customerData && <p>N/A (Please look up customer first)</p>}
                            </Box>{' '}
                        </SimpleGrid>
                    </FlexWrapper>
                    {vehicleData && customerData && <SaleForm />}
                </Center>
            </Box>
        </OuterContainer>
    )
}

export { SalePage }
