import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
    Heading,
    FormControl,
    FormLabel,
    Center,
    HStack,
    VStack,
    Input,
    Button,
    Textarea,
    Text,
    useToast,
    Select,
    Alert,
    AlertIcon,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Tag,
    Box,
    SimpleGrid,
    Link,
} from '@chakra-ui/react'
import Axios from '../_helpers/axios'

import { Formik, Form, ErrorMessage, FieldArray } from 'formik'
import * as Yup from 'yup'
import { VehicleType } from '../_helpers'
import { HiOutlineMinusCircle, HiOutlinePlusCircle } from 'react-icons/hi'

const OuterContainer = styled.div`
    margin: 5% 0;
    max-width: 100%;
    max-height: 100%;
`

const regularRequiredFields = [
    { name: 'vin', title: 'VIN' },
    { name: 'mfrname', title: 'Manufacturer Name' },
    { name: 'modelyear', title: 'Model Year' },
    { name: 'modelname', title: 'Model Name' },
    { name: 'invoiceprice', title: 'Invoice Price' },
]

const vehicleTypeSpecificFields = [
    {
        name: 'cargocapacity',
        title: 'Cargo capacity (in tons)',
        forType: VehicleType.Truck,
        isRequired: true,
    },
    {
        name: 'cargocovertype',
        title: 'Cargo cover type',
        forType: VehicleType.Truck,
        isRequired: false,
    },
    {
        name: 'numrearaxles',
        title: 'Number of rear axles',
        forType: VehicleType.Truck,
        isRequired: true,
    },
    {
        name: 'driversidebackdoor',
        title: 'Has Driver’s Side Back Door',
        forType: VehicleType.Van,
        isRequired: true,
    },
    {
        name: 'numdoors',
        title: 'Number of doors',
        forType: VehicleType.Car,
        isRequired: true,
    },
    {
        name: 'rooftype',
        title: 'Roof type',
        forType: VehicleType.Convertible,
        isRequired: true,
    },
    {
        name: 'backseatcount',
        title: 'Back seat count',
        forType: VehicleType.Convertible,
        isRequired: true,
    },
    {
        name: 'drivetrain',
        title: 'Drivetrain type (FWD, 4WD, AWD, etc.)',
        forType: VehicleType.Suv,
        isRequired: true,
    },
    {
        name: 'numcupholder',
        title: 'Number of cupholders',
        forType: VehicleType.Suv,
        isRequired: true,
    },
]

