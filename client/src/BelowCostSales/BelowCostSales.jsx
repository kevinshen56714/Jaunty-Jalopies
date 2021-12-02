import React from 'react'
import Axios from 'axios'
import config from 'config'
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
        id: 'PurchaseDate',
        Header: 'Date',
        accessor: (d) => {
            return d.PurchaseDate.split('T')[0]
        },
    },
    {
        Header: 'Invoice Price',
        accessor: 'InvoicePrice',
    },
    {
        Header: 'Sold Price',
        accessor: 'SoldPrice',
    },
    {
        Header: '% of Sold Price/Invoice Price',
        accessor: 'Percentage',
    },
    {
        Header: 'Customer Name',
        accessor: 'CustomerName',
    },
    {
        Header: 'Salesperson Name',
        accessor: 'SalesPersonName',
    },
]

class BelowCostSales extends React.Component {
    constructor() {
        super()

        this.state = {
            belowcostsales: [],
        }
    }

    componentDidMount() {
        Axios.get(`${config.apiUrl}/belowcostsales`).then((response) => {
            this.setState({ belowcostsales: response.data.result })
        })
    }

    getTrProps(state, rowInfo, instance) {
        if (rowInfo) {
            return {
                style: {
                    background: rowInfo.row.Percentage <= 95 ? 'red' : 'empty',
                },
            }
        }
        return {}
    }

    render() {
        return (
            <OuterContainer>
                <Heading as="h1">
                    <center> Below Cost Sales </center>
                </Heading>
                <ReactTable
                    columns={columns}
                    data={this.state.belowcostsales}
                    getTrProps={this.getTrProps}
                    style={{
                        marginTop: '5px',
                        maxHeight: '65vh',
                    }}
                />
            </OuterContainer>
        )
    }
}

export { BelowCostSales }
