import React from 'react'
import Axios from '../_helpers/axios'

import ReactTable from 'react-table-6'
import styled from 'styled-components'
import { Heading } from '@chakra-ui/react'

const OuterContainer = styled.div`
    margin: 5%;
    height: 100%;
    display: flex;
    flex-direction: column;
`

const columns = [
    {
        Header: 'Vehicle Type',
        accessor: 'Types',
    },
    {
        Header: 'Average Time in Inventory',
        accessor: 'AvgTime',
    },
]

class AveTimeInventory extends React.Component {
    constructor() {
        super()

        this.state = {
            avetimeinventory: [],
        }
    }

    componentDidMount() {
        Axios.get(`/avetimeinventory`).then((response) => {
            this.setState({ avetimeinventory: response.data.result })
        })
    }

    render() {
        return (
            <OuterContainer>
                <Heading as="h1">
                    <center>Average Time In Inventory</center>
                </Heading>
                <ReactTable
                    style={{
                        marginTop: '5px',
                        maxHeight: '65vh',
                    }}
                    columns={columns}
                    data={this.state.avetimeinventory}
                ></ReactTable>
            </OuterContainer>
        )
    }
}

export { AveTimeInventory }
