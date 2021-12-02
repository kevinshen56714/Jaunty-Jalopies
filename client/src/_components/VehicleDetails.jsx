/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { Redirect, withRouter } from 'react-router-dom'
import {
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Text,
    Tag,
    Box,
    FormLabel,
    SimpleGrid,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'
import Axios from 'axios'
import config from 'config'
import { Link } from 'react-router-dom'

export const FlexWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
`
export const SearchContainer = styled.div`
    margin: 10px;
`

export const ButtonWrapper = styled.div`
    margin-right: 48px;
`

export const FlexItems = styled.div`
    width: 30%;
    flex-grow: 1;
    min-height: auto;
    box-sizing: border-box;
    margin: 10px;
    justify-content: space-between;
    text-align: center;
`

export const ItemDiv = styled.div`
    display: flex;
`

export const OuterContainer = styled.div`
    margin: 5% 0;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    max-height: 100%;
`

export const FormWrapper = styled.div`
    margin: 10px 0;
`

export const LabelWrapper = styled.label`
    padding-right: 1ch;
`

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

const VehicleDetails = ({ searchedvin, user, sold }) => {
    const [vehicle, getVehicle] = useState(null)
    const btnRef = useRef()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [custDetails, setCustDetails] = useState([])
    const [repair, setRepair] = useState([])

    const getVehicleDetail = async () => {
        const res = await Axios.get(`${config.apiUrl}/vehicle/vehicledetail/${searchedvin}`)
        getVehicle(res.data[0])

        if (sold) {
            const res3 = await Axios.get(`${config.apiUrl}/repair/findrepair/${searchedvin}`)
            setRepair(res3.data)
            const res4 = await Axios.get(`${config.apiUrl}/sale/getcusinfo/${searchedvin}`)
            setCustDetails(res4.data)
        }
    }

    useEffect(() => {
        getVehicleDetail()
    }, [searchedvin, user, sold])

    return (
        <>
            <Button
                ref={btnRef}
                size="sm"
                variant="outline"
                colorScheme="teal"
                onClick={onOpen}
                width="100%"
            >
                View Details
            </Button>
            <Drawer
                size={user && (user.mgr == 1 || user.ic == 1 || user.own == 1) ? 'xl' : 'md'}
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                finalFocusRef={btnRef}
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
                            {vehicle && user && (user.mgr == 1 || user.own == 1) && sold == 1 && (
                                <>
                                    <Box>
                                        <Accordion allowToggle>
                                            <AccordionItem>
                                                <h2>
                                                    <AccordionButton>
                                                        <Box flex="1" textAlign="left">
                                                            Sale Details
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                </h2>

                                                {custDetails ? (
                                                    custDetails &&
                                                    custDetails.map((c, i) => (
                                                        <AccordionPanel pb={4} key={i}>
                                                            <Text>
                                                                Buyer Name: {c.CustomerName}
                                                            </Text>
                                                            <Text> Address: {c.Address}</Text>
                                                            <Text> City: {c.City}</Text>
                                                            <Text> State: {c.State}</Text>
                                                            <Text> Zipcode: {c.Zip}</Text>
                                                            <Text>Phone Number: {c.Phone}</Text>
                                                            <Text> Email: {c.Email}</Text>
                                                            <Text>List Price: {c.ListPrice}</Text>
                                                            <Text>Sold Price: {c.SoldPrice}</Text>
                                                            <Text>
                                                                Sales Date:
                                                                {c.SalesDate.substring(0, 10)}
                                                            </Text>
                                                            <Text>
                                                                Salesperson Name : {c.SpName}
                                                            </Text>
                                                        </AccordionPanel>
                                                    ))
                                                ) : (
                                                    <Text>There are no Sale details.</Text>
                                                )}
                                            </AccordionItem>
                                        </Accordion>
                                    </Box>
                                    <Box>
                                        <Accordion allowToggle>
                                            <AccordionItem>
                                                <h2>
                                                    <AccordionButton>
                                                        <Box flex="1" textAlign="left">
                                                            Repair Details
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                </h2>
                                                {repair ? (
                                                    repair &&
                                                    repair.map((r, i) => (
                                                        <AccordionPanel pb={4} key={i}>
                                                            <Text>
                                                                Customer Name: {r.CustomerName}
                                                            </Text>
                                                            <Text>
                                                                Servicewriter Name:
                                                                {r.ServiceWriterName}
                                                            </Text>
                                                            <Text>
                                                                Start Date:
                                                                {r.StartDate.split('T')[0]}
                                                            </Text>
                                                            <Text>
                                                                Complete Date:
                                                                {r.CompleteDate
                                                                    ? r.CompleteDate.split('T')[0]
                                                                    : 'N/A'}
                                                            </Text>
                                                            <Text>
                                                                Labor Charges: {r.LaborCharges}
                                                            </Text>
                                                            <Text>
                                                                Total Parts Cost:
                                                                {r.TotalPartsCost}
                                                            </Text>
                                                            <Text>Total Costs: {r.TotalCosts}</Text>
                                                        </AccordionPanel>
                                                    ))
                                                ) : (
                                                    <Text>There is no repair found.</Text>
                                                )}
                                            </AccordionItem>
                                        </Accordion>
                                    </Box>
                                </>
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
                                <Button colorScheme="teal" mr={3} disabled={sold}>
                                    Sell
                                </Button>
                            </Link>
                        )}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export { VehicleDetails }
