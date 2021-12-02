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
        Header: 'Manufacturer',
        accessor: 'ManufacturerName',
    },
    {
        Header: 'Count of Repairs',
        accessor: 'RepairCount',
    },
    {
        Header: 'Sum of All Labor Cost',
        accessor: 'TotalLaborCharges',
    },
    {
        Header: 'Sum of All Part Cost',
        accessor: 'TotalPartsCost',
    },
    {
        Header: 'Sum of All Repair Cost',
        accessor: 'TotalRepairCosts',
    },
]

const columns_dd = [
    {
        Header: 'Vehicle Type',
        accessor: 'Type',
    },
    {
        Header: 'Vehicle Model',
        accessor: 'Model',
    },
    {
        Header: 'Repair Count',
        accessor: 'RepairCount',
    },
    {
        Header: 'Parts Costs',
        accessor: 'PartsCosts',
    },
    {
        Header: 'Labor Costs',
        accessor: 'LaborCosts',
    },
    {
        Header: 'Total Costs',
        accessor: 'TotalCosts',
    },
]

class RepairsManufacturer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            repairsmanufacturer: [],
            repairsmanufacturerdd: null,
            expanded: {},
        }

        this.handleTableCellClick = handleTableCellClick.bind(this)
        this.onExpandedChange = this.onExpandedChange.bind(this)
    }

    async componentDidMount() {
        const repairs_manufacturer_data = await Axios.get(
            `${config.apiUrl}/repairsmanufacturer/allmfr`
        )
        const repairs_manufacturer_dd_data = await Axios.get(
            `${config.apiUrl}/repairsmanufacturer/drilldownmfr/`
        )
        Promise.all([repairs_manufacturer_data, repairs_manufacturer_dd_data]).then(
            ([response_rm, response_rmdd]) => {
                response_rm.data.map((item) => {
                    this.setState({ repairsmanufacturer: response_rm.data })
                }),
                    this.setState({ repairsmanufacturerdd: response_rmdd.data })
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
                    <center> Repairs by Manufacturer/Type/Model </center>
                </Heading>
                <ReactTable
                    style={{
                        marginTop: '5px',
                        maxHeight: '65vh',
                    }}
                    columns={columns}
                    data={this.state.repairsmanufacturer}
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
                                    data={this.state.repairsmanufacturerdd[row.ManufacturerName]}
                                    columns={columns_dd}
                                    // defaultPageSize={3}
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

export { RepairsManufacturer }
