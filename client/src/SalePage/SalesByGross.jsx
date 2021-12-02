/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
    Heading,
    Center,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Table,
    Container,
    Stack,
    Button,
    Divider,
    Portal,
    Box,
    Text,
    Tag,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
} from '@chakra-ui/react'
import Axios from '../_helpers/axios'

export const OuterContainer = styled.div`
    margin: 5% 0;
    max-width: 100%;
    max-height: 100%;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
`

export const Hidden = styled.th`
    display: none;
`

export const TdAlign = styled.div`
    vertical-align: middle;
    text-align: center;
    padding-top: 20px;
`

const SalesByGross = () => {
    const [customers, getCustomers] = useState([])
    const [sales, getSales] = useState([])
    const [repairs, getRepairs] = useState([])
    const [custID, getCustID] = useState([])

    useEffect(() => {
        const getAll = async () => {
            const allCust = await Axios.get(`/sale/salesbygross/allcust`)
            getCustomers(allCust.data)
        }
        getAll()
    }, [])

    useEffect(() => {
        const getS = async () => {
            const fetchSales = await Axios.get(`/sale/salesbygross/year/${custID}`)
            getSales(fetchSales.data)
        }
        getS()
    }, [custID])

    useEffect(() => {
        const getR = async () => {
            const fetchRepairs = await Axios.get(`/sale/salesbygross/alltime/${custID}`)
            getRepairs(fetchRepairs.data)
        }
        getR()
    }, [custID])

    const handleClick = (e) => {
        let selectedcustID = e.currentTarget.getAttribute('data-id')
        getCustID(selectedcustID)
        const fetchSales = Axios.get(`/sale/salesbygross/year/${selectedcustID}`)
        getSales(fetchSales.data)
        const fetchRepairs = Axios.get(`/sale/salesbygross/alltime/${selectedcustID}`)
        getRepairs(fetchRepairs.data)
    }

    return (
        <OuterContainer>
            <Container>
                <Heading as="h1">Sales By Gross Income</Heading>
                <Center>
                    <Stack>
                        <Table size="lg">
                            <Thead>
                                <Tr>
                                    <Th>Customer Name</Th>
                                    <Th>First Date</Th>
                                    <Th>Most Recent Date</Th>
                                    <Th>Number of Sales</Th>
                                    <Th>Number of Repairs</Th>
                                    <Th>Total Gross Income</Th>
                                    <Th>More Details</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {customers &&
                                    customers.map((c, i) => (
                                        <Tr key={i} data-id={c.custID} onClick={handleClick}>
                                            <Td>{c.CustomerName}</Td>
                                            <Td>{c.FirstDate.substring(0, 10)}</Td>
                                            <Td>{c.MostRecentDate.substring(0, 10)}</Td>
                                            <Td>{c.NumSales}</Td>
                                            <Td>{c.NumRepairs}</Td>
                                            <Td>{c.TotalGrossIncome}</Td>
                                            <TdAlign>
                                                <Popover>
                                                    <PopoverTrigger>
                                                        <Button
                                                            colorScheme="teal"
                                                            data-id={c.custID}
                                                            onClick={handleClick}
                                                        >
                                                            More Details
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <Portal>
                                                        <PopoverContent>
                                                            <PopoverArrow />
                                                            <PopoverHeader>
                                                                Vehicle Sales and Vehicle Repairs
                                                            </PopoverHeader>
                                                            <PopoverCloseButton />
                                                            <PopoverBody>
                                                                <Text>Vehicle Sales Section</Text>
                                                                {sales &&
                                                                    sales.map((s, i) => (
                                                                        <Box key={i}>
                                                                            <Tag variant="outline">
                                                                                Sale Date:{' '}
                                                                                <Text>
                                                                                    {s.SaleDate.substring(
                                                                                        0,
                                                                                        10
                                                                                    )}
                                                                                </Text>
                                                                            </Tag>
                                                                            <Tag variant="outline">
                                                                                Sold Price:{' '}
                                                                                <Text>
                                                                                    {s.SoldPrice}
                                                                                </Text>
                                                                            </Tag>
                                                                            <Tag variant="outline">
                                                                                VIN:{' '}
                                                                                <Text>{s.VIN}</Text>
                                                                            </Tag>
                                                                            <Tag variant="outline">
                                                                                Model Year:{' '}
                                                                                <Text>
                                                                                    {s.ModelYear}
                                                                                </Text>
                                                                            </Tag>
                                                                            <Tag variant="outline">
                                                                                Manufacturer Name:{' '}
                                                                                <Text>
                                                                                    {
                                                                                        s.ManufacturerName
                                                                                    }
                                                                                </Text>
                                                                            </Tag>
                                                                            <Tag variant="outline">
                                                                                Salesperson Name:{' '}
                                                                                <Text>
                                                                                    {
                                                                                        s.SalesPersonName
                                                                                    }
                                                                                </Text>
                                                                            </Tag>
                                                                        </Box>
                                                                    ))}
                                                                <Divider />
                                                                <Text>Vehicle Repairs Section</Text>
                                                                {repairs &&
                                                                    repairs.map((r, i) => (
                                                                        <Box key={i}>
                                                                            <Tag
                                                                                variant="outline"
                                                                                colorScheme="blue"
                                                                            >
                                                                                Start Date:{' '}
                                                                                <Text>
                                                                                    {r.StartDate.substring(
                                                                                        0,
                                                                                        10
                                                                                    )}
                                                                                </Text>
                                                                            </Tag>
                                                                            <Tag
                                                                                variant="outline"
                                                                                colorScheme="blue"
                                                                            >
                                                                                End Date:{' '}
                                                                                <Text>
                                                                                    {r.CompleteDate.substring(
                                                                                        0,
                                                                                        10
                                                                                    )}
                                                                                </Text>
                                                                            </Tag>
                                                                            <Tag
                                                                                variant="outline"
                                                                                colorScheme="blue"
                                                                            >
                                                                                VIN:{' '}
                                                                                <Text>{r.VIN}</Text>
                                                                            </Tag>
                                                                            <Tag
                                                                                variant="outline"
                                                                                colorScheme="blue"
                                                                            >
                                                                                Odometer Reading:{' '}
                                                                                <Text>
                                                                                    {r.Odometer}
                                                                                </Text>
                                                                            </Tag>
                                                                            <Tag
                                                                                variant="outline"
                                                                                colorScheme="blue"
                                                                            >
                                                                                Labor Charges:{' '}
                                                                                <Text>
                                                                                    {r.LaborCharges}
                                                                                </Text>
                                                                            </Tag>
                                                                            <Tag
                                                                                variant="outline"
                                                                                colorScheme="blue"
                                                                            >
                                                                                Total Parts Cost:{' '}
                                                                                <Text>
                                                                                    {
                                                                                        r.TotalPartsCost
                                                                                    }
                                                                                </Text>
                                                                            </Tag>
                                                                            <Tag
                                                                                variant="outline"
                                                                                colorScheme="blue"
                                                                            >
                                                                                Total Costs:{' '}
                                                                                <Text>
                                                                                    {r.TotalCosts}
                                                                                </Text>
                                                                            </Tag>

                                                                            <Tag
                                                                                variant="outline"
                                                                                colorScheme="blue"
                                                                            >
                                                                                Servicewriter Name:{' '}
                                                                                <Text>
                                                                                    {
                                                                                        r.ServiceWriterName
                                                                                    }
                                                                                </Text>
                                                                            </Tag>
                                                                        </Box>
                                                                    ))}
                                                            </PopoverBody>
                                                        </PopoverContent>
                                                    </Portal>
                                                </Popover>
                                            </TdAlign>
                                        </Tr>
                                    ))}
                            </Tbody>
                        </Table>
                    </Stack>
                </Center>
            </Container>
        </OuterContainer>
    )
}

export { SalesByGross }
