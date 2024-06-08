type Props = {
    userId: string
    show: boolean
}

export default function ChangePfpModal({ userId, show }: Props) {
    show = false;
    return (
        <>
            showing Modal: {show}
            User Id: {userId}
        </>
    )
}