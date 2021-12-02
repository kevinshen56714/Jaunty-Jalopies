import React from 'react'
import { Router, Route } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { history } from '@/_helpers'
import { authenticationService } from '@/_services'
import { LoginPage } from '@/LoginPage'
import { SearchVehicle } from '@/SearchVehicle'
import { SalePage } from '../SalePage/SalePage'
import { AddVehiclePage } from '../AddVehiclePage/AddVehiclePage'
import { RepairPage } from '../RepairPage/RepairPage'
import { SalesByColor } from '../SalePage/SalesByColor'
import { SalesByType } from '../SalePage/SalesByType'
import { SalesByMfr } from '../SalePage/SalesByMfr'
import { SalesByGross } from '../SalePage/SalesByGross'
import { PartStatistics } from '../PartStatistics'
import { BelowCostSales } from '../BelowCostSales'
import { AveTimeInventory } from '../AveTimeInventory'
import { MonthlySales } from '../MonthlySales'
import theme from './theme.js'
import styled from 'styled-components'
import NavBar from './NavBar'
import Axios from 'axios'
import config from 'config'
import { RepairsManufacturer } from '../RepairsManufacturer'
import 'react-table-6/react-table.css'

export const MenuWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`
export const MenuItems = styled.div`
    margin: 20px;
`
export const LoginWrapper = styled.div`
    margin: 20px;
    flex-grow: inherit;
`
export const NavBarWrapper = styled(NavBar)`
    z-index: 1000000;
`

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = { currentUser: null, manufacturers: [], colors: [] }
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe((x) => this.setState({ currentUser: x }))

        const getMfr = Axios.get(`${config.apiUrl}/manufacturer`)
        const getColor = Axios.get(`${config.apiUrl}/color`)
        Promise.all([getMfr, getColor])
            .then(([resMfr, resColor]) => {
                resMfr.data.result.map((item) => {
                    this.setState((prevState) => {
                        return { manufacturers: [...prevState.manufacturers, item.mfrname] }
                    })
                })
                resColor.data.result.map((item) => {
                    this.setState((prevState) => {
                        return { colors: [...prevState.colors, item.color] }
                    })
                })
            })
            .catch((error) => console.log(error.response))
    }

    render() {
        const { currentUser, manufacturers, colors } = this.state
        return (
            <Router history={history}>
                <ChakraProvider theme={theme}>
                    <NavBarWrapper user={currentUser} />
                    <div>
                        <Route exact path="/login" component={LoginPage} />
                        <Route
                            exact
                            path="/"
                            component={() => (
                                <SearchVehicle
                                    user={currentUser}
                                    manufacturers={manufacturers}
                                    colors={colors}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/addvehicle"
                            component={() => (
                                <AddVehiclePage
                                    user={currentUser}
                                    manufacturers={manufacturers}
                                    colors={colors}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/repair"
                            component={() => <RepairPage user={currentUser} />}
                        />
                        <Route exact path="/sale" component={SalePage} />
                        <Route exact path="/part" component={PartStatistics} />
                        <Route exact path="/salesbycolor" component={SalesByColor} />
                        <Route exact path="/salesbytype" component={SalesByType} />
                        <Route exact path="/salesbymfr" component={SalesByMfr} />
                        <Route exact path="/salesbygrossincome" component={SalesByGross} />
                        <Route exact path="/belowcostsales" component={BelowCostSales} />
                        <Route exact path="/repairsmanufacturer" component={RepairsManufacturer} />
                        <Route exact path="/avetimeinventory" component={AveTimeInventory} />
                        <Route exact path="/monthlysales" component={MonthlySales} />
                    </div>
                </ChakraProvider>
            </Router>
        )
    }
}

export { App }
