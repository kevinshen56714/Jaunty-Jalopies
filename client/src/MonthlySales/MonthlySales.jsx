import React from 'react'
import Axios from 'axios'
import config from 'config'
import { Heading } from '@chakra-ui/react'
import ReactTable from 'react-table-6'
import styled from 'styled-components'
import { handleTableCellClick } from './tableFunctions'

const OuterContainer = styled.div`
    margin: 5%;
    height: 100%;
    display: flex;
    flex-direction: column;
`

const columns = [
    {
        Header: 'Year',
        accessor: 'sale_year',
    },
    {
        Header: 'Month',
        accessor: 'sale_month',
    },
    {
        Header: 'Total Vehicles Sold',
        accessor: 'TotalVehiclesSold',
    },
    {
        Header: 'Total Sales Income',
        accessor: 'TotalSalesIncome',
    },
    {
        Header: '% of Sold Price/Invoice Price',
        accessor: 'Percentage',
    },
]

const columns_dd = [
    {
        Header: 'Salesperson Name',
        accessor: 'SalesPersonName',
    },

    {
        Header: 'Total Vehicles Sold',
        accessor: 'TotalVehiclesSold',
    },
    {
        Header: 'Total Sales',
        accessor: 'TotalSales',
    },
]

class MonthlySales extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            monthlysales: [],
            monthlysalesdd: [],
            expanded: {},
        }

        this.handleTableCellClick = handleTableCellClick.bind(this)
        this.onExpandedChange = this.onExpandedChange.bind(this)
    }

    componentDidMount() {
        const monthly_sales_data = Axios.get(`${config.apiUrl}/monthlysales/allmonths`)
        const monthly_sales_dd_data = Axios.get(
            `${config.apiUrl}/monthlysales/drilldownmonthlysales`
        )
        Promise.all([monthly_sales_data, monthly_sales_dd_data]).then(
            ([response_ms, response_msdd]) => {
                response_ms.data.map((item) => {
                    this.setState({ monthlysales: response_ms.data })
                }),
                    this.setState({ monthlysalesdd: response_msdd.data })
            }
        )
    }

    onExpandedChange(newExpanded) {
        this.setState({
            expanded: newExpanded,
        })
    }

    render() {
        return (
            <OuterContainer>
                <Heading as="h1">
                    <center> Monthly Sales </center>
                </Heading>

                <ReactTable
                    style={{
                        marginTop: '5px',
                        maxHeight: '65vh',
                    }}
                    columns={columns}
                    data={this.state.monthlysales}
                    getTrProps={this.handleTableCellClick}
                    onExpandedChange={(newExpanded) => this.onExpandedChange(newExpanded)}
                    expanded={this.state.expanded}
                    SubComponent={({ row }) => {
                        return (
                            <div style={{ padding: '20px' }}>
                                <em>Drill-down Table</em>
                                <br />
                                <br />
                                <ReactTable
                                    data={
                                        this.state.monthlysalesdd[(row.sale_year, row.sale_month)]
                                    }
                                    columns={columns_dd}
                                    showPagination={false}
                                />
                            </div>
                        )
                    }}
                />
                <br />
            </OuterContainer>
        )
    }
}
export { MonthlySales }
