import { fileFormat } from '@/utils/feature';
import { Box, Typography } from '@mui/material';
import moment from 'moment';
import React, { memo } from 'react'
import RenderAttachment from './RenderAttachment';
import { motion } from "framer-motion"
import { notSameSenderMessageBackgroundColor, notSameSendersMessageContentTextColor, notSameSendersNameTextColor, sameSenderMessageBackgroundColor, SameSendersMessageContentTextColor, timeAgoTextColor } from '@/constants/color';

const MessageComponent = ({ message, user }) => {
    const { sender, attachments = [], content, createdAt } = message;
    const sameSender = sender?._id === user?.id;
    const timeAgo = moment(createdAt).fromNow();

    return (
        <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            whileInView={{ opacity: 1, x: 0 }}
            style={{
                alignSelf: sameSender ? 'flex-end' : 'flex-start',
                backgroundColor: sameSender ? sameSenderMessageBackgroundColor : notSameSenderMessageBackgroundColor,
                color: 'black',
                borderRadius: sameSender ? '10px 20px 0px 20px' : '0px 20px 10px 20px',
                padding: '0.5rem',
                width: 'fit-content'
            }}
        >
            {
                !sameSender && (<Typography color={notSameSendersNameTextColor} fontWeight={'600'} variant='caption'>
                    {sender.name}
                </Typography>)
            }

            {
                content && <Typography color={sameSender ? SameSendersMessageContentTextColor : notSameSendersMessageContentTextColor}>{content}</Typography>
            }


            {
                attachments.length > 0 && (
                    attachments.map((attachment, index) => {
                        const { url } = attachment;
                        const file = fileFormat(url);
                        return <Box key={index}>
                            <a href={url} target='_blank' download style={{
                                color: 'black'
                            }}>

                                {RenderAttachment(file, url)}
                            </a>
                        </Box>
                    })
                )
            }

            <Typography variant='caption' color={timeAgoTextColor} >{timeAgo}</Typography>

        </motion.div>
    )
}

export default memo(MessageComponent);