const vehicleDetailsList = {
    vin: 'VIN',
    vehicletype: 'Vehicle Type',
    mfrname: 'Manufacturer',
    modelyear: 'Model Year',
    modelname: ' Model Name',
    listprice: 'List Price',
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

const AddVehiclePage = ({ user, manufacturers, colors }) => {
    const [vehicle, getVehicle] = useState(null)
    const [vin, setVin] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    useEffect(() => {
        if (vin) {
            Axios.get(`/vehicle/vehicledetail/${vin}`).then((res) => {
                getVehicle(res.data[0])
            })
        }
    }, [vin, user])

    const addVehicleInitialValues = {
        vin: '',
        mfrname: '',
        modelname: '',
        modelyear: '',
        vdescription: '',
        invoiceprice: '',
        icfirstname: user.firstname,
        iclastname: user.lastname,
        dateadded: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[0],
        vehicletype: '',
        color: [''],
        cargocapacity: '',
        cargocovertype: '',
        numrearaxles: '',
        driversidebackdoor: '',
        numdoors: '',
        rooftype: '',
        backseatcount: '',
        numcupholder: '',
        drivetrain: '',
    }

    const addVehicleValidationSchema = Yup.object().shape({
        vin: Yup.string().max(17).required('VIN is required'),
        mfrname: Yup.string().required('Manufacturer name is required'),
        modelname: Yup.string().required('Model name is required'),
        modelyear: Yup.number()
            .integer('Model year must be a valid number.')
            .typeError('Model year must be a valid number.')
            .min(1950, "Model year's min value is 1950.")
            .max(2022, "Model year's max value is 2022.")
            .required('Model year is required'),
        invoiceprice: Yup.number()
            .typeError('Invoice price must be a valid number.')
            .min(0, "Invoice price's min value is 0.")
            .required('Invoice price is required'),
        vdescription: Yup.string(),
        icfirstname: Yup.string().required(),
        iclastname: Yup.string().required(),
        dateadded: Yup.string().required(),
        vehicletype: Yup.string().required('Vehicle type is required'),
        color: Yup.array()
            .of(Yup.string().required('Must choose a color'))
            .required('Color is required'),
        cargocapacity: Yup.number().when('vehicletype', {
            is: VehicleType.Truck,
            then: Yup.number()
                .max(10)
                .typeError('Must be a valid number')
                .required('Cargo capacity (in tons) is required'),
        }),
        cargocovertype: Yup.string().max(25), //optional
        numrearaxles: Yup.number().when('vehicletype', {
            is: VehicleType.Truck,
            then: Yup.number()
                .positive()
                .max(127)
                .typeError('Must be a valid number')
                .required('Number of rear axles is required'),
        }),
        driversidebackdoor: Yup.string().when('vehicletype', {
            is: VehicleType.Van,
            then: Yup.string().required('Has Driver’s Side Back Door is required'), // 0 or 1
        }),
        numdoors: Yup.number().when('vehicletype', {
            is: VehicleType.Car,
            then: Yup.number()
                .positive()
                .max(127)
                .typeError('Must be a valid number')
                .required('Number of doors is required'),
        }),
        rooftype: Yup.string().when('vehicletype', {
            is: VehicleType.Convertible,
            then: Yup.string().required('Roof type is required'),
        }),
        backseatcount: Yup.number().when('vehicletype', {
            is: VehicleType.Convertible,
            then: Yup.number()
                .positive()
                .max(127)
                .typeError('Must be a valid number')
                .required('Back seat count is required'),
        }),
        numcupholder: Yup.number().when('vehicletype', {
            is: VehicleType.Suv,
            then: Yup.number()
                .positive()
                .max(127)
                .typeError('Must be a valid number')
                .required('Number of cupholders is required'),
        }),
        drivetrain: Yup.string().when('vehicletype', {
            is: VehicleType.Suv,
            then: Yup.string().max(4).required('Drivetrain type (FWD, 4WD, AWD, etc.) is required'),
        }),
    })

    const addVehicle = (data, setStatus, setSubmitting) => {
        Axios.post(`/vehicle/addvehicle`, data)
            .then((response) => {
                toast({
                    title: `Vehicle Added!`,
                    description: 'Directing you to the vehicle detail page.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
                setSubmitting(false)
                setVin(data.vin)
                onOpen()
            })
            .catch((error) => {
                const errorMessage = error.response.data.message
                setStatus(errorMessage)
                setSubmitting(false)
            })
    }

    return (
        <OuterContainer>
            <Center>
                <Heading as="h1">Add Vehicle</Heading>
            </Center>
            <Formik
                initialValues={addVehicleInitialValues}
                validationSchema={addVehicleValidationSchema}
                onSubmit={(data, { setStatus, setSubmitting }) => {
                    console.log(data)
                    setStatus()
                    addVehicle(data, setStatus, setSubmitting)
                }}
            >
                {({ values, status, handleChange, isSubmitting }) => (
                    <Form>
                        <VStack>
                            <HStack align="start" justify="space-evenly" spacing="24px">
                                <VStack width="500px" minWidth="50%">
                                    {regularRequiredFields.map(({ name, title }, i) => {
                                        return (
                                            <FormControl mt={2} key={i}>
                                                <HStack>
                                                    <FormLabel w="50%">
                                                        {title}
                                                        <span style={{ color: 'red' }}>{' *'}</span>
                                                    </FormLabel>
                                                    {name == 'mfrname' ? (
                                                        <Select
                                                            name="mfrname"
                                                            placeholder="Select"
                                                            onChange={handleChange}
                                                        >
                                                            {manufacturers.map((item, index) => {
                                                                return (
                                                                    <option key={index}>
                                                                        {item}
                                                                    </option>
                                                                )
                                                            })}
                                                        </Select>
                                                    ) : (
                                                        <Input
                                                            name={name}
                                                            type="text"
                                                            placeholder={title}
                                                            onChange={handleChange}
                                                        />
                                                    )}
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
                                    <FormControl mt={2}>
                                        <HStack>
                                            <FormLabel w="50%">Description</FormLabel>
                                            <Textarea
                                                name="vdescription"
                                                type="text"
                                                placeholder="Vehicle Description"
                                                onChange={handleChange}
                                            />
                                        </HStack>
                                    </FormControl>
                                </VStack>
                                <VStack width="500px" minWidth="50%">
                                    <FieldArray
                                        name="color"
                                        render={(arrayHelpers) =>
                                            values.color.map((color, index) => (
                                                <FormControl mt={2} key={index}>
                                                    <HStack>
                                                        <FormLabel w="50%">
                                                            {`Color ${index + 1}`}
                                                            <span style={{ color: 'red' }}>
                                                                {' *'}
                                                            </span>
                                                        </FormLabel>
                                                        <Select
                                                            marginLeft="0px"
                                                            w={index == 0 ? '92%' : '83%'}
                                                            name={`color.${index}`}
                                                            placeholder="Select"
                                                            onChange={handleChange}
                                                        >
                                                            {colors.map((item, index) => (
                                                                <option key={index}>{item}</option>
                                                            ))}
                                                        </Select>
                                                        {index != 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    arrayHelpers.remove(index)
                                                                } // remove a color from the list
                                                            >
                                                                <HiOutlineMinusCircle
                                                                    style={{ fontSize: 20 }}
                                                                />
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                arrayHelpers.insert(index + 1, '')
                                                            } // insert an empty string at a position
                                                        >
                                                            <HiOutlinePlusCircle
                                                                style={{ fontSize: 20 }}
                                                            />
                                                        </button>
                                                    </HStack>
                                                    <ErrorMessage
                                                        style={{
                                                            marginLeft: 186,
                                                            color: 'red',
                                                            fontSize: 14,
                                                        }}
                                                        name={`color.${index}`}
                                                        component="div"
                                                        className="invalid-feedback"
                                                    />
                                                </FormControl>
                                            ))
                                        }
                                    />
                                    <FormControl mt={2}>
                                        <HStack>
                                            <FormLabel w="50%">
                                                Vehicle Type
                                                <span style={{ color: 'red' }}>{' *'}</span>
                                            </FormLabel>
                                            <Select
                                                name="vehicletype"
                                                onChange={handleChange}
                                                placeholder="Select"
                                            >
                                                {Object.keys(VehicleType).map((key) => (
                                                    <option key={key}>{VehicleType[key]}</option>
                                                ))}
                                            </Select>
                                        </HStack>
                                        <ErrorMessage
                                            style={{
                                                marginLeft: 186,
                                                color: 'red',
                                                fontSize: 14,
                                            }}
                                            name="vehicletype"
                                            component="div"
                                            className="invalid-feedback"
                                        />
                                    </FormControl>

                                    {vehicleTypeSpecificFields.map(
                                        ({ name, title, forType, isRequired }, i) => {
                                            if (forType == values.vehicletype)
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
                                                            {name == 'driversidebackdoor' ? (
                                                                <Select
                                                                    marginLeft="0px"
                                                                    w="100%"
                                                                    name="driversidebackdoor"
                                                                    placeholder="Select"
                                                                    onChange={handleChange}
                                                                >
                                                                    <option value={1}>Yes</option>
                                                                    <option value={0}>No</option>
                                                                </Select>
                                                            ) : (
                                                                <Input
                                                                    name={name}
                                                                    type="text"
                                                                    placeholder={title}
                                                                    onChange={handleChange}
                                                                />
                                                            )}
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
                                        }
                                    )}
                                </VStack>
                            </HStack>
                            <VStack borderRadius="10px" border="1px" width="400px" padding="10px">
                                <FormControl mt={2}>
                                    <HStack>
                                        <FormLabel w="60%">
                                            {"Inventory clerk's first name"}
                                        </FormLabel>
                                        <Text>{values.icfirstname} </Text>
                                    </HStack>
                                </FormControl>
                                <FormControl mt={2}>
                                    <HStack>
                                        <FormLabel w="60%">
                                            {"Inventory clerk's last name"}
                                        </FormLabel>
                                        <Text>{values.iclastname} </Text>
                                    </HStack>
                                </FormControl>
                                <FormControl mt={2}>
                                    <HStack>
                                        <FormLabel w="60%">{'Date added'}</FormLabel>
                                        <Text>{values.dateadded} </Text>
                                    </HStack>
                                </FormControl>
                                <Button
                                    colorScheme="blue"
                                    variant="outline"
                                    size="md"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    Add Vehicle
                                </Button>
                            </VStack>
                        </VStack>
                        {status && (
                            <Alert status="error">
                                <AlertIcon />
                                {status}
                            </Alert>
                        )}
                    </Form>
                )}
            </Formik>
            <Drawer
                size={user && (user.mgr == 1 || user.ic == 1 || user.own == 1) ? 'xl' : 'md'}
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Vehicle Details Page</DrawerHeader>
                    <DrawerBody>
                        <SimpleGrid columns={2} spacing={30}>
                            {vehicle && (
                                <Box>
                                    <FormLabel htmlFor="desc">Vehicle Details</FormLabel>
                                    {Object.keys(vehicleDetailsList).map((key) => {
                                        return (
                                            vehicle[key] != null && (
                                                <Tag key={key} variant="outline" colorScheme="blue">
                                                    {`${vehicleDetailsList[key]}: ${vehicle[key]}`}
                                                </Tag>
                                            )
                                        )
                                    })}
                                </Box>
                            )}
                            {vehicle && user && (user.mgr == 1 || user.own == 1) && (
                                <Box>
                                    <FormLabel htmlFor="desc">Additional Details</FormLabel>

                                    <Tag variant="outline" colorScheme="red">
                                        {`Invoice Price: ${vehicle.invoiceprice}`}
                                    </Tag>
                                    <Tag variant="outline" colorScheme="red">
                                        {`Associated Inventory Clerk: ${vehicle.icfirstname} ${vehicle.iclastname}`}
                                    </Tag>
                                    <Tag variant="outline" colorScheme="red">
                                        {`Date Added: ${vehicle.dateadded.split('T')[0]}`}
                                    </Tag>
                                </Box>
                            )}
                            {vehicle && user && user.ic == 1 && user.own == 0 && (
                                <Box>
                                    <FormLabel htmlFor="desc">Additional Details</FormLabel>

                                    <Tag variant="outline" colorScheme="red">
                                        {`Invoice Price: ${vehicle.invoiceprice}`}
                                    </Tag>
                                </Box>
                            )}
                        </SimpleGrid>
                    </DrawerBody>
                    <DrawerFooter>
                        <Button variant="outline" mr={3} onClick={onClose}>
                            Back to Search Vehicle
                        </Button>
                        {user && (user.sp == 1 || user.own == 1) && (
                            <Link
                                to={{
                                    pathname: '/sale',
                                    vehicleData: vehicle,
                                    user: user,
                                }}
                            >
                                <Button colorScheme="teal" mr={3}>
                                    Sell
                                </Button>
                            </Link>
                        )}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </OuterContainer>
    )
}

export { AddVehiclePage }
