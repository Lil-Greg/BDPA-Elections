import { useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import UserContext from "../../../context/UserContext";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

type Props = {
    show: boolean
}

export default function ChangePfpModal({ show }: Props) {
    const { user } = useContext(UserContext);
    const changeProfile = useMutation(api.profilePicture.changeProfilePicture);
    const [newPicture, setNewPicture] = useState('');

    const handleClose = () => {
        return show = !show;
    }
    if (user?._id !== undefined) {
        const handleChangePfp = () => {
            changeProfile({ id: user._id, newPictureFile: newPicture });
        }
        return (
            <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Change Your Profile Picture</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Although you can edit your election, you cannot add more options.
                        <Modal.Dialog>
                            Showing Modal: {show}
                            <br />
                            User Id: {user?._id}
                        </Modal.Dialog>
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleChangePfp}>
                            Change Profile Picture
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    } else {
        return (
            <>
                User Is Not Defined
            </>
        );
    }

}