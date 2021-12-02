import { Step, Steps, useSteps } from 'chakra-ui-steps'
import React, { useState, useEffect } from 'react'
import { Heading, Center, Button, Flex, Text, Box, useToast } from '@chakra-ui/react'
import Axios from '../_helpers/axios'
import SalesModal from './SalesModal'
import CustomerModal from './CustomerModal'
const content = (
    <Flex py={4}>
        <Text> hello </Text>
    </Flex>
)

const steps = [
    { label: 'Step 1', CustomerModal },
    { label: 'Step 2', SalesModal },
    { label: 'Step 3', content },
]

export const EnterSalesTransaction = () => {
    const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
        initialStep: 0,
    })
    const [showSalesModal, setSalesModal] = useState(true)
    const toast = useToast()
    const [showCustomerModal, setShowCustomerModal] = useState(true)
    const [customerData, setCustomerData] = useState(null)

    return (
        <Flex flexDir="column" width="100%">
            <Steps activeStep={activeStep}>
                {steps.map(({ label }, index) => (
                    <Step label={label} key={label}>
                        <Box index={index} />
                        {customerData &&
                            Object.keys(customerData).map((key) => {
                                return (
                                    <div key={key}>
                                        <p style={{ fontWeight: 'bold' }}>
                                            {`${key}: `}
                                            <span style={{ fontWeight: 'normal' }}>
                                                {customerData[key]}
                                            </span>
                                        </p>
                                    </div>
                                )
                            })}
                    </Step>
                ))}
            </Steps>

            {activeStep === 1 && showCustomerModal ? (
                <CustomerModal
                    onClose={() => setShowCustomerModal(false)}
                    setCustomerData={(data) => {
                        setCustomerData(data)
                    }}
                    toast={toast}
                />
            ) : (
                <Box></Box>
            )}
            {activeStep === 2 && showSalesModal ? (
                <SalesModal onClose={() => setSalesModal(false)} />
            ) : (
                <Box></Box>
            )}
            {activeStep === 3 ? (
                <Center p={4} flexDir="column">
                    <Heading fontSize="xl">Sale is confirmed!</Heading>
                </Center>
            ) : (
                <Flex width="100%" justify="flex-end">
                    <Button
                        mr={4}
                        size="sm"
                        variant="ghost"
                        onClick={prevStep}
                        isDisabled={activeStep === 0}
                    >
                        Prev
                    </Button>
                    <Button size="sm" onClick={nextStep}>
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </Flex>
            )}
        </Flex>
    )
}
