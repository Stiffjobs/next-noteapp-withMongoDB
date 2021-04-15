import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import { Button, Form, Loader } from 'semantic-ui-react'
import { useState, useEffect, createContext } from 'react'
import { useRouter } from 'next/router'

function EditNote({ note }) {
    const [form, setForm] = useState({ title: note.title, description: note.description })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [errors, setErrors] = useState({})
    const router = useRouter()

    useEffect(() => {
        if (isSubmitting) {
            if (Object.keys(errors).length === 0) { //if there's no error
                updateNote()
            } else {
                setIsSubmitting(false)
            }
        }
    }, [errors])

    const updateNote = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/notes/${router.query.id}`, {
                method: 'PUT',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            })
            router.push("/")
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        let errs = validate()
        setErrors(errs)
        setIsSubmitting(true)
    }
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const validate = () => {
        let err = {}

        if (!form.title) {
            err.title = 'Title is required'
        }
        if (!form.description) {
            err.description = 'Description is required'
        }

        return err
    }

    return (
        <div className="form-container">
            <h1>Update Note</h1>
            <div>
                {
                    isSubmitting
                        ? <Loader active inline="centered" />
                        : <Form onSubmit={handleSubmit} >
                            <Form.Input
                                fluid
                                error={errors.title && { content: 'Please enter a title', pointing: 'below' }}
                                label='Title'
                                placeholder='Title'
                                name='title'
                                value={form.title}
                                onChange={handleChange}
                            />
                            <Form.TextArea
                                fluid
                                label='Description'
                                placeholder='Description'
                                name='description'
                                value={form.description}
                                onChange={handleChange}
                                error={errors.title && { content: 'Please enter a description', pointing: 'below' }}
                            />
                            <Button type='submit'>Update</Button>
                        </Form>
                }
            </div>
        </div>
    )
}

EditNote.getInitialProps = async ({ query: { id } }) => {
    const res = await fetch(`http://localhost:3000/api/notes/${id}`)
    const { data } = await res.json()

    return { note: data }
}

export default EditNote

