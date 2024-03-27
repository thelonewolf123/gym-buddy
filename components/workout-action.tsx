import {
    Actionsheet,
    Box,
    Button,
    Center,
    Row,
    Text,
    useDisclose,
    View
} from 'native-base'
import { useEffect, useState } from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import { DeleteWorkout } from './delete-workout'
import WorkoutForm from './workout-form'

export function WorkoutAction({
    id,
    onClose: onCloseEvent
}: {
    id?: string
    onClose: () => void
}) {
    const { isOpen, onOpen, onClose } = useDisclose()
    const [actionItem, setActionItem] = useState<{
        action: 'edit' | 'delete'
    }>()

    useEffect(() => {
        if (id) {
            onOpen()
        }
    }, [id])

    if (!id) {
        return null
    }

    function actionHandler(action: 'edit' | 'delete') {
        setActionItem({ action })
    }

    return (
        <Center>
            {actionItem?.action &&
                (actionItem.action === 'delete' ? (
                    <DeleteWorkout
                        onClose={() => {
                            setActionItem(undefined)
                            onClose()
                        }}
                        id={id}
                        open={actionItem.action === 'delete'}
                    />
                ) : (
                    actionItem.action === 'edit' && (
                        <WorkoutForm
                            id={id}
                            isOpen={actionItem.action === 'edit'}
                        />
                    )
                ))}
            <Actionsheet
                isOpen={isOpen}
                onClose={() => {
                    onClose()
                    onCloseEvent()
                }}
            >
                <Actionsheet.Content>
                    <Box w="100%" h={60} px={4} justifyContent="center">
                        <Text fontSize="16" color="gray.500">
                            Workout Actions
                        </Text>
                    </Box>
                    <Actionsheet.Item onPress={() => actionHandler('edit')}>
                        <Row rounded={'xl'}>
                            <MaterialCommunityIcons
                                name="pencil"
                                size={18}
                                bold
                            />
                            <Text px={4}>Edit</Text>
                        </Row>
                    </Actionsheet.Item>
                    <Actionsheet.Item onPress={() => actionHandler('delete')}>
                        <Row rounded={'xl'}>
                            <MaterialCommunityIcons
                                name="trash-can"
                                size={18}
                                color={'red'}
                            />
                            <Text px={4} bold color={'red.500'}>
                                Delete
                            </Text>
                        </Row>
                    </Actionsheet.Item>
                </Actionsheet.Content>
            </Actionsheet>
        </Center>
    )
}
