import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
    Heading,
    Center,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Container,
} from '@chakra-ui/react'
import Axios from 'axios'
import config from 'config'
import { CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Legend, Bar } from 'recharts'

export const OuterContainer = styled.div`
    margin: 5% 0;
    max-width: 100%;
    max-height: 100%;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
`

const SalesByColor = () => {
    const [month, setMonth] = useState([])
    const [year, setYear] = useState([])
    const [allTime, setAlltime] = useState([])

    useEffect(() => {
        const getAll = async () => {
            const getMonth = await Axios.get(`${config.apiUrl}/sale/salesbycolor/month`)
            const getYear = await Axios.get(`${config.apiUrl}/sale/salesbycolor/year`)
            const getAlltime = await Axios.get(`${config.apiUrl}/sale/salesbycolor/alltime`)
            setMonth(getMonth.data)
            setYear(getYear.data)
            setAlltime(getAlltime.data)
        }
        getAll()
    }, [])

    return (
        <OuterContainer>
            <Container>
                <Heading as="h1">
                    <center> Sales By Color </center>
                </Heading>

                <Center>
                    <Tabs isFitted variant="enclosed">
                        <TabList mb="1em">
                            <Tab>Month</Tab>
                            <Tab>Year</Tab>
                            <Tab>Alltime</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <BarChart width={1700} height={600} data={month}>
                                    <XAxis dataKey="VColor" stroke="#0a0a0a" interval={0} />
                                    <YAxis
                                        dataKey="VCount"
                                        domain={[0, 15]}
                                        allowDataOverflow={true}
                                    />
                                    <Tooltip
                                        wrapperStyle={{ width: 100, backgroundColor: '#ccc' }}
                                    />
                                    <Legend
                                        width={100}
                                        wrapperStyle={{
                                            top: 40,
                                            right: 20,
                                            backgroundColor: '#f5f5f5',
                                            border: '1px solid #d5d5d5',
                                            borderRadius: 3,
                                            lineHeight: '40px',
                                        }}
                                    />
                                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                    <Bar dataKey="VCount" name="Count" fill="#0a0a0a" />
                                </BarChart>
                            </TabPanel>
                            <TabPanel>
                                <BarChart width={1700} height={600} data={year}>
                                    <XAxis dataKey="VColor" stroke="#0a0a0a" interval={0} />
                                    <YAxis
                                        dataKey="VCount"
                                        name="count"
                                        domain={[0, 60]}
                                        allowDataOverflow={true}
                                    />
                                    <Tooltip
                                        wrapperStyle={{ width: 100, backgroundColor: '#ccc' }}
                                    />
                                    <Legend
                                        width={100}
                                        wrapperStyle={{
                                            top: 40,
                                            right: 20,
                                            backgroundColor: '#f5f5f5',
                                            border: '1px solid #d5d5d5',
                                            borderRadius: 3,
                                            lineHeight: '40px',
                                        }}
                                    />
                                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                    <Bar dataKey="VCount" name="Count" fill="#0a0a0a" />
                                </BarChart>
                            </TabPanel>
                            <TabPanel>
                                <BarChart width={1700} height={600} data={allTime}>
                                    <XAxis dataKey="VColor" stroke="#0a0a0a" interval={0} />
                                    <YAxis
                                        dataKey="VCount"
                                        name="count"
                                        domain={[0, 60]}
                                        allowDataOverflow={true}
                                    />
                                    <Tooltip
                                        wrapperStyle={{ width: 100, backgroundColor: '#ccc' }}
                                    />
                                    <Legend
                                        width={100}
                                        wrapperStyle={{
                                            top: 40,
                                            right: 20,
                                            backgroundColor: '#f5f5f5',
                                            border: '1px solid #d5d5d5',
                                            borderRadius: 3,
                                            lineHeight: '40px',
                                        }}
                                    />
                                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                    <Bar dataKey="VCount" name="Count" fill="#0a0a0a" />
                                </BarChart>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Center>
            </Container>
        </OuterContainer>
    )
}

export { SalesByColor }
