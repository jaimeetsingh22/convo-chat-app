'use client'
import { profileCardCaptionTextColor, profileCardTextColor, profileIconsColor } from '@/constants/color'
import { transformImage } from '@/utils/feature'
import { CalendarMonth as CalendarIcon, Face as FaceIcon, AlternateEmail as UsernameIcon } from '@mui/icons-material'
import { Avatar, Stack, Typography } from '@mui/material'
import moment from 'moment'

const Profile = ({ data }) => {

    const { name, username, createdAt, bio, avatar } = data?.user || {};

    return (
        <Stack spacing={'2rem'} direction={'column'} justifyItems={'center'} alignItems={'center'} >
            <a href={avatar?.url} target='_blank' download style={{
                color: 'black'
            }}>

                <Avatar
                    sx={{
                        width: '10rem',
                        height: '10rem',
                        objectFit: 'contain',
                        marginBottom: '1rem',
                        border: '5px solid white'
                    }}
                    src={transformImage(avatar?.url, 400)}
                />
            </a>
            <ProfileCard text={bio} heading={'Bio'} />
            <ProfileCard text={username} Icon={<UsernameIcon style={{ marginBottom: '1rem', color: profileIconsColor }} />} heading={'Username'} />
            <ProfileCard text={name} Icon={<FaceIcon style={{ marginBottom: '1rem', color: profileIconsColor }} />} heading={'Name'} />
            <ProfileCard text={moment(createdAt).fromNow()} Icon={<CalendarIcon style={{ marginBottom: '1rem', color: profileIconsColor }} />} heading={'Joined'} />
        </Stack>
    )
}

const ProfileCard = ({ text, Icon, heading }) => (
    <Stack direction={'row'} spacing={'1rem'} justifyContent={'center'} textAlign={'center'} color={'white'} alignItems={'center'}
        sx={{ width: '100%' }}>
        {Icon && Icon}
        <Stack>
            <Typography variant='body1' color={profileCardTextColor}>
                {text}
            </Typography>
            <Typography color={profileCardCaptionTextColor} variant='caption'>
                {heading}
            </Typography>
        </Stack>
    </Stack>
);


export default Profile;