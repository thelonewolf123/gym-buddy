import { AlertDialog, Button, Center } from 'native-base'
import { useRef, useState } from 'react'

import useWorkout from '../hooks/useWorkout'

export function DeleteWorkout({
    id,
    open,
    onClose
}: {
    id?: string
    open: boolean
    onClose: () => void
}) {
    const cancelRef = useRef(null)
    const { deleteWorkout } = useWorkout()

    function handleDelete() {
        // Do something with the workout data
        if (!id) {
            return
        }
        deleteWorkout(id)
        onClose()
    }

    return (
        <Center>
            <AlertDialog leastDestructiveRef={cancelRef} isOpen={open}>
                <AlertDialog.Content>
                    <AlertDialog.Header>Delete Workout</AlertDialog.Header>
                    <AlertDialog.Body>
                        Are you sure you want to delete this workout?
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button.Group space={2}>
                            <Button
                                variant="unstyled"
                                onPress={onClose}
                                ref={cancelRef}
                            >
                                Cancel
                            </Button>
                            <Button colorScheme="danger" onPress={handleDelete}>
                                Delete
                            </Button>
                        </Button.Group>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        </Center>
    )
}
