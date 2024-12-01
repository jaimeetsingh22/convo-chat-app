import { transformImage } from '@/utils/feature';
import { FileOpen as FileOpenIcon } from '@mui/icons-material';
import Image from 'next/image';
import React from 'react'

const RenderAttachment = (file, url) => {
    switch (file) {
        case "video":
            return <video src={url} preload='none' width={'200px'} controls />

        case 'image':
            return <Image src={transformImage(url, 200)} width={'200px'} height={'150px'} style={{
                objectFit: 'contain',
            }} alt="Attachment" />

        case "audio":
            return <audio src={url} preload='none' controls />

        default:
            return <FileOpenIcon />

    }
}

export default RenderAttachment