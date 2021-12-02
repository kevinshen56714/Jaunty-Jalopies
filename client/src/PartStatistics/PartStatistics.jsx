import React from 'react'
import Axios from 'axios'
import config from 'config'
import { Heading } from '@chakra-ui/react'
import ReactTable from 'react-table-6'
import styled from 'styled-components'

const OuterContainer = styled.div`
    margin: 5%;
    height: 100%;
    display: flex;
    flex-direction: column;
`

const columns = [
    {
        Header: 'Vendor Name',
        accessor: 'vendorname',
    },
    {
        Header: 'Total Number of Parts',
        accessor: 'NumParts',
    },
    {
        Header: 'Total Money Spent',
        accessor: 'TotalSpent',
    },
]

class PartStatistics extends React.Component {
    constructor() {
        super()

        this.state = {
            partstats: [],
        }
    }

    componentDidMount() {
        Axios.get(`${config.apiUrl}/part`).then((response) => {
            this.setState({ partstats: response.data.result })
        })
    }

    render() {
        return (
            <OuterContainer>
                <Heading as="h1">
                    <center> Part Statistics </center>
                </Heading>
                <ReactTable
                    style={{
                        marginTop: '5px',
                        maxHeight: '65vh',
                    }}
                    columns={columns}
                    data={this.state.partstats}
                />
            </OuterContainer>
        )
    }
}

export { PartStatistics }
