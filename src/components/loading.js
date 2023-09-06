import { Oval } from "react-loader-spinner"

export default function Loader() {
    return (

        <Oval
            ariaLabel="loading-indicator"
            height={50}
            width={50}
            strokeWidth={5}
            strokeWidthSecondary={3}
            color="blue"
            secondaryColor="grey"
        />
    )
}