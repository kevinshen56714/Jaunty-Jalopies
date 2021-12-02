/* eslint-disable react/no-children-prop */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Axios from 'axios'
import {
    Heading,
    Input,
    Select,
    Center,
    InputGroup,
    InputLeftElement,
    Button,
    Stack,
    Divider,
    Badge,
    Tab,
    Tabs,
    TabList,
    Text,
    HStack,
    Spinner,
    useColorModeValue,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import config from 'config'
import { FaShuttleVan, FaTruck, FaCarSide } from 'react-icons/fa'
import { FiCheckCircle } from 'react-icons/fi'
import { GiCityCar, GiRaceCar } from 'react-icons/gi'
import { VehicleDetails } from '../_components/VehicleDetails'
import { VehicleType } from '../_helpers'
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const OuterContainer = styled.div`
    margin: 5% 0;
    max-height: 100%;
    display: flex;
    flex-direction: column;
`

const CardItems = styled.div`
    position: relative;
    width: 170px;
    height: 220px;
    border-radius: 6px;
    border: 1px solid #dfdfdf;
    overflow: hidden;
    text-align: left;
    .card-text {
        margin-left: 10px;
    }
    .bottom-context {
        position: absolute;
        bottom: 0px;
        width: 100%;
    }
    &:hover {
        cursor: pointer;
        transform: scale(1.1);
        -webkit-transform: scale(1.1);
        box-shadow: 0 20px 40px -14px rgba(0, 0, 0, 0.25);
    }
`

const FlexWrapper = styled.div`
    width: 60%;
    min-width: 800px;
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
`

const StyledForm = styled(Form)`
    width: 100%;
    justify-content: center;
    text-align: center;
    border: 1px solid #e9e9e9;
    box-shadow: 5px 5px 10px -14px rgba(0, 0, 0, 0.25);
    margin: 8px 16px;
    border-radius: 16px;
`

const ResultWrapper = styled.div`
    margin-top: 30px;
    width: 80%;
    justify-content: center;
    text-align: center;
`

const ResultCardWrapper = styled.div`
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
`

const CarIconWrapper = styled.div`
    display: flex;
    justify-content: center;
`

const soldFilterOption = [
    { name: 'All', value: [0, 1] },
    { name: 'Sold', value: [1] },
    { name: 'Unsold', value: [0] },
]

const renderVehicleIcon = (vehicleType) => {
    switch (vehicleType) {
        case VehicleType.Car:
            return <FaCarSide style={{ fontSize: '25px', margin: '10px' }} />
        case VehicleType.Convertible:
            return <GiRaceCar style={{ fontSize: '39px', margin: '3px' }} />
        case VehicleType.Suv:
            return <GiCityCar style={{ fontSize: '37px', margin: '4px' }} />
        case VehicleType.Truck:
            return <FaTruck style={{ fontSize: '25px', margin: '10px' }} />
        case VehicleType.Van:
            return <FaShuttleVan style={{ fontSize: '25px', margin: '10px' }} />
    }
}

export function SearchVehicle({ user, manufacturers, colors }) {
    const [vehicleCount, setVehiclCount] = useState(0)
    const [searchResult, setSearchResult] = useState(null)
    const [filterSold, setFilterSold] = useState(soldFilterOption[0].value)
    const [soldStatus, setSoldStatus] = useState([0, 0, 0])
    const tcl = useColorModeValue('gray.900', 'gray.50')

    const initialValues = {
        keyword: '',
        vin: '',
        modelyear: '',
        greaterThan: '1',
        invoiceprice: '',
        color: '',
        vehicletype: '',
        mfrname: '',
    }
    const validationSchema = Yup.object().shape({
        keyword: Yup.string(),
        vin: Yup.string().max(17),
        modelyear: Yup.number()
            .transform((value, originalValue) =>
                String(originalValue).trim() === '' ? null : value
            )
            .integer('Model year must be a valid number.')
            .typeError('Model year must be a valid number.')
            .min(1950, "Model year's min value is 1950.")
            .max(2022, "Model year's max value is 2022.")
            .nullable(),
        greaterThan: Yup.string(),
        invoiceprice: Yup.number()
            .transform((value, originalValue) =>
                String(originalValue).trim() === '' ? null : value
            )
            .typeError('Price must be a valid number.')
            .min(0, 'Price must be a positive number.')
            .nullable(),
        color: Yup.string(),
        vehicletype: Yup.string(),
        mfrname: Yup.string(),
    })

    const searchVehicle = (data, setStatus, setSubmitting) => {
        // if the data value is a empty string, manually replace it with null for GET method url
        const obj = initialValues
        Object.keys(data).map((key) => {
            data[key] === '' ? (obj[key] = null) : (obj[key] = data[key])
        })
        const { vin, keyword, modelyear, mfrname, color, vehicletype, invoiceprice, greaterThan } =
            obj
        Axios.get(
            `${config.apiUrl}/vehicle/search/${vin}/${keyword}/${modelyear}/${mfrname}/${color}/${vehicletype}/${invoiceprice}/${greaterThan}`
        )
            .then((response) => {
                // same vehicle may show up multiple times due to having more than 1 colors
                // the following method filter out rows with duplicated vin
                response.data = response.data.filter(
                    (data, index, self) => index === self.findIndex((t) => t.vin === data.vin)
                )
                setSearchResult(response.data)
                const numTotal = response.data.length
                const numSold = response.data.filter((key) => key.sold == 1).length
                setSoldStatus([numTotal, numSold, numTotal - numSold])
                setFilterSold(soldFilterOption[2].value)
                setSubmitting(false)
            })
            .catch((error) => {
                const errorMessage = error.response.data.message
                if (errorMessage) {
                    setStatus(errorMessage)
                }
                setSubmitting(false)
            })
    }

    useEffect(() => {
        var mounted = true

        Axios.get(`${config.apiUrl}/vehicle/count`)
            .then((res) => {
                if (mounted) {
                    setVehiclCount(res.data[0].TotalVehicleCountForSale)
                }
            })
            .catch((error) => console.log(error.response))

        return () => (mounted = false)
    }, [])

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(data, { setStatus, setSubmitting }) => {
                setStatus()
                searchVehicle(data, setStatus, setSubmitting)
            }}
        >
            {({ status, handleChange, isSubmitting }) => (
                <OuterContainer>
                    <Stack align="end">
                        <Badge variant="outline" marginRight="48px">
                            {`Total Number of Unsold Vehicles: ${vehicleCount}`}
                        </Badge>
                    </Stack>
                    <Heading as="h1">
                        <center> Jaunty Jalopies </center>
                    </Heading>
                    <Center>
                        <FlexWrapper>
                            <StyledForm
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    border: '1px solid #e9e9e9',
                                    boxShadow: '10px 10px 20px -14px rgba(0, 0, 0, 0.25)',
                                    margin: '8px 16px',
                                    borderRadius: '16px',
                                }}
                            >
                                <HStack margin="20px">
                                    <InputGroup size="lg">
                                        <InputLeftElement
                                            pointerEvents="none"
                                            children={<SearchIcon color="gray.400" />}
                                        />
                                        <Input
                                            fontSize="16px"
                                            name="keyword"
                                            type="text"
                                            placeholder="Enter any keyword"
                                            onChange={handleChange}
                                            _placeholder={{
                                                color: tcl,
                                            }}
                                        />
                                    </InputGroup>
                                    {user && (
                                        <InputGroup size="lg" width="50%">
                                            <InputLeftElement
                                                pointerEvents="none"
                                                children={<SearchIcon color="gray.400" />}
                                            />
                                            <Input
                                                fontSize="16px"
                                                name="vin"
                                                type="text"
                                                placeholder="VIN"
                                                onChange={handleChange}
                                                _placeholder={{ color: tcl }}
                                            />
                                        </InputGroup>
                                    )}
                                    <InputGroup size="lg" width="50%">
                                        <InputLeftElement
                                            pointerEvents="none"
                                            children={<SearchIcon color="gray.400" />}
                                        />
                                        <Input
                                            fontSize="16px"
                                            name="modelyear"
                                            type="text"
                                            placeholder="Model year"
                                            onChange={handleChange}
                                            _placeholder={{ color: tcl }}
                                        />
                                    </InputGroup>
                                    <InputGroup size="lg">
                                        <InputLeftElement width="60%">
                                            <Select
                                                fontSize="16px"
                                                size="lg"
                                                name="greaterThan"
                                                onChange={handleChange}
                                            >
                                                <option value="1">Greater Than</option>
                                                <option value="0">Less Than or Equal To</option>
                                            </Select>
                                        </InputLeftElement>
                                        <InputLeftElement
                                            marginLeft="60%"
                                            pointerEvents="none"
                                            fontSize="1.2em"
                                            color="gray.500"
                                            children="$"
                                        />
                                        <Input
                                            fontSize="16px"
                                            marginLeft="60%"
                                            name="invoiceprice"
                                            type="text"
                                            placeholder="Price"
                                            onChange={handleChange}
                                            _placeholder={{ color: tcl }}
                                        ></Input>
                                    </InputGroup>
                                </HStack>
                                <HStack margin="20px">
                                    <Select
                                        fontSize="16px"
                                        size="lg"
                                        name="color"
                                        placeholder="What color do you like?"
                                        onChange={handleChange}
                                    >
                                        {colors.map((item, index) => {
                                            return <option key={index}>{item}</option>
                                        })}
                                    </Select>
                                    <Select
                                        fontSize="16px"
                                        size="lg"
                                        name="vehicletype"
                                        placeholder="What type of vehicle?"
                                        onChange={handleChange}
                                    >
                                        {Object.keys(VehicleType).map((key) => {
                                            return <option key={key}>{VehicleType[key]}</option>
                                        })}
                                    </Select>
                                    <Select
                                        fontSize="16px"
                                        size="lg"
                                        name="mfrname"
                                        placeholder="Which manufacturer?"
                                        onChange={handleChange}
                                    >
                                        {manufacturers.map((item, index) => {
                                            return <option key={index}>{item}</option>
                                        })}
                                    </Select>
                                    <Button
                                        size="lg"
                                        colorScheme="teal"
                                        type="submit"
                                        width="50%"
                                        border="2px"
                                        isLoading={isSubmitting}
                                        leftIcon={<SearchIcon />}
                                    >
                                        Search
                                    </Button>
                                </HStack>
                                <ErrorMessage
                                    name="modelyear"
                                    component="div"
                                    className="invalid-feedback"
                                    style={{ color: 'red' }}
                                />
                                <ErrorMessage
                                    name="invoiceprice"
                                    component="div"
                                    className="invalid-feedback"
                                    style={{ color: 'red' }}
                                />
                                <ErrorMessage
                                    name="vin"
                                    component="div"
                                    className="invalid-feedback"
                                    style={{ color: 'red' }}
                                />
                                {status && <div className={'alert alert-danger'}> {status} </div>}
                            </StyledForm>
                        </FlexWrapper>
                    </Center>
                    <Center>
                        <ResultWrapper>
                            {isSubmitting ? (
                                <>
                                    <Divider />
                                    <Text marginTop="20px" fontSize="xl">
                                        Grabbing results from database... Almost there...
                                    </Text>
                                    <Spinner size="xl" marginTop="20px" />
                                </>
                            ) : (
                                searchResult &&
                                (soldStatus[0] == 0 ||
                                (soldStatus[2] == 0 && (!user || user.mgr == 0)) ? (
                                    <>
                                        <Divider />
                                        <Text marginTop="20px" fontSize="xl">
                                            {"Sorry, it looks like we don't have that in stock!"}
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        <Divider />
                                        <Heading marginTop="20px" as="h3" size="lg">
                                            {`Search Results${
                                                user && user.mgr == 1 ? '' : ` (${soldStatus[2]})`
                                            }`}
                                        </Heading>
                                        {user && user.mgr == 1 && (
                                            <HStack>
                                                <Heading as="h5" size="sm">
                                                    Sorted By:
                                                </Heading>
                                                <Tabs
                                                    width="90%"
                                                    variant="enclosed"
                                                    colorScheme="green"
                                                    defaultIndex={2}
                                                >
                                                    <TabList>
                                                        {soldFilterOption.map(
                                                            ({ name, value }, i) => {
                                                                return (
                                                                    <Tab
                                                                        key={i}
                                                                        onClick={() => {
                                                                            setFilterSold(value)
                                                                        }}
                                                                        _focus={{
                                                                            boxShadow: 'none',
                                                                        }}
                                                                    >
                                                                        {name}
                                                                        <Badge
                                                                            colorScheme="green"
                                                                            marginLeft="10px"
                                                                            borderRadius="16px"
                                                                        >
                                                                            {soldStatus[i]}
                                                                        </Badge>
                                                                    </Tab>
                                                                )
                                                            }
                                                        )}
                                                    </TabList>
                                                </Tabs>
                                            </HStack>
                                        )}
                                        <ResultCardWrapper>
                                            {searchResult &&
                                                searchResult.map((item, index) => {
                                                    const {
                                                        vin,
                                                        modelyear,
                                                        mfrname,
                                                        modelname,
                                                        vehicletype,
                                                        listprice,
                                                        color,
                                                        description,
                                                        sold,
                                                        matched_description,
                                                    } = item
                                                    return (
                                                        filterSold.includes(sold) && (
                                                            <CardItems key={index}>
                                                                {matched_description == 1 && (
                                                                    <FiCheckCircle
                                                                        style={{
                                                                            color: 'green',
                                                                            position: 'absolute',
                                                                            top: 5,
                                                                            right: 5,
                                                                        }}
                                                                    />
                                                                )}
                                                                <CarIconWrapper>
                                                                    {renderVehicleIcon(vehicletype)}
                                                                </CarIconWrapper>
                                                                <div className="card-text">
                                                                    <Text fontSize="md">
                                                                        {`${modelyear} ${mfrname} ${modelname}`}
                                                                    </Text>
                                                                </div>
                                                                <div className="bottom-context">
                                                                    <div className="card-text">
                                                                        <Heading size="xs">{`$${listprice}`}</Heading>
                                                                        <Text
                                                                            fontSize="sm"
                                                                            color="gray.500"
                                                                        >{`${vehicletype} - ${color.replaceAll(
                                                                            ',',
                                                                            ', '
                                                                        )}`}</Text>
                                                                        <Text
                                                                            fontSize="xs"
                                                                            as="samp"
                                                                        >
                                                                            {`VIN: ${vin}`}
                                                                        </Text>
                                                                        <Text fontSize="sm">
                                                                            {description}
                                                                        </Text>
                                                                    </div>
                                                                    <VehicleDetails
                                                                        key={vin}
                                                                        searchedvin={vin}
                                                                        user={user}
                                                                        sold={sold}
                                                                    />
                                                                </div>
                                                            </CardItems>
                                                        )
                                                    )
                                                })}
                                        </ResultCardWrapper>
                                    </>
                                ))
                            )}
                        </ResultWrapper>
                    </Center>
                </OuterContainer>
            )}
        </Formik>
    )
}
