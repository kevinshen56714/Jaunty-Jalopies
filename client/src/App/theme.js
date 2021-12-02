
import { extendTheme } from "@chakra-ui/react"
import { StepsStyleConfig as Steps } from 'chakra-ui-steps';

const config = {
    ...theme,
    initialColorMode: "light",
    useSystemColorMode: false
}

const theme = extendTheme({ config,  components: {
    Steps,
  }, })

export default theme