import React from "react";
import { IconExclamationCircle} from './../../icons'

export default function PageNotFound() {
    return (
        <div className='h-full text-3xl text-gray-700 flex flex-col items-center justify-center text-center w-full '>
            <IconExclamationCircle size='32'/>
            <small>Page Not Found</small>
        </div>
    )
}