import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
    chakra,
    Flex,
    HStack,
    Link,
    Button,
    useColorModeValue,
    Box,
    useDisclosure,
    Spacer,
    IconButton,
    SimpleGrid,
    VStack,
    CloseButton,
    useColorMode,
    Badge,
    useToast,
} from '@chakra-ui/react'
import { IoIosArrowDown } from 'react-icons/io'
import { AiFillHome, AiOutlineInbox, AiOutlineMenu } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { authenticationService } from '../_services'
import { Role } from '../_helpers'
import Axios from 'axios'
import config from 'config'

const ReportPageAccess = [Role.Manager, Role.Owner]
const RepairPageAccess = [Role.ServiceWriter, Role.Owner]
const AddVehiclePageAccess = [Role.InventoryClerk, Role.Owner]
const ResetAccess = [Role.Owner]
const reportList = [
    { to: '/salesbycolor', title: 'Sales by Color' },
    { to: '/salesbytype', title: 'Sales by Type' },
    { to: '/salesbymfr', title: 'Sales by Manufacturer' },
    { to: '/salesbygrossincome', title: 'Sales by Gross Income' },
    { to: '/repairsmanufacturer', title: 'Repairs by Manufacturer/Type/Model' },
    { to: '/belowcostsales', title: 'Below Cost Sales' },
    { to: '/avetimeinventory', title: 'Average Time in Inventory' },
    { to: '/part', title: 'Parts Statistics' },
    { to: '/monthlysales', title: 'Monthly Sales' },
]

export default function NavBar(props) {
    const bg = useColorModeValue('white', 'gray.800')
    const cl = useColorModeValue('gray.800', 'white')
    const mobileNav = useDisclosure()
    const { toggleColorMode: toggleMode } = useColorMode()
    const text = useColorModeValue('dark', 'light')
    const SwitchIcon = useColorModeValue(FaMoon, FaSun)
    const ic = useColorModeValue('brand.600', 'brand.50')
    const hbg = useColorModeValue('gray.50', 'brand.400')
    const tcl = useColorModeValue('gray.900', 'gray.50')
    const dcl = useColorModeValue('gray.500', 'gray.50')
    const [roles, setRoles] = useState([])
    const toast = useToast()

    const checkRoles = () => {
        setRoles([])
        if (props.user) {
            const roleData = [
                { role: Role.Salesperson, val: props.user.sp },
                { role: Role.InventoryClerk, val: props.user.ic },
                { role: Role.ServiceWriter, val: props.user.sw },
                { role: Role.Manager, val: props.user.mgr },
                { role: Role.Owner, val: props.user.own },
            ]
            roleData.map((roleObj, i) => {
                if (roleObj.val == 1) {
                    setRoles((currentRoles) => [...currentRoles, roleObj.role])
                }
            })
        }
    }

    const resetDB = () => {
        Axios.post(`${config.apiUrl}/reset`, {})
            .then((response) => {
                toast({
                    title: 'Database Reset!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
            })
            .catch((error) => {
                console.log(error.response.data.message)
            })
    }

    useEffect(() => {
        checkRoles()
    }, [props.user])

    const StyledDropdownItems = (props) => {
        return (
            <div
                style={{
                    flex: '1',
                    fontSize: 'clamp(1rem, -0.875rem + 8.333333vw, 3.5rem)',
                }}
            >
                <Link
                    as={NavLink}
                    to={props.to}
                    m={-3}
                    p={3}
                    display="flex"
                    alignItems="start"
                    rounded="lg"
                    _hover={{ bg: hbg }}
                >
                    <chakra.svg
                        h={6}
                        w={6}
                        color={ic}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        {props.icon}
                    </chakra.svg>
                    <Box ml={4}>
                        <chakra.p fontSize="sm" fontWeight="700" color={tcl}>
                            {props.title}
                        </chakra.p>
                        <chakra.p mt={1} fontSize="sm" color={dcl}>
                            {props.children}
                        </chakra.p>
                    </Box>
                </Link>
            </div>
        )
    }

    const Features = (
        <React.Fragment>
            <SimpleGrid
                columns={9}
                pos="relative"
                gap={{ base: 8, sm: 10 }}
                px={4}
                py={10}
                p={{ sm: 9 }}
                spacingX="20px"
            >
                {reportList.map(({ to, title }, i) => (
                    <StyledDropdownItems key={i} to={to} title={title} />
                ))}
            </SimpleGrid>
        </React.Fragment>
    )

    const MobileNavContent = (
        <VStack
            pos="absolute"
            top={0}
            left={0}
            right={0}
            display={mobileNav.isOpen ? 'flex' : 'none'}
            flexDirection="column"
            p={2}
            pb={4}
            m={2}
            bg={bg}
            spacing={3}
            rounded="sm"
            shadow="sm"
        >
            <CloseButton
                aria-label="Close menu"
                justifySelf="self-start"
                onClick={mobileNav.onClose}
            />
            <Button w="full" variant="ghost" leftIcon={<AiFillHome />}>
                Home
            </Button>
            <Button w="full" variant="solid" colorScheme="brand" leftIcon={<AiOutlineInbox />}>
                Login
            </Button>
        </VStack>
    )

    const NavBarButton = (props) => (
        <NavLink to={props.to}>
            <Button
                bg={bg}
                color="gray.500"
                display="inline-flex"
                alignItems="center"
                fontSize="md"
                _hover={{ color: cl }}
                _focus={{ boxShadow: 'none' }}
            >
                {props.title}
            </Button>
        </NavLink>
    )

    return (
        <React.Fragment>
            <chakra.header h="full" bg={bg} w="full" px={{ base: 2, sm: 4 }} py={4}>
                <Flex alignItems="center" justifyContent="space-between" mx="auto">
                    <Link display="flex" alignItems="center" href="/"></Link>
                    <Box display={{ base: 'none', md: 'inline-flex' }}>
                        <HStack spacing={1}>
                            <NavBarButton to="/" title="Home" />
                            {AddVehiclePageAccess.some((i) => roles.includes(i)) && (
                                <NavBarButton to="/addvehicle" title="Add Vehicle" />
                            )}
                            {RepairPageAccess.some((i) => roles.includes(i)) && (
                                <NavBarButton to="/repair" title="Repair" />
                            )}
                            {ReportPageAccess.some((i) => roles.includes(i)) && (
                                <Box role="group">
                                    <Button
                                        bg={bg}
                                        color="gray.500"
                                        alignItems="center"
                                        fontSize="md"
                                        _hover={{ color: cl }}
                                        _focus={{ boxShadow: 'none' }}
                                        rightIcon={<IoIosArrowDown />}
                                    >
                                        View Report
                                    </Button>
                                    <Box
                                        pos="absolute"
                                        left={0}
                                        w="full"
                                        display="none"
                                        _groupHover={{ display: 'block' }}
                                    >
                                        {Features}
                                    </Box>
                                </Box>
                            )}
                        </HStack>
                    </Box>
                    <Spacer />
                    <Box display="flex" alignItems="center">
                        <HStack spacing={1}>
                            <Badge borderRadius="full" px="3" colorScheme="teal">
                                {props.user
                                    ? `${props.user.firstname} ${props.user.lastname}`
                                    : 'Anonymous'}
                            </Badge>
                            <Box
                                color="gray.500"
                                fontWeight="semibold"
                                letterSpacing="wide"
                                fontSize="xs"
                                ml="2"
                            >
                                {roles.map((role, i) => {
                                    return `• ${role} `
                                })}
                            </Box>
                            {props.user ? (
                                <Button
                                    colorScheme="brand"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => authenticationService.logout()}
                                >
                                    Sign out
                                </Button>
                            ) : (
                                <NavLink to="/login">
                                    <Button colorScheme="brand" variant="ghost" size="sm">
                                        Sign in
                                    </Button>
                                </NavLink>
                            )}
                            {ResetAccess.some((i) => roles.includes(i)) && (
                                <Button
                                    colorScheme="red"
                                    variant="ghost"
                                    size="sm"
                                    onClic={resetDB}
                                >
                                    Reset DB
                                </Button>
                            )}
                        </HStack>
                        <IconButton
                            size="md"
                            fontSize="lg"
                            aria-label={`Switch to ${text} mode`}
                            variant="ghost"
                            color="current"
                            ml={{ base: '0', md: '3' }}
                            onClick={toggleMode}
                            icon={<SwitchIcon />}
                        />
                        <IconButton
                            display={{ base: 'flex', md: 'none' }}
                            aria-label="Open menu"
                            fontSize="20px"
                            color={useColorModeValue('gray.800', 'inherit')}
                            variant="ghost"
                            icon={<AiOutlineMenu />}
                            onClick={mobileNav.onOpen}
                        />
                    </Box>
                </Flex>

                {MobileNavContent}
            </chakra.header>
        </React.Fragment>
    )
}
