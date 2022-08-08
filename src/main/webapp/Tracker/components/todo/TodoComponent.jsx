import React, { Component } from 'react';
import moment from 'moment';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import TodoDataService from '../../api/todo/TodoDataService';
import AuthenticationService from '../authentication/AuthenticationService'

class TodoComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            description: '',
            targetDate: ''
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.validate = this.validate.bind(this);
    }

    onSubmit(values) {

        let username = AuthenticationService.getLoggedInUserName();
        let id = +this.state.id;

        let todo = {
            description: values.description,
            targetDate: values.targetDate,
            isDone: false
        }

        if (id === -1) {
            TodoDataService.postTodos(username, todo).then(
                () => this.props.history.push('/todos')
            );
        } else {
            TodoDataService.updateTodos(username, id, todo).then(
                () => this.props.history.push('/todos')
            );
        }

    }

    validate(values) {
        let errors = {};
        if (!values.description) {
            errors.description = 'Enter a Description'
        } else if (values.description.length < 5) {
            errors.description = 'Enter atleast 5 Characters in Description'
        }

        if (!moment(values.targetDate).isValid()) {
            errors.targetDate = 'Enter a Valid Target Date';
        }

        return errors;
    }

    componentDidMount() {
        let id = +this.state.id;
        if (id !== -1) {
            let username = AuthenticationService.getLoggedInUserName();
            TodoDataService.retrieveTodos(username, id)
                .then(
                    response => {
                        this.setState(
                            {
                                description: response.data.description,
                                targetDate: moment(response.data.targetDate).format('YYYY-MM-DD')
                            }
                        )
                    }
                )
        }

    }

    render() {

        let { description, targetDate } = this.state;
        return (
            <div className="container">
                <h2>Todo Component for ID - {this.props.match.params.id}</h2>
                <Formik initialValues={{ description, targetDate }} onSubmit={this.onSubmit} validate={this.validate}
                    validateOnChange={false} validateOnBlur={false} enableReinitialize={true}>
                    {
                        (props) => (
                            <Form>
                                <ErrorMessage name="description" component="div" className="alert alert-warning"></ErrorMessage>
                                <ErrorMessage name="targetDate" component="div" className="alert alert-warning"></ErrorMessage>

                                <fieldset className="form-group">
                                    <label>Description</label>
                                    <Field className="form-control" type="text" name="description" />
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>Target Date</label>
                                    <Field className="form-control" type="date" name="targetDate" />
                                </fieldset>

                                <button className="btn btn-success" type="submit"> Save</button>

                            </Form>
                        )
                    }
                </Formik>

            </div>
        )
    }

}

export default TodoComponent